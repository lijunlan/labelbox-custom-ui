import React from 'react';
import { getResizedImageUrl } from '../utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
      <LazyLoadImage
        src={imageUrl}
        className={`default-image ${isSelected ? 'image-selected' : ''}`}
        effect="blur"
      />
      <span>{imgObj.caption}</span>
    </div>
  );
}
