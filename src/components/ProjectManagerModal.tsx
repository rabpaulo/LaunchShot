'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useEditorStore } from '@/store/useEditorStore';
import {
  IoClose,
  IoAddCircleOutline,
  IoCloudUploadOutline,
  IoDownloadOutline,
  IoCopyOutline,
  IoTrashOutline,
  IoCheckmark,
  IoPencilOutline,
  IoFolderOpenOutline,
  IoPhonePortraitOutline,
} from 'react-icons/io5';

interface ProjectManagerModalProps {
  onClose: () => void;
}

export function ProjectManagerModal({ onClose }: ProjectManagerModalProps) {
  const {
    projects,
    activeProjectId,
    createProject,
    switchProject,
    renameProject,
    duplicateProject,
    deleteProject,
    exportProjectFile,
    exportAllProjectsFile,
    importProjectsJson,
    globalSettings,
  } = useEditorStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = globalSettings.theme !== 'light';

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameProject(id, editingName.trim());
      toast.success('Project renamed');
    }
    setEditingId(null);
  };

  const handleCreateNew = () => {
    const name = newProjectName.trim() || `App Project ${projects.length + 1}`;
    createProject(name);
    setNewProjectName('');
    setShowCreateInput(false);
    toast.success(`Created "${name}"`);
  };

  const handleImportText = async (text: string) => {
    try {
      const result = await importProjectsJson(text);
      if (result.success) {
        if (result.count === 1) {
          toast.success('Project imported successfully');
        } else {
          toast.success(`Imported ${result.count} projects successfully`);
        }
      } else {
        toast.error(result.error || 'Invalid project JSON format.');
      }
    } catch {
      toast.error('Failed to import project JSON.');
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await handleImportText(text);
    } catch {
      toast.error('Failed to read project file.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await handleImportText(text);
    } catch {
      toast.error('Failed to read dropped file.');
    }
  };

  const handleExportAll = async () => {
    if (isExportingAll) return;
    setIsExportingAll(true);
    try {
      await exportAllProjectsFile();
      toast.success('Workspace backup exported');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to export workspace backup.');
    } finally {
      setIsExportingAll(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDraggingFile(false);
        }
      }}
      onDrop={handleDrop}
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl border-[1.5px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
          isDark
            ? 'bg-[#141c18] border-[#34443a] text-[#f3f6f4]'
            : 'bg-white border-[#c5cec2] text-[#14201d]'
        }`}
      >
        {isDraggingFile && (
          <div
            className={`absolute inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 border-[2.5px] border-dashed m-3 rounded-2xl animate-in fade-in ${
              isDark
                ? 'bg-[#14261d]/95 border-[#2e855c] text-[#f3f6f4]'
                : 'bg-[#eef5e6]/95 border-[#1f5c3f] text-[#14281e]'
            }`}
          >
            <IoCloudUploadOutline
              className={`w-12 h-12 animate-bounce ${isDark ? 'text-[#73aa84]' : 'text-[#1f5c3f]'}`}
            />
            <div className="text-center">
              <h3 className="text-base font-bold">Drop JSON Project File</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#a3b2aa]' : 'text-[#4f6158]'}`}>
                Release to import single or multi-project JSON files.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b-[1.5px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isDark
                  ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40'
                  : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
              }`}
            >
              <IoFolderOpenOutline className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] font-bold tracking-[1.5px] uppercase block ${
                  isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'
                }`}
              >
                Workspace & Showcases
              </span>
              <h2 className="text-xl font-bold tracking-tight">Projects & Drafts</h2>
              <p
                className={`text-xs truncate mt-0.5 ${
                  isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'
                }`}
              >
                Switch between app showcases, export backups, or import JSON project files.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json,.launchshot,application/json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border-[1.5px] transition-all flex items-center gap-1.5 shadow-sm ${
                isDark
                  ? 'bg-[#1d2922] hover:bg-[#283a2f] border-[#44594c] hover:border-[#73aa84] text-[#f3f6f4]'
                  : 'bg-white hover:bg-[#e7efe3] border-[#b6c4b2] hover:border-[#4a7855] text-[#14201d]'
              }`}
              title="Import project from JSON file"
            >
              <IoCloudUploadOutline className="w-4 h-4" />
              Import JSON
            </button>

            <button
              onClick={handleExportAll}
              disabled={isExportingAll}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border-[1.5px] transition-all flex items-center gap-1.5 shadow-sm ${
                isDark
                  ? 'bg-[#1d2922] hover:bg-[#283a2f] border-[#44594c] hover:border-[#73aa84] text-[#f3f6f4] disabled:opacity-50'
                  : 'bg-white hover:bg-[#e7efe3] border-[#b6c4b2] hover:border-[#4a7855] text-[#14201d] disabled:opacity-50'
              }`}
              title="Export all projects as JSON backup bundle"
            >
              <IoDownloadOutline className="w-4 h-4" />
              Export All (JSON)
            </button>

            <button
              onClick={() => setShowCreateInput(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm ${
                isDark
                  ? 'bg-[#2e855c] hover:bg-[#38a16f] border border-[#2e855c]'
                  : 'bg-[#1f5c3f] hover:bg-[#16452f] border border-[#1f5c3f]'
              }`}
            >
              <IoAddCircleOutline className="w-4 h-4" />
              New Project
            </button>

            <button
              aria-label="Close projects"
              onClick={onClose}
              className={`p-2 rounded-xl border-[1.5px] transition-colors ${
                isDark
                  ? 'border-[#44594c] hover:bg-[#283a2f] text-[#f3f6f4]'
                  : 'border-[#b6c4b2] hover:bg-[#e7efe3] text-[#14201d]'
              }`}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Create Input */}
        {showCreateInput && (
          <div
            className={`px-6 py-4 border-b-[1.5px] flex items-center gap-3 ${
              isDark ? 'bg-[#111814] border-[#34443a]' : 'bg-[#f2f5ee] border-[#c5cec2]'
            }`}
          >
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter new project name (e.g. Finance App v2)..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNew();
                if (e.key === 'Escape') setShowCreateInput(false);
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border-[1.5px] outline-none transition-all ${
                isDark
                  ? 'bg-[#1b2620] border-[#44594c] text-[#f3f6f4] placeholder-[#a3b2aa] focus:border-[#73aa84] focus:ring-2 focus:ring-[#2e855c]/25'
                  : 'bg-white border-[#b6c4b2] text-[#14201d] placeholder-[#4a5752] focus:border-[#1f5c3f] focus:ring-2 focus:ring-[#1f5c3f]/20'
              }`}
            />
            <button
              onClick={handleCreateNew}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                isDark
                  ? 'bg-[#2e855c] hover:bg-[#38a16f]'
                  : 'bg-[#1f5c3f] hover:bg-[#16452f]'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateInput(false)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isDark ? 'text-[#a3b2aa] hover:text-[#f3f6f4]' : 'text-[#4a5752] hover:text-[#14201d]'
              }`}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            const isEditing = editingId === proj.id;
            const canvasCount = proj.canvases?.length || 0;
            const targetSizeName = proj.globalSettings?.targetSize || 'ios-6.5';

            return (
              <div
                key={proj.id}
                className={`p-4 rounded-2xl border-[1.5px] transition-all flex items-center justify-between gap-4 ${
                  isActive
                    ? isDark
                      ? 'bg-[#203828] border-[#73aa84] shadow-sm'
                      : 'bg-[#e8f1e2] border-[#4a7855] shadow-sm'
                    : isDark
                      ? 'bg-[#141c18] border-[#34443a] hover:border-[#4e6557]'
                      : 'bg-white border-[#c5cec2] hover:border-[#8fa895]'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? isDark
                          ? 'bg-[#2e855c] text-white'
                          : 'bg-[#1f5c3f] text-white'
                        : isDark
                          ? 'bg-[#1b2620] text-[#a3b2aa] border border-[#34443a]'
                          : 'bg-[#f2f5ee] text-[#4a5752] border border-[#c5cec2]'
                    }`}
                  >
                    <IoPhonePortraitOutline className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(proj.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border-[1.5px] outline-none ${
                            isDark
                              ? 'bg-[#1b2620] border-[#73aa84] text-[#f3f6f4]'
                              : 'bg-white border-[#4a7855] text-[#14201d]'
                          }`}
                        />
                        <button
                          onClick={() => handleSaveRename(proj.id)}
                          className={`p-1 rounded-lg text-white text-xs ${
                            isDark ? 'bg-[#2e855c] hover:bg-[#38a16f]' : 'bg-[#1f5c3f] hover:bg-[#16452f]'
                          }`}
                        >
                          <IoCheckmark className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold truncate">{proj.name}</h3>
                        <button
                          onClick={() => handleStartRename(proj.id, proj.name)}
                          className={`p-1 rounded opacity-60 hover:opacity-100 transition-opacity ${
                            isDark ? 'hover:text-[#f3f6f4]' : 'hover:text-[#14201d]'
                          }`}
                          title="Rename Project"
                        >
                          <IoPencilOutline className="w-3.5 h-3.5" />
                        </button>
                        {isActive && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isDark
                                ? 'bg-[#2e855c]/25 text-[#73aa84] border border-[#73aa84]/40'
                                : 'bg-[#1f5c3f]/15 text-[#1f5c3f] border border-[#1f5c3f]/30'
                            }`}
                          >
                            Active
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-3 text-[11px] mt-1 ${
                        isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'
                      }`}
                    >
                      <span>{canvasCount} {canvasCount === 1 ? 'screenshot' : 'screenshots'}</span>
                      <span>•</span>
                      <span>Target: {targetSizeName}</span>
                      <span>•</span>
                      <span>Updated {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  {!isActive ? (
                    <button
                      onClick={() => {
                        switchProject(proj.id);
                        toast.success(`Switched to "${proj.name}"`);
                        onClose();
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border-[1.5px] transition-all shadow-sm ${
                        isDark
                          ? 'bg-[#1d2922] hover:bg-[#283a2f] border-[#44594c] hover:border-[#73aa84] text-[#f3f6f4]'
                          : 'bg-white hover:bg-[#e7efe3] border-[#b6c4b2] hover:border-[#4a7855] text-[#14201d]'
                      }`}
                    >
                      Open
                    </button>
                  ) : (
                    <span
                      className={`text-xs font-semibold mr-2 ${
                        isDark ? 'text-[#73aa84]' : 'text-[#1f5c3f]'
                      }`}
                    >
                      Opened
                    </span>
                  )}

                  <button
                    onClick={() => {
                      duplicateProject(proj.id);
                      toast.success(`Duplicated "${proj.name}"`);
                    }}
                    className={`p-2 rounded-xl border-[1.5px] transition-colors ${
                      isDark
                        ? 'border-[#44594c] hover:bg-[#283a2f] hover:border-[#73aa84] text-[#f3f6f4]'
                        : 'border-[#b6c4b2] hover:bg-[#e7efe3] hover:border-[#4a7855] text-[#14201d]'
                    }`}
                    title="Duplicate Project"
                  >
                    <IoCopyOutline className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      void exportProjectFile(proj.id)
                        .then(() => toast.success(`Exported "${proj.name}.json"`))
                        .catch((error) => toast.error(error.message || 'Project export failed.'));
                    }}
                    className={`p-2 rounded-xl border-[1.5px] transition-colors ${
                      isDark
                        ? 'border-[#44594c] hover:bg-[#283a2f] hover:border-[#73aa84] text-[#f3f6f4]'
                        : 'border-[#b6c4b2] hover:bg-[#e7efe3] hover:border-[#4a7855] text-[#14201d]'
                    }`}
                    title="Export Project (JSON)"
                  >
                    <IoDownloadOutline className="w-4 h-4" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${proj.name}"?`)) {
                          deleteProject(proj.id);
                          toast.success('Project deleted');
                        }
                      }}
                      className={`p-2 rounded-xl border-[1.5px] transition-colors ${
                        isDark
                          ? 'border-[#44594c] hover:bg-[#450a0a] hover:border-[#991b1b] text-[#f87171]'
                          : 'border-[#b6c4b2] hover:bg-[#fef2f2] hover:border-[#fca5a5] text-[#b91c1c]'
                      }`}
                      title="Delete Project"
                    >
                      <IoTrashOutline className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
