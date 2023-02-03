export default function formatEditDataForSubmission(photoEdits, gridImages) {
  const formatted = photoEdits.map((edit) => {
    const { listingId, photoQualityTier } = edit;

    const data = {
      id_listing: listingId,
      photo_quality: photoQualityTier,
    };
    return data;
  });

  return JSON.stringify(formatted);
}
