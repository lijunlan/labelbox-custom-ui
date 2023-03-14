export default function getResizedImageUrl(photoLink) {
  return photoLink?.includes('?') ? `${photoLink}` : `${photoLink}?im_w=480`;
}
