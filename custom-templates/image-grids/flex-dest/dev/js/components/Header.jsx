import React, { useCallback } from 'react';

export default function Header({ currentAsset, hasPrev, hasNext, projectId }) {
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
          onClick={hasNext ? handleGoNext : undefined}
        >
          keyboard_arrow_right
        </i>
      </div>
      <div className="keyboard-shortcuts">
        <span className="bold-text">Select Photo:</span>{' '}
        <span className="italic-text">Arrows</span> |{' '}
        <span className="bold-text">View Photo:</span>{' '}
        <span className="italic-text">Space</span> |{' '}
        <span className="bold-text">Close Photo:</span>{' '}
        <span className="italic-text">Esc</span> |{' '}
        <span className="bold-text">Set Quality:</span>{' '}
        <span className="italic-text">1-5</span> |{' '}
        <span className="bold-text">Submit:</span>{' '}
        <span className="italic-text">Enter</span> |{' '}
        <span className="bold-text">Skip:</span>{' '}
        <span className="italic-text">s</span>
      </div>
    </>
  );
}
