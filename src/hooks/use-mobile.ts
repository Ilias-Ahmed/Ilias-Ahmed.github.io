import { useEffect, useState } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: "portrait" | "landscape";
  screenSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      const userAgent = navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      const isMobileWidth = window.innerWidth < 768;

      setIsMobile(isMobileUA || isMobileWidth);
    };

    checkMobile();

    const debouncedResize = debounce(checkMobile, 100);
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return isMobile;
}

export function useDeviceDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    orientation: "landscape",
    screenSize: "lg",
  }));

  useEffect(() => {
    const updateDetection = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Device type detection
      const mobileRegex =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const tabletRegex = /iPad|Android(?=.*Tablet)|Tablet/i;

      const isMobileUA = mobileRegex.test(userAgent);
      const isTabletUA = tabletRegex.test(userAgent);
      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;

      const isMobile = isMobileUA || (!isTabletUA && isMobileWidth);
      const isTablet = isTabletUA || (!isMobileUA && isTabletWidth);
      const isDesktop = !isMobile && !isTablet;

      // Touch detection
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Orientation
      const orientation: "portrait" | "landscape" =
        height > width ? "portrait" : "landscape";

      // Screen size
      let screenSize: MobileDetection["screenSize"] = "lg";
      if (width < 480) screenSize = "xs";
      else if (width < 640) screenSize = "sm";
      else if (width < 768) screenSize = "md";
      else if (width < 1024) screenSize = "lg";
      else if (width < 1280) screenSize = "xl";
      else screenSize = "2xl";

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        orientation,
        screenSize,
      });
    };

    updateDetection();

    const debouncedUpdate = debounce(updateDetection, 100);
    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", debouncedUpdate);
    };
  }, []);

  return detection;
}

// Utility function for debouncing
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
