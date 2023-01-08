import React, { useState, useCallback } from 'react';

export default function LeftPanel({
  listingId,
  photoId,
  labeledPhotoId,
  labeledPhotoQualityTier,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState();

  const handlePhotoQualityChange = useCallback((e) => {
    setPhotoQualityTier(e.target.value);
  }, []);

  const handleSkip = useCallback(() => {
    Labelbox.skip().then(() => {
      setPhotoQualityTier('Most Inspiring');
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const formattedData = {
      id_listing: listingId,
      photo_id: photoId,
      photo_quality: photoQualityTier,
    };

    Labelbox.setLabelForAsset(JSON.stringify(formattedData), 'ANY').then(() => {
      setPhotoQualityTier('Most Inspiring');
      Labelbox.fetchNextAssetToLabel();
    });
  }, [listingId, photoId, photoQualityTier]);

  document.addEventListener('keydown', (e) => {
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
        handleSkip();
        break;

      case 'enter':
        e.preventDefault();
        handleSubmit();
        break;

      default:
        return;
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Listing ID:
        <input type="text" name="listing-id" readOnly value={listingId} />
      </label>
      <label>
        Photo ID:
        <input
          type="text"
          name="photo-id"
          readOnly
          value={labeledPhotoId ? labeledPhotoId : photoId}
        />
      </label>
      <label>
        <div className="label">Photo Quality:</div>
        {!labeledPhotoQualityTier && (
          <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
            <option value="Most Inspiring">Most Inspiring</option>
            <option value="High">High</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Low Quality">Low Quality</option>
            <option value="Unacceptable">Unacceptable</option>
          </select>
        )}
        {labeledPhotoQualityTier && (
          <input type="text" readOnly value={labeledPhotoQualityTier} />
        )}
      </label>
      {!labeledPhotoQualityTier && (
        <div className="left-panel-ctas-wrapper">
          <button onClick={handleSkip} className="cta skip-cta">
            Skip Listing
          </button>
          <input className="cta save-cta" type="submit" value="Submit" />
        </div>
      )}
    </form>
  );
}
