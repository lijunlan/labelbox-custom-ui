import React, { useState, useCallback, useEffect } from 'react';

export default function LeftPanel({
  listingId,
  photoId,
  labeledPhotoId,
  labeledPhotoQualityTier,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState('Most Inspiring');

  const handlePhotoQualityChange = useCallback(
    (e) => {
      setPhotoQualityTier(e.target.value);
    },
    [setPhotoQualityTier]
  );

  const handleSkip = useCallback(
    (e) => {
      e.preventDefault();
      Labelbox.skip().then(() => {
        setPhotoQualityTier('Most Inspiring');
        Labelbox.fetchNextAssetToLabel();
      });
    },
    [setPhotoQualityTier]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const formattedData = {
        id_listing: listingId,
        photo_id: photoId,
        photo_quality: photoQualityTier,
      };

      Labelbox.setLabelForAsset(JSON.stringify(formattedData)).then(() => {
        setPhotoQualityTier('Most Inspiring');
        Labelbox.fetchNextAssetToLabel();
      });
    },
    [listingId, photoId, photoQualityTier, setPhotoQualityTier]
  );

  const handleKeydownEvent = useCallback(
    (e) => {
      switch (e.key.toLowerCase()) {
        case '1':
          e.preventDefault();
          setPhotoQualityTier('Most Inspiring');
          break;

        case '2':
          e.preventDefault();
          setPhotoQualityTier('High');
          break;

        case '3':
          e.preventDefault();
          setPhotoQualityTier('Acceptable');
          break;

        case '4':
          e.preventDefault();
          setPhotoQualityTier('Low Quality');
          break;

        case '5':
          e.preventDefault();
          setPhotoQualityTier('Unacceptable');
          break;

        case 's':
          e.preventDefault();
          handleSkip(e);
          break;

        case 'enter':
          e.preventDefault();
          handleSubmit(e);
          break;

        default:
          return;
      }
    },
    [handleSkip, handleSubmit, setPhotoQualityTier]
  );

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKeydownEvent(e));
  }, []);

  return (
    <form>
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
        </select>
      </label>
      <div className="left-panel-ctas-wrapper">
        <button onClick={(e) => handleSkip(e)} className="cta skip-cta">
          Skip Listing
        </button>
        <button
          className="cta save-cta"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </div>
      {labeledPhotoId && (
        <div className="existing-label-container">
          <span>Labeled Photo ID: {labeledPhotoId}</span>
          <span>Labeled Photo Quality: {labeledPhotoQualityTier}</span>
        </div>
      )}
    </form>
  );
}
