import React, { useState, useEffect } from 'react';
import { ReactPhotoEditor } from 'react-photo-editor';

interface PhotoEditorProps {

    open: boolean;
    onClose: () => void;
    file: File | null;
    onSaveImage: (editedFile: File) => void;
}

const PhotoEditor : React.FC<PhotoEditorProps> = ({open, onClose, file, onSaveImage}) => {
  const [parentFile, setParentFile] = useState<File>();
  const [showModal, setShowModal] = useState(false);
  const [editedFile, setEditedFile] = useState<File | null>(null);

  // Show modal if file is selected
  const showModalHandler = () => {
    if (file) {
      setShowModal(open);
      setParentFile(file);

    }
  };

  useEffect(() => {
    showModalHandler();
  }, [open])


 
  const handleSaveImage = (editedFile : File) => {
    onSaveImage(editedFile);
  };


  return (
    <>
     

      <ReactPhotoEditor

        open={showModal}
        onClose={onClose}
        file={parentFile}
        onSaveImage={handleSaveImage}
      />
    </>
  );
}

export default PhotoEditor;