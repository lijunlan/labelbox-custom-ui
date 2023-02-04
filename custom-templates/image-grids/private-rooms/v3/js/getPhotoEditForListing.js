export default function getPhotoEditForListing(photoEdits, listing) {
  return photoEdits.find((edit) => edit.listingId === listing.listingId);
}
