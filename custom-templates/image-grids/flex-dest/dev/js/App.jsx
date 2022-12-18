import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import Content from './Content';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { get } from './utils';
import getEffectiveGridImages from './getEffectiveGridImages';
import convertLabelToPhotoEditFormat from './convertLabelToPhotoEditFormat';

const EMPTY_ARR = [];

/**
 * Input is a string containing an HTML document. Caption text can either be non-existent or span multiple lines
 *
 *   Example (\n replaced with actual newlines for readability):
 *     "<!DOCTYPE html>
 *     <html>
 *       <a href="https://www.airbnb.com/rooms/750469869902849247">Listing PDP</a>
 *       <br><a href="https://www.google.com/maps/search/?api=1&query=50.97%2C-3.58">Google Map</a>
 *       <br><br><br><br>1518815987
 *       <br><img src="https://a0.muscache.com/pictures/45639af2-64c0-43fc-a64f-83bbb71dccc4.jpg?im_w=480" style="width:450px;" loading="lazy" alt="Image failed to load.">
 *       <br>The Hoot has gorgeous lake views - guests can explore the grounds of the farm; sit by the lake, read a book, have a picnic or drink in the surroundings!
 *
 *       <br><br><br><br>1518815988
 *       <br><img src="https://a0.muscache.com/pictures/3d747c6d-4af6-46dc-9738-675ce8ae76d6.jpg?im_w=480" style="width:450px;" loading="lazy" alt="Image failed to load.">
 *       <br>Freshly painted bedroom - prefect for lie ins in this secluded location.
 *
 *     </html>"
 *
 *   Result:
 *     [
 *       {
 *         "photoId": "1518815987",
 *         "imageSrc": "https://a0.muscache.com/pictures/45639af2-64c0-43fc-a64f-83bbb71dccc4.jpg?im_w=480",
 *         "caption": "The Hoot has gorgeous lake views - guests can explore the grounds of the farm; sit by the lake, read a book, have a picnic or drink in the surroundings!"
 *       },
 *       {
 *         "photoId": "1518815988",
 *         "imageSrc": "https://a0.muscache.com/pictures/3d747c6d-4af6-46dc-9738-675ce8ae76d6.jpg?im_w=480",
 *         "caption": "Freshly painted bedroom - prefect for lie ins in this secluded location."
 *       },
 *     ]
 */
function parseHtmlInput(input) {
  // first, split the string by lines
  const htmlSplit = input.split('\n');
  return (
    htmlSplit
      // remove <br> tags
      .map((str) => str.replace(/<br>/g, ' '))

      // remove whitespace at the ends of the lines
      .map((str) => str.trim())

      // remove first two html tags and listing/map elements (first 4 elements and last element)
      .slice(4, htmlSplit.length - 1)

      // items are grouped in the array by empty strings, with a line each for the photo id and img tag,
      // and 0+ lines for the caption. here, actually turn the big array into an array of chunks accordingly.
      .reduce(
        (groups, item) => {
          if (item === '') {
            groups.push([]);
            return groups;
          }

          const currentGroup = groups[groups.length - 1];
          groups[groups.length - 1] = [...currentGroup, item];

          return groups;
        },
        [[]]
      )

      // remove any empty arrays (sometimes there are multiple, empty lines in a row)
      .filter((group) => group.length > 0)

      // finally, turn the array chunks into objects. while doing this, strip out the src url from the image tag
      // and join the caption strings together
      .map((group) => {
        const imgContainer = document.createElement('div');
        imgContainer.innerHTML = group[1];
        const img = imgContainer.querySelector('img');
        const src = img.src;
        return {
          photoId: group[0],
          imageSrc: src,
          caption: group.slice(2).join(' '),
        };
      })
  );
}

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();
  const [selectedListing, setSelectedListing] = useState();
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [newDefaultPhotoId, setNewDefaultPhotoId] = useState('');
  const assetNext = useRef();
  const assetPrev = useRef();

  // photoEdits data structure
  // [{
  //   defaultPhotoId: 345,
  //   photoQualityTier: 'High',
  // }]
  const [photoEdits, setPhotoEdits] = useState(EMPTY_ARR);

  const handleAssetChange = useCallback(
    (asset) => {
      if (asset) {
        // subscription to Labelbox makes increasing network calls as label history gets longer
        // to reduce jank from network calls, check the refs to ensure call is only made when relevant
        // data has changed
        if (
          currentAsset?.id !== asset.id &&
          currentAsset?.data !== asset.data &&
          (assetNext.current !== asset.next ||
            assetPrev.current !== asset.previous)
        ) {
          assetNext.current = asset.next;
          assetPrev.current = asset.previous;
          const assetDataStr = get(asset.metadata[0].metaValue);
          const parsedAssetData = parseHtmlInput(assetDataStr);

          setCurrentAsset(asset);
          setAssetData(parsedAssetData);
        }

        if (asset.label) {
          if (asset.label === 'Skip') return;
          let labels = [];
          try {
            labels = JSON.parse(asset.label);
          } catch (e) {
            console.error(e);
          }
          const formattedLabels = convertLabelToPhotoEditFormat(labels);

          // store labels in photoEdits mutable data structure
          setPhotoEdits(formattedLabels);
        }
      }
    },
    [currentAsset, setCurrentAsset, setAssetData]
  );

  const handleClickDefaultImage = useCallback(
    (imageIdx) => {
      setSelectedImageIdx(imageIdx);
      setSelectedListing(assetData.gridImages[imageIdx]);
      setNewDefaultPhotoId('');
    },
    [assetData, setSelectedImageIdx, setSelectedListing, setNewDefaultPhotoId]
  );

  useEffect(() => {
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  }, [handleAssetChange]);

  return (
    <>
      <div className="flex-column left-side-panel">
        {selectedListing ? (
          <LeftPanel
            assetData={assetData}
            newDefaultPhotoId={newDefaultPhotoId}
            photoEdits={photoEdits}
            selectedListing={selectedListing}
            setNewDefaultPhotoId={setNewDefaultPhotoId}
            setPhotoEdits={setPhotoEdits}
          />
        ) : null}
      </div>
      <div className="flex-grow flex-column">
        <Header
          currentAsset={currentAsset}
          hasNext={!!currentAsset?.next}
          hasPrev={!!currentAsset?.previous}
          projectId={projectId}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
        />
        <Content
          assetData={assetData}
          gridImages={effectiveGridImages}
          onClickImage={handleClickDefaultImage}
          photoEdits={photoEdits}
          selectedListing={selectedListing}
          selectedImageIdx={selectedImageIdx}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
          setPhotoEdits={setPhotoEdits}
        />
      </div>
      <RightPanel
        selectedListing={selectedListing}
        onClickImage={setNewDefaultPhotoId}
        newDefaultPhotoId={newDefaultPhotoId}
      />
    </>
  );
}
