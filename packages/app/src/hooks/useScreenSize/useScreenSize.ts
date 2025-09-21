import { useWindowDimensions } from "react-native";

interface UseScreenSizeReturn {
  isDesktop: boolean;
}

const DESKTOP_BREAKPOINT = 768;

export const useScreenSize = (): UseScreenSizeReturn => {
  const { width } = useWindowDimensions();

  return {
    isDesktop: width >= DESKTOP_BREAKPOINT,
  };
};
