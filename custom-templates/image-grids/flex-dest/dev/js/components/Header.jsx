import React, { useCallback } from 'react';

export default function Header({
  currentAsset,
  hasPrev,
  hasNext,
  projectId,
  hasLabel,
}) {
  const handleGoHome = useCallback(() => {
    window.location.href = 'https://app.labelbox.com/projects/' + projectId;
  }, [projectId]);

  const handleGoBack = useCallback(() => {
    if (hasPrev) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  }, [currentAsset]);

  const handleGoNext = useCallback(() => {
    if (hasNext) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    } else if (!hasNext && hasLabel) {
      Labelbox.fetchNextAssetToLabel();
    }
  }, [currentAsset]);

  return (
    <>
      <div className="header-container">
        <i className="material-icons home-icon" onClick={handleGoHome}>
          home
        </i>
        <i
          className={`material-icons back-icon ${
            hasPrev ? 'button-default' : ''
          }`}
          onClick={handleGoBack}
        >
          keyboard_arrow_left
        </i>
        <div className="header-title" id="externalid">
          Label this asset
        </div>
        <i
          className={`material-icons next-icon ${
            hasNext ? 'button-default' : ''
          }`}
          onClick={hasNext || (!hasNext && hasLabel) ? handleGoNext : undefined}
        >
          keyboard_arrow_right
        </i>
      </div>
      <div className="keyboard-shortcuts">
        <span className="bold-text">Select Photo:</span> Arrows |{' '}
        <span className="bold-text">View Photo:</span> Space |{' '}
        <span className="bold-text">Close Photo:</span> Esc |{' '}
        <span className="bold-text">Set Quality:</span> 1-5 |{' '}
        <span className="bold-text">Submit:</span> Enter |{' '}
        <span className="bold-text">Skip:</span> s
      </div>
    </>
  );
}
