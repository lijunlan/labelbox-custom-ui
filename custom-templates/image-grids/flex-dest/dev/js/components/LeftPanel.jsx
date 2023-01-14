import React, { useState, useCallback, useEffect } from 'react';

export default function LeftPanel({
  listingId,
  photoId,
  labeledPhotoId,
  labeledPhotoQualityTier,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState('Most Inspiring');
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const handlePhotoQualityChange = useCallback(
    (e) => {
      setPhotoQualityTier(e.target.value);
    },
    [setPhotoQualityTier]
  );

  const handleSkip = (e) => {
    setIsSkipping(true);
    e.preventDefault();
    Labelbox.skip().then(() => {
      setPhotoQualityTier('Most Inspiring');
      e.target.blur();
      Labelbox.fetchNextAssetToLabel();
      setIsSkipping(false);
    });
  };

  const handleSubmit = (e) => {
    setIsSaving(true);
    e.preventDefault();
    const formattedData = {
      id_listing: listingId,
      photo_id: photoId,
      photo_quality: photoQualityTier,
    };

    Labelbox.setLabelForAsset(JSON.stringify(formattedData)).then(() => {
      setPhotoQualityTier('Most Inspiring');
      if (!labeledPhotoId) {
        Labelbox.fetchNextAssetToLabel();
      }
      setIsSaving(false);
    });
  };

  const handleKeyupEvent = (e) => {
    if (!isSaving && !isSkipping) {
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
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyupEvent);
    return () => document.removeEventListener('keyup', handleKeyupEvent);
  }, [listingId, photoId, photoQualityTier, handleKeyupEvent]);

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
        <button
          disabled={isSkipping}
          onClick={(e) => handleSkip(e)}
          className="cta skip-cta"
        >
          {isSkipping ? 'Skipping...' : 'Skip Listing'}
        </button>
        <button
          disabled={isSaving}
          className="cta save-cta"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          {isSaving ? 'Submitting...' : 'Submit'}
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
