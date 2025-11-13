export const isIOSPWA = () => {
  if (typeof window === 'undefined') return false;
  return (window.navigator as any).standalone && /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      console.log('[MOBILE] Wake lock acquired');
      return wakeLock;
    } catch (err) {
      console.log('[MOBILE] Wake lock not supported');
    }
  }
  return null;
};

export const ensureHTTPS = () => {
  if (typeof window === 'undefined') return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

export const preventZoom = () => {
  if (typeof document === 'undefined') return;
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
};
