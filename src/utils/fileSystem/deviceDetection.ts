
/**
 * Checks if the app is running on a mobile device
 * @returns boolean indicating if the app is running on mobile
 */
export const isMobileDevice = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia('(max-width: 767px)').matches
  );
};

/**
 * Checks if Capacitor is available in the current environment
 * @returns boolean indicating if Capacitor is available
 */
export const isCapacitorAvailable = (): boolean => {
  return 'Capacitor' in window;
};

/**
 * Checks if the app is running on a mobile device with Capacitor
 * @returns boolean indicating if it's a Capacitor-enabled mobile device
 */
export const isMobileWithCapacitor = (): boolean => {
  return isMobileDevice() && isCapacitorAvailable();
};
