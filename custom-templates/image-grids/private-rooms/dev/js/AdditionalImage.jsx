import React from 'react';
import getResizedImageUrl from './getResizedImageUrl';

export default function AdditionalImage({ isSelected, listingImage, onClick }) {
  const imageUrl = getResizedImageUrl(listingImage.photoLink);

  return (
    <div className="additional-image-wrapper">
      <div>Photo ID: {listingImage.photoId}</div>
      <button
        className={`additional-image ${isSelected ? 'image-selected' : ''}`}
        onClick={() => onClick(listingImage.photoId)}
      >
        <img src={imageUrl} width="100%" />
      </button>
    </div>
  );
}
