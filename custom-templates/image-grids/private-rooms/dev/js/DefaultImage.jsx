import React from 'react';
import getResizedImageUrl from './getResizedImageUrl';

export default function DefaultImage({
  hasQualityTierChanged,
  imgObj,
  idx,
  isEdited,
  isSelected,
  onClickImage,
}) {
  const listingId = imgObj.listingId;
  const imageUrl = getResizedImageUrl(imgObj.photoLink);

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      id={`image-container-${listingId}`}
    >
      <img
        src={imageUrl}
        className={`default-image ${
          hasQualityTierChanged ? 'image-quality-changed' : ''
        } ${isEdited ? 'image-edited' : ''} ${
          isSelected ? 'image-selected' : ''
        }`}
      />
    </div>
  );
}
