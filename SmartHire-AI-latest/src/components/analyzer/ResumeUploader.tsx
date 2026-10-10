import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { validateResumeFile, ALLOWED_EXTENSIONS } from '../../utils/fileValidation';
import { UploadedFileState } from '../../types/resume';
import { FileDetails } from './FileDetails';

interface ResumeUploaderProps {
  uploadedFile: UploadedFileState | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  uploadedFile,
  onFileSelect,
  onFileRemove,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      processFile(selected);
    }
    // reset input so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file format or size.');
      return;
    }
    onFileSelect(file);
  };

  const triggerBrowse = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <span>Resume Document</span>
          <span className="text-blue-600 dark:text-blue-400 font-normal text-xs">* Required</span>
        </label>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          PDF, DOCX, or TXT up to 10 MB
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload resume document"
      />

      {uploadedFile ? (
        <FileDetails
          fileState={uploadedFile}
          onRemove={onFileRemove}
          onReplace={triggerBrowse}
          disabled={disabled}
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="Click or drag and drop a resume document here"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerBrowse();
            }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-600 ${
            isDragOver
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
              : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100/40 dark:hover:bg-neutral-900/60'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-105">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                <span className="text-blue-600 dark:text-blue-400 hover:underline">
                  Click to select document
                </span>{' '}
                or drag and drop here
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Supports PDF, Microsoft Word (.docx), and plain text (.txt)
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
