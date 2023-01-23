import React, { useEffect, useState } from 'react';
import DefaultImage from './DefaultImage';
import { Lightbox } from 'react-modal-image';

function getElement(id) {
  const el = document.getElementById(id);
  const rect = el.getBoundingClientRect();
  const x = rect.left + window.scrollX;
  const y = rect.top + window.scrollY;
  const top = rect.top;
  const bottom = rect.bottom;
  return { el, x, y, top, bottom };
}

export default function ImageGrid({ images, onClickImage, selectedImageIdx }) {
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  const handleKeydownEvent = (e) => {
    if (images.length === 0) {
      return;
    }
    const key = e.key.toLowerCase();
    const currentId = `image-container-${images[selectedImageIdx].photoId}`;
    if (key === 'arrowright') {
      e.preventDefault();

      const { el, y: currentY } = getElement(currentId);

      // at the last item in the grid/list
      if (!el.nextSibling) {
        return;
      }

      // if the next item is in the next row and off screen, scroll to it
      const { y: nextSiblingY, bottom } = getElement(el.nextSibling.id);
      if (currentY < nextSiblingY && bottom > window.innerHeight) {
        el.nextSibling.scrollIntoView();
      }

      onClickImage(selectedImageIdx + 1);
    } else if (key === 'arrowleft') {
      e.preventDefault();
      const { el, y: currentY } = getElement(currentId);

      // at the first item in the grid/list
      if (!el.previousSibling) {
        return;
      }

      // if the prev item is in the prev row and off screen, scroll to it
      const { y: prevSiblingY, top } = getElement(el.previousSibling.id);
      if (currentY > prevSiblingY && top < 0) {
        el.previousSibling.scrollIntoView();
      }

      onClickImage(selectedImageIdx - 1);
    } else if (key === 'arrowup') {
      e.preventDefault();
      const { x: currentX, y: currentY } = getElement(currentId);

      // loop backwards until we find the first item above in the same column
      for (let i = selectedImageIdx - 1; i >= 0; i--) {
        const {
          el,
          x: prevX,
          y: prevY,
          top,
        } = getElement(`image-container-${images[i].photoId}`);

        if (currentX === prevX && currentY > prevY) {
          onClickImage(i);
          if (top < 0) {
            el.scrollIntoView();
          }
          break;
        }
      }
    } else if (key === 'arrowdown') {
      e.preventDefault();
      const { x: currentX, y: currentY } = getElement(currentId);

      // loop forward until we find the first item below in the same column
      for (let i = selectedImageIdx + 1; i < images.length; i++) {
        const {
          el,
          x: nextX,
          y: nextY,
          bottom,
        } = getElement(`image-container-${images[i].photoId}`);

        if (currentX === nextX && currentY < nextY) {
          onClickImage(i);
          if (bottom > window.innerHeight) {
            el.scrollIntoView();
          }
          break;
        }
      }
    } else if (key === ' ') {
      setIsPhotoViewerOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydownEvent);
    return () => document.removeEventListener('keydown', handleKeydownEvent);
  }, [images, selectedImageIdx, handleKeydownEvent]);

  const closePhotoViewer = () => {
    setIsPhotoViewerOpen(false);
  };

  return (
    <>
      <div className="photo-grid">
        {images.map((imgObj, idx) => {
          return (
            <DefaultImage
              imgObj={imgObj}
              idx={idx}
              isSelected={selectedImageIdx === idx}
              key={imgObj.photoId}
              onClickImage={(photoIdx) => onClickImage(photoIdx)}
            />
          );
        })}
      </div>
      {isPhotoViewerOpen && (
        <Lightbox
          large={images[selectedImageIdx].imageSrc}
          onClose={closePhotoViewer}
        />
      )}
    </>
  );
}
