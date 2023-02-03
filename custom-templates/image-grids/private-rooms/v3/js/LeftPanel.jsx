import React, { useEffect, useState } from 'react';
import getPhotoEditForListing from './getPhotoEditForListing';

export default function LeftPanel({
  assetData,
  newDefaultPhotoId,
  photoEdits,
  selectedListing,
  setNewDefaultPhotoId,
  setPhotoEdits,
}) {
  const originalPhotoQualityTier = 'Accept';
  const originalDefaultPhotoId = selectedListing.photoId;

  const specificPhotoEdit = getPhotoEditForListing(photoEdits, selectedListing);
  const updatedDefaultPhotoId = specificPhotoEdit?.defaultPhotoId;
  const specificPhotoQualityTier = specificPhotoEdit?.photoQualityTier;

  const [photoQualityTier, setPhotoQualityTier] = useState(
    specificPhotoQualityTier || originalPhotoQualityTier
  );

  useEffect(() => {
    setPhotoQualityTier(specificPhotoQualityTier || originalPhotoQualityTier);
  }, [selectedListing]);

  function clearUnsavedChanges() {
    setNewDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleReset() {
    clearUnsavedChanges();

    // delete saved change entry from photoEdits
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      // Selected has not been removed, so do nothing to prevEdits
      if (prevChangeIndex === -1) {
        return prevEdits;
      }

      // Selected listing has been removed before, so remove it from prevEdits
      return [
        ...prevEdits.slice(0, prevChangeIndex),
        ...prevEdits.slice(prevChangeIndex + 1),
      ];
    });
  }

  function handleRemove() {
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      // Selected listing has not been removed before, so append it to prevEdits
      if (prevChangeIndex === -1) {
        return [
          ...prevEdits,
          {
            listingId: selectedListing.listingId,
            defaultPhotoId: originalDefaultPhotoId || updatedDefaultPhotoId,
            photoQualityTier: 'Remove',
          },
        ];
      }

      // Selected listing has already been removed, so do nothing
      return prevEdits;
    });
  }

  return (
    <div className="left-panel-ctas-wrapper">
      <button onClick={handleReset} className="cta clear-cta">
        Reset
      </button>
      <button onClick={handleRemove} className="cta remove-cta">
        Remove
      </button>
    </div>
  );
}
