export default function formatEditDataForSubmission(photoEdits, gridImages) {
  // Create a dict from removal photoEdits
  var removeDict = {};
  photoEdits
    .filter((edit) => {
      return edit.photoQualityTier === 'Remove';
    })
    .forEach((edit) => {
      const { listingId, photoQualityTier } = edit;
      removeDict[listingId] = photoQualityTier;
    });

  const formattedData = gridImages.map((img) => {
    const listingId = img.listingId;
    const elem = {
      id_listing: listingId,
      photo_quality: removeDict[listingId] || 'Accept',
    };
    return elem;
  });

  return JSON.stringify(formattedData);
}
