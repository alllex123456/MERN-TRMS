export const blobAnchor = (doc, blob) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = doc;
  document.body.appendChild(anchor);
  anchor.click();
  window.URL.revokeObjectURL(url);
};
