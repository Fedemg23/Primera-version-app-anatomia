
export const preloadImages = (urls: string[]): Promise<void[]> => {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      // Resolve even on error to not block the app forever
      img.onerror = () => {
        console.warn(`Failed to preload image, but continuing: ${url}`);
        resolve();
      };
    });
  });
  return Promise.all(promises);
};
