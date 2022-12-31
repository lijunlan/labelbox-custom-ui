import React from 'react';
import { getResizedImageUrl } from '../utils';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
}) {
  const imageUrl = getResizedImageUrl(imgObj.imageSrc);

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      id={`image-container-${imgObj.photoId}`}
    >
      <img
        src={imageUrl}
        className={`default-image ${isSelected ? 'image-selected' : ''}`}
      />
      <p>{imgObj.caption}</p>
    </div>
  );
}
