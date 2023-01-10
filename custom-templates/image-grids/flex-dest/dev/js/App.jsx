import React, { useState, useEffect, useCallback, useRef } from 'react';
import { get, parseHtmlInput } from './utils';
import ImageGrid from './newEditor/ImageGrid';
import LeftPanel from './newEditor/LeftPanel';
import Header from './newEditor/Header';

const EMPTY_ARR = [];

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [listingId, setListingId] = useState();
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [selectedPhotoId, setSelectedPhotoId] = useState();
  const [labeledPhotoId, setLabeledPhotoId] = useState();
  const [labeledPhotoQualityTier, setLabeledPhotoQualityTier] = useState();
  const assetNext = useRef();
  const assetPrev = useRef();

  const resetState = () => {
    setLabeledPhotoId();
    setLabeledPhotoQualityTier();
  };

  useEffect(() => {
    document.querySelector('.content').scrollTo(0, 0);
  }, [assetData]);

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
          resetState();

          assetNext.current = asset.next;
          assetPrev.current = asset.previous;
          const assetDataStr = get(asset.metadata[0].metaValue);
          const parsedAssetData = parseHtmlInput(assetDataStr);

          // Full match will be first element, listing ID will be second
          setListingId(
            assetDataStr.match(
              /href="https:\/\/www.airbnb.com\/rooms\/(.*?)"/
            )[1]
          );

          // default to first image
          setSelectedImageIdx(0);
          setSelectedPhotoId(parsedAssetData[0].photoId);

          setCurrentAsset(asset);
          setAssetData(parsedAssetData);

          if (asset.label) {
            if (asset.label === 'Skip') {
              setLabeledPhotoId('Skipped');
              setLabeledPhotoQualityTier('Skipped');
              setSelectedImageIdx(undefined);
              return;
            }
            let label = {};
            try {
              label = JSON.parse(asset.label);
            } catch (e) {
              console.error(e);
            }

            setLabeledPhotoId(label.photo_id);
            setLabeledPhotoQualityTier(label.photo_quality);
            setSelectedImageIdx(
              parsedAssetData.findIndex(
                (image) => label.photo_id === image.photoId
              )
            );
          }
        }
      }
    },
    [currentAsset]
  );

  const handleClickImage = useCallback(
    (imageIdx) => {
      setSelectedImageIdx(imageIdx);
      setSelectedPhotoId(assetData[imageIdx].photoId);
    },
    [assetData, setSelectedImageIdx, setSelectedPhotoId]
  );

  useEffect(() => {
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  }, [handleAssetChange]);

  return (
    <>
      <div className="flex-column left-side-panel">
        {
          <LeftPanel
            listingId={listingId}
            photoId={selectedPhotoId}
            labeledPhotoId={labeledPhotoId}
            labeledPhotoQualityTier={labeledPhotoQualityTier}
          />
        }
      </div>
      <div className="flex-grow flex-column">
        <Header
          currentAsset={currentAsset}
          hasNext={!!currentAsset?.next}
          hasPrev={!!currentAsset?.previous}
          projectId={projectId}
        />
        <div className="content">
          <ImageGrid
            images={assetData}
            onClickImage={labeledPhotoQualityTier ? () => {} : handleClickImage}
            selectedImageIdx={selectedImageIdx}
          />
        </div>
      </div>
    </>
  );
}
