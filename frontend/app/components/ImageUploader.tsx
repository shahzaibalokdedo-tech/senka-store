"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://senkafashion.com/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  height?: number;
}

export default function ImageUploader({ value, onChange, label = "Product Image", height = 160 }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      } else {
        setError(data.detail || "Upload failed");
      }
    } catch {
      setError("Upload error — check your connection");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) uploadFile(file);
      else setError("Only image files are allowed");
    },
    [uploadFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontSize: "0.72rem", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !value && inputRef.current?.click()}
        style={{
          position: "relative",
          height: value ? `${height}px` : "120px",
          borderRadius: "var(--radius-sm)",
          border: dragging
            ? "2px dashed var(--gold-primary)"
            : value
            ? "1px solid rgba(226,192,116,0.3)"
            : "2px dashed rgba(226,192,116,0.3)",
          background: value
            ? `url(${value}) center/cover no-repeat`
            : dragging
            ? "rgba(226,192,116,0.06)"
            : "rgba(7,7,9,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: value ? "default" : "pointer",
          overflow: "hidden",
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        {/* Overlay when image is set */}
        {value && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(7,7,9,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: 0,
              transition: "opacity 0.2s",
            }}
            className="img-uploader-overlay"
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0")}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                padding: "8px 14px",
                background: "var(--gold-glow)",
                border: "1px solid var(--gold-primary)",
                borderRadius: "var(--radius-full)",
                color: "var(--gold-light)",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Upload size={13} /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              style={{
                padding: "8px 14px",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: "var(--radius-full)",
                color: "#ef4444",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <X size={13} /> Remove
            </button>
          </div>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <div style={{ textAlign: "center", pointerEvents: "none" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(226,192,116,0.1)", border: "1px solid var(--gold-line)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <ImageIcon size={20} color="var(--gold-primary)" />
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>Drop image here</span> or click to browse
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "4px" }}>JPG, PNG, WEBP · Max 8 MB</div>
          </div>
        )}

        {/* Uploading state */}
        {uploading && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "3px solid var(--gold-line)", borderTopColor: "var(--gold-primary)", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
            <div style={{ fontSize: "0.8rem", color: "var(--gold-primary)" }}>Uploading…</div>
          </div>
        )}

        {/* Success badge */}
        {success && !uploading && value && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", borderRadius: "var(--radius-full)", padding: "4px 10px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "#22c55e" }}>
            <CheckCircle size={12} /> Uploaded!
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            flex: 1,
            padding: "9px",
            background: "rgba(226,192,116,0.08)",
            border: "1px solid var(--gold-line)",
            borderRadius: "var(--radius-sm)",
            color: "var(--gold-light)",
            fontSize: "0.78rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
          }}
        >
          <Upload size={14} /> Upload from Device
        </button>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            padding: "9px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            cursor: "pointer",
          }}
          title="Paste URL instead"
        >
          URL
        </button>
      </div>

      {/* URL input */}
      {showUrlInput && (
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="Paste image URL (https://...)"
            style={{
              flex: 1,
              padding: "9px 12px",
              background: "rgba(7,7,9,0.8)",
              border: "1px solid var(--gold-line)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              fontSize: "0.82rem",
            }}
          />
          <button
            type="button"
            onClick={() => { onChange(urlDraft); setShowUrlInput(false); }}
            style={{
              padding: "9px 14px",
              background: "var(--gold-glow)",
              border: "1px solid var(--gold-primary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--gold-light)",
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            Use
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#ef4444", padding: "8px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-sm)" }}>
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
