export default function formatEditDataForSubmission(photoEdits, gridImages) {
  const formatted = photoEdits.map((edit) => {
    const { listingId, defaultPhotoId, photoQualityTier } = edit;
    const listingInfo = gridImages.find(
      (listing) => listing.listingId === listingId
    );

    const data = {
      id_listing: listingId,
      photo_quality: photoQualityTier,
    };
    return data;
  });

  return JSON.stringify(formatted);
}
