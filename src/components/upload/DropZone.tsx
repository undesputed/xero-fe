"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  /** Short label shown in the drop zone hint, e.g. "CSV" or "PDF". Defaults to "CSV". */
  fileTypeLabel?: string;
}

export function DropZone({ onFile, accept = ".csv", fileTypeLabel = "CSV" }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className="cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-12 transition-colors"
      style={{
        borderColor: dragging ? "var(--sidebar-active)" : "var(--border)",
        background: dragging ? "#f0fdfa" : "var(--card-bg)",
      }}
    >
      <Upload
        size={32}
        style={{ color: dragging ? "var(--sidebar-active)" : "var(--text-muted)" }}
      />
      {fileName ? (
        <p className="text-sm font-medium" style={{ color: "var(--sidebar-active)" }}>
          {fileName}
        </p>
      ) : (
        <>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Drop your {fileTypeLabel} file here
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            or click to browse · {accept} only
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
