'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { IoReorderTwoOutline } from 'react-icons/io5';
import type { CanvasItem } from '@/store/useEditorStore';
import styles from './StudioWorkspace.module.css';

interface Move {
  id: string;
  from: number;
  to: number;
  order: string;
  started: boolean;
  pointerId?: number;
  startY: number;
  y: number;
}

export function ReorderableDesignList({ canvases, disabled, label, onReorder, children }: {
  canvases: CanvasItem[];
  disabled: boolean;
  label: string;
  onReorder: (id: string, toIndex: number) => void;
  children: (canvas: CanvasItem, index: number) => ReactNode;
}) {
  const list = useRef<HTMLDivElement>(null);
  const gesture = useRef<Move | null>(null);
  const focusAfterDrop = useRef<string | null>(null);
  const frame = useRef(0);
  const [move, setMove] = useState<Move | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const instructionsId = useId();
  const order = JSON.stringify(canvases.map(canvas => canvas.id));
  const active = move?.order === order && !disabled ? move : null;
  const boundary = active && active.to !== active.from ? active.to + (active.to > active.from ? 1 : 0) : -1;

  if (move && (move.order !== order || disabled)) setMove(null);

  useLayoutEffect(() => {
    const id = focusAfterDrop.current;
    if (!id) return;
    Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[data-reorder-handle]') || []).find(handle => handle.dataset.reorderHandle === id)?.focus({ preventScroll: true });
    focusAfterDrop.current = null;
  }, [order]);

  useEffect(() => () => {
    gesture.current = null;
    cancelAnimationFrame(frame.current);
  }, [order, disabled]);

  function finish(commit: boolean) {
    if (commit && gesture.current?.pointerId !== undefined) positionPointer();
    const current = gesture.current;
    gesture.current = null;
    cancelAnimationFrame(frame.current);
    setMove(null);
    if (!current) return;
    if (commit && current.started && current.order === order && !disabled && current.to !== current.from) {
      focusAfterDrop.current = current.id;
      onReorder(current.id, current.to);
      setAnnouncement(`Moved ${label} ${current.from + 1} to position ${current.to + 1} of ${canvases.length}.`);
    } else setAnnouncement('Reordering cancelled.');
  }

  function positionPointer() {
    const current = gesture.current;
    if (!current?.started || !list.current) return;
    const cards = Array.from(list.current.querySelectorAll<HTMLElement>('[data-reorder-id]')).filter(card => card.dataset.reorderId !== current.id);
    const to = cards.filter(card => {
      const rect = card.getBoundingClientRect();
      return current.y > rect.top + rect.height / 2;
    }).length;
    if (to !== current.to) {
      gesture.current = { ...current, to };
      setMove(gesture.current);
    }
  }

  function trackPointer() {
    const current = gesture.current;
    const element = list.current;
    if (!current || current.pointerId === undefined || !element) return;
    if (current.started) {
      const bounds = element.getBoundingClientRect();
      const edge = 48;
      const delta = current.y < bounds.top + edge ? -Math.min(14, (bounds.top + edge - current.y) / 3)
        : current.y > bounds.bottom - edge ? Math.min(14, (current.y - bounds.bottom + edge) / 3) : 0;
      element.scrollTop += delta;
      positionPointer();
    }
    frame.current = requestAnimationFrame(trackPointer);
  }

  return <div ref={list} className={styles.thumbnails}>
    <p id={instructionsId} className={styles.visuallyHidden}>Drag the handle to reorder. Press Space to grab, arrow keys to move, Enter or Space to drop, and Escape to cancel.</p>
    <p role="status" aria-live="polite" aria-atomic="true" className={styles.visuallyHidden}>{announcement}</p>
    {canvases.map((canvas, index) => <div key={canvas.id} data-reorder-id={canvas.id} className={`${styles.thumbnailCard} ${active?.id === canvas.id && active.started ? styles.reordering : ''}`}>
      {boundary === index && <div className={styles.insertionMarker} aria-hidden="true" />}
      <button
        data-reorder-handle={canvas.id}
        className={styles.reorderHandle}
        aria-label={`Reorder ${label} ${index + 1}`}
        aria-describedby={instructionsId}
        aria-pressed={active?.id === canvas.id && active.started}
        disabled={disabled || canvases.length < 2}
        title="Drag to reorder. Press Space to use the keyboard."
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || gesture.current) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          gesture.current = { id: canvas.id, from: index, to: index, order, started: false, pointerId: event.pointerId, startY: event.clientY, y: event.clientY };
          setMove(gesture.current);
          frame.current = requestAnimationFrame(trackPointer);
        }}
        onPointerMove={event => {
          const current = gesture.current;
          if (!current || current.pointerId !== event.pointerId) return;
          const started = current.started || Math.abs(event.clientY - current.startY) > 4;
          gesture.current = { ...current, y: event.clientY, started };
          if (started !== current.started) setMove(gesture.current);
        }}
        onPointerUp={event => { if (gesture.current?.pointerId === event.pointerId) finish(true); }}
        onPointerCancel={() => finish(false)}
        onLostPointerCapture={() => { if (gesture.current?.pointerId !== undefined) finish(false); }}
        onKeyDown={event => {
          const current = gesture.current;
          if (event.key === 'Escape' && current) { event.preventDefault(); finish(false); return; }
          if (current?.pointerId !== undefined) return;
          if (event.key === ' ' || (event.key === 'Enter' && current)) {
            event.preventDefault();
            if (current) finish(true);
            else {
              gesture.current = { id: canvas.id, from: index, to: index, order, started: true, startY: 0, y: 0 };
              setMove(gesture.current);
              setAnnouncement(`Picked up ${label} ${index + 1}. Use arrow keys to choose its position.`);
            }
          } else if (current?.id === canvas.id && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            const to = Math.max(0, Math.min(canvases.length - 1, current.to + (['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1)));
            gesture.current = { ...current, to };
            setMove(gesture.current);
            setAnnouncement(`Position ${to + 1} of ${canvases.length}.`);
            list.current?.querySelectorAll('[data-reorder-id]')[to]?.scrollIntoView({ block: 'nearest' });
          }
        }}
        onBlur={() => { if (gesture.current?.id === canvas.id && gesture.current.pointerId === undefined) finish(false); }}
      ><IoReorderTwoOutline />Move</button>
      {children(canvas, index)}
    </div>)}
    {boundary === canvases.length && <div className={styles.insertionMarker} aria-hidden="true" />}
  </div>;
}
