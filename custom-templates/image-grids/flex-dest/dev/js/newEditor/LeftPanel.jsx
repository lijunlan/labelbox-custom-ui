import React, { useState, useCallback } from 'react';

export default function LeftPanel({ assetData, photoEdits }) {
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

    const formattedData = formatEditDataForSubmission(
      photoEdits,
      assetData?.attribute,
      assetData?.qualityTier,
      assetData?.gridImages
    );

    Labelbox.setLabelForAsset(formattedData, 'ANY').then(() => {
      // setPhotoEdits([]);
      Labelbox.fetchNextAssetToLabel();
    });
  }, [photoEdits, assetData]);

  return (
    <form onSubmit={handleSubmit}>
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
      <label>
        <div className="label">Photo quality:</div>
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
          Skip
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
