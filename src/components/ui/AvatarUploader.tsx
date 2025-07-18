'use client';

import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { Button } from './button';
import { Input } from './input';
import { toast } from 'react-toastify';

export const AvatarUploader = ({ onUploaded }: { onUploaded?: (url: string) => void }) => {
  const [user] = useAuthState(auth);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);

    try {
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(avatarRef);
      
      await updateProfile(user, {
        photoURL: downloadURL,
      });
      onUploaded?.(downloadURL);
      toast.success('Avatar updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
          <img
            src={preview || user?.photoURL || '/avatar-placeholder.png'}
            alt="Avatar Preview"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleUpload} disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Save Avatar'}
      </Button>
    </div>
  );
};
