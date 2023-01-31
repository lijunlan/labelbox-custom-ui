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
  const originalPhotoQualityTier = assetData.qualityTier;
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

  function foo() {
    setPhotoQualityTier('Remove');
  }

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function clearUnsavedChanges() {
    setNewDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleResetChanges() {
    clearUnsavedChanges();

    // delete saved change entry from photoEdits
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      if (prevChangeIndex !== -1) {
        return [
          ...prevEdits.slice(0, prevChangeIndex),
          ...prevEdits.slice(prevChangeIndex + 1),
        ];
      } else {
        return prevEdits;
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // change photo quality tier
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      if (prevChangeIndex !== -1) {
        return [
          ...prevEdits.slice(0, prevChangeIndex),
          Object.assign({}, prevEdits[prevChangeIndex], {
            photoQualityTier,
          }),
          ...prevEdits.slice(prevChangeIndex + 1),
        ];
      } else {
        return [
          ...prevEdits,
          {
            listingId: selectedListing.listingId,
            defaultPhotoId:
              originalDefaultPhotoId ||
              updatedDefaultPhotoId ||
              originalDefaultPhotoId,
            photoQualityTier,
          },
        ];
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="left-panel-ctas-wrapper">
        <button onClick={handleResetChanges} className="cta clear-cta">
          Reset
        </button>
        <input className="cta save-cta" type="submit" value="Remove" />
      </div>
    </form>
  );
}
