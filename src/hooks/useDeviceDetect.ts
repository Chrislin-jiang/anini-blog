import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
}

export function useDeviceDetect(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isMobile: false,
    isTouchDevice: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = isTouchDevice && window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setDevice({ isMobile, isTouchDevice, prefersReducedMotion });
  }, []);

  return device;
}
