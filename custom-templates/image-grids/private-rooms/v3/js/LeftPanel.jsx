import React, { useEffect, useState } from 'react';
import getUpdatedDefaultPhotoInfo from './getUpdatedDefaultPhotoInfo';

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

  const updatedDefaultPhotoInfo = getUpdatedDefaultPhotoInfo(
    photoEdits,
    selectedListing
  );
  const updatedDefaultPhotoId = updatedDefaultPhotoInfo?.defaultPhotoId;
  const updatedDefaultPhotoQualityTier =
    updatedDefaultPhotoInfo?.photoQualityTier;

  const [photoQualityTier, setPhotoQualityTier] = useState(
    updatedDefaultPhotoQualityTier || originalPhotoQualityTier
  );

  useEffect(() => {
    setPhotoQualityTier(
      updatedDefaultPhotoQualityTier || originalPhotoQualityTier
    );
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
    <form>
      <label>
        Photo id:
        <input
          type="text"
          name="photo-id"
          readOnly
          value={
            newDefaultPhotoId || updatedDefaultPhotoId || originalDefaultPhotoId
          }
        />
      </label>
      <div className="left-panel-ctas-wrapper">
        <button onClick={handleReset} className="cta clear-cta">
          Reset
        </button>
        <button onClick={handleRemove} className="cta remove-cta">
          Remove
        </button>
      </div>
    </form>
  );
}
