import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 64 }) => {
  return (
    <div
      className="rounded-full overflow-hidden border border-gray-300"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
          <span className="text-sm">No Image</span>
        </div>
      )}
    </div>
  );
};
