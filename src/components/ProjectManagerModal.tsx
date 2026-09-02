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
    importProjectFile,
    globalSettings,
  } = useEditorStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

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

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = importProjectFile(text);
      if (success) {
        toast.success('Project imported successfully!');
      } else {
        toast.error('Invalid project file format.');
      }
    } catch {
      toast.error('Failed to read project file.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'}`}>
              <IoFolderOpenOutline className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Projects & Drafts</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Switch between app showcases, export backups, or import project files.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".launchshot,.json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-50 hover:bg-zinc-100 border-gray-300 text-zinc-700'
              }`}
            >
              <IoCloudUploadOutline className="w-4 h-4" />
              Import File
            </button>

            <button
              onClick={() => setShowCreateInput(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <IoAddCircleOutline className="w-4 h-4" />
              New Project
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
              }`}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Create Input */}
        {showCreateInput && (
          <div className={`px-6 py-4 border-b flex items-center gap-3 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
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
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <button
              onClick={handleCreateNew}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateInput(false)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
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
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isActive
                    ? isDark
                      ? 'bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-blue-50/70 border-blue-300 shadow-sm'
                    : isDark
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-gray-100 text-gray-500'
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
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border outline-none ${
                            isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={() => handleSaveRename(proj.id)}
                          className="p-1 rounded-lg bg-blue-600 text-white text-xs"
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
                            isDark ? 'hover:text-zinc-200' : 'hover:text-gray-900'
                          }`}
                          title="Rename Project"
                        >
                          <IoPencilOutline className="w-3.5 h-3.5" />
                        </button>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Active
                          </span>
                        )}
                      </div>
                    )}

                    <div className={`flex items-center gap-3 text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
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
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isDark
                          ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                          : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Open
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-blue-500 mr-2">Opened</span>
                  )}

                  <button
                    onClick={() => {
                      duplicateProject(proj.id);
                      toast.success(`Duplicated "${proj.name}"`);
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                    }`}
                    title="Duplicate Project"
                  >
                    <IoCopyOutline className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      exportProjectFile(proj.id);
                      toast.success(`Exported "${proj.name}.launchshot"`);
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                    }`}
                    title="Export Project (.launchshot file)"
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
                      className={`p-2 rounded-xl border transition-colors ${
                        isDark
                          ? 'border-zinc-800 hover:bg-red-950/40 text-red-400'
                          : 'border-gray-200 hover:bg-red-50 text-red-600'
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
