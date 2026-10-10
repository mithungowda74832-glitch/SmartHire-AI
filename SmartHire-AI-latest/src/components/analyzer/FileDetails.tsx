import React from 'react';
import { FileText, Trash2, RefreshCw, Check } from 'lucide-react';
import { UploadedFileState } from '../../types/resume';
import { formatBytes } from '../../utils/formatters';

interface FileDetailsProps {
  fileState: UploadedFileState;
  onRemove: () => void;
  onReplace: () => void;
  disabled?: boolean;
}

export const FileDetails: React.FC<FileDetailsProps> = ({
  fileState,
  onRemove,
  onReplace,
  disabled = false,
}) => {
  const extension = fileState.name.split('.').pop()?.toUpperCase() || 'DOC';

  return (
    <div className="p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {fileState.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="tabular-nums">{formatBytes(fileState.size)}</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>{extension}</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Ready</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onReplace}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Replace selected document"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Replace</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Remove selected document"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};
