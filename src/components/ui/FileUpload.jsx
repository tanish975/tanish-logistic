'use client';
import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { toast } from 'sonner';

export const FileUpload = ({ id, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'File upload failed.');
      }
      toast.success('File uploaded successfully!');
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input id={id} type="file" accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp" onChange={handleFileChange} className="min-w-0" />
      <Button type="button" onClick={handleUpload} disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};