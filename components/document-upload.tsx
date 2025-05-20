typescriptreact
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploaderProps {
  onFileUpload: (file: File) => void;
  allowedFileTypes?: string[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileUpload,
  allowedFileTypes,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false);
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]); // Assuming single file upload for simplicity
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: allowedFileTypes ? allowedFileTypes.join(',') : undefined,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-md p-6 text-center cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        hover:border-gray-400 hover:bg-gray-100
      `}
    >
      <input {...getInputProps()} />
      {isDragging ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select a file</p>
      )}
      {allowedFileTypes && (
        <p className="text-sm text-gray-500 mt-2">
          Allowed file types: {allowedFileTypes.join(', ')}
        </p>
      )}
    </div>
  );
};

export default DocumentUploader;