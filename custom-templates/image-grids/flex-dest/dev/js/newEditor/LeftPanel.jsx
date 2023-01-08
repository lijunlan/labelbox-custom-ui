import React, { useState, useCallback } from 'react';

export default function LeftPanel({ listingId, photoId }) {
  const [photoQualityTier, setPhotoQualityTier] = useState();

  const handlePhotoQualityChange = useCallback((e) => {
    setPhotoQualityTier(e.target.value);
  }, []);

  const handleSkip = useCallback(() => {
    // setSelectedImageIdx();
    // setPhotoEdits([]);
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
    // setSelectedImageIdx();

    const formattedData = {
      id_listing: listingId,
      photo_id: photoId,
      photo_quality: photoQualityTier,
    };

    Labelbox.setLabelForAsset(formattedData, 'ANY').then(() => {
      // setPhotoEdits([]);
      Labelbox.fetchNextAssetToLabel();
    });
  }, [listingId, photoId, photoQualityTier]);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Listing ID:
        <input type="text" name="listing-id" readOnly value={listingId} />
      </label>
      <label>
        Photo ID:
        <input type="text" name="photo-id" readOnly value={photoId} />
      </label>
      <label>
        <div className="label">Photo Quality:</div>
        <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
          <option value="Most Inspiring">Most Inspiring</option>
          <option value="High">High</option>
          <option value="Acceptable">Acceptable</option>
          <option value="Low Quality">Low Quality</option>
          <option value="Unacceptable">Unacceptable</option>
          <option value="Remove">Remove</option>
        </select>
      </label>
      <div className="left-panel-ctas-wrapper">
        <button onClick={handleSkip} className="cta skip-cta">
          Skip Listing
        </button>
        <input className="cta save-cta" type="submit" value="Submit" />
      </div>
      {/* <div className="cta-container">
        <a className="cta skip-cta" onClick={handleSkip}>
          Skip
        </a>
        <a className="cta submit-cta" onClick={handleSubmit}>
          Submit
        </a>
      </div> */}
    </form>
  );
}
