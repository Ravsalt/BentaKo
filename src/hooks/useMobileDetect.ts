import { useState, useEffect } from 'react';

interface MobileDetect {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
}

export const useMobileDetect = (): MobileDetect => {
  const [deviceInfo, setDeviceInfo] = useState<MobileDetect>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check for mobile devices
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const isMobile = mobileRegex.test(userAgent);
      
      // Check for tablets
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
      const isTablet = tabletRegex.test(userAgent);
      
      // Check screen size as additional criteria
      const screenWidth = window.innerWidth;
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      
      setDeviceInfo({
        isMobile: isMobile || (isMobileScreen && !isTablet),
        isTablet: isTablet || isTabletScreen,
        isDesktop: !isMobile && !isTablet && screenWidth >= 1024,
        isTouchDevice,
      });
    };

    checkDevice();
    
    // Re-check on window resize
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return deviceInfo;
};
