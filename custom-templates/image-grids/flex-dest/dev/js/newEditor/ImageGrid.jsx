import React from 'react';
import DefaultImage from './DefaultImage';

export default function ImageGrid({ images, onClickImage, selectedImageIdx }) {
  return (
    <div className="photo-grid">
      {images.map((imgObj, idx) => {
        return (
          <DefaultImage
            imgObj={imgObj}
            idx={idx}
            isSelected={selectedImageIdx === idx}
            key={imgObj.photoId}
            onClickImage={(photoIdx) => onClickImage(photoIdx)}
          />
        );
      })}
    </div>
  );
}
