import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileCheck, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useBookStore } from '../../store/bookStore';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setUploadModalOpen } = useUIStore();
  const { uploadNewBook } = useBookStore();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.name.toLowerCase().endsWith('.pdf')) {
        setFile(selected);
        if (!title) {
          setTitle(selected.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
        }
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (author) formData.append('author', author);

    try {
      await uploadNewBook(formData);
      setIsUploading(false);
      setFile(null);
      setTitle('');
      setAuthor('');
      setUploadModalOpen(false);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload PDF book. Ensure backend is running.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#241f1b] border border-[#e6d7c3]/20 rounded-2xl p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setUploadModalOpen(false)}
          className="absolute top-6 right-6 text-[#8e7f6e] hover:text-[#f5efe6] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-serifDisplay text-3xl text-[#f5efe6] mb-1">
          Add PDF to Collection
        </h3>
        <p className="text-xs font-mono uppercase tracking-wider text-[#8e7f6e] mb-6">
          Upload any PDF to bind into a 3D cloth hardcover
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragOver
                ? 'border-gold bg-gold/5'
                : file
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-[#e6d7c3]/20 hover:border-gold/50 bg-black/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center text-center">
                <FileCheck size={36} className="text-green-400 mb-2" />
                <span className="text-sm font-medium text-[#f5efe6]">{file.name}</span>
                <span className="text-xs text-[#8e7f6e] mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB &middot; Ready to bind
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <UploadCloud size={36} className="text-[#8e7f6e] group-hover:text-gold mb-2" />
                <span className="text-sm font-medium text-[#f5efe6]">
                  Drop your PDF here or click to browse
                </span>
                <span className="text-xs text-[#8e7f6e] mt-1">
                  Supports .pdf files up to 100MB
                </span>
              </div>
            )}
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8e7f6e]">
              Book Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Atomic Habits"
              className="bg-black/30 border border-[#e6d7c3]/15 rounded-lg px-4 py-2.5 text-sm text-[#f5efe6] placeholder-[#8e7f6e] focus:outline-none focus:border-gold"
            />
          </div>

          {/* Author input */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8e7f6e]">
              Author Name (Optional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. James Clear"
              className="bg-black/30 border border-[#e6d7c3]/15 rounded-lg px-4 py-2.5 text-sm text-[#f5efe6] placeholder-[#8e7f6e] focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={!file || isUploading}
            className="mt-2 w-full bg-[#d4af37] hover:bg-[#e5c26b] disabled:opacity-50 text-[#100f0d] font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-sans tracking-wide transition-all shadow-lg"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing &amp; Binding PDF...</span>
              </>
            ) : (
              <span>Add Book to 3D Shelf</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
