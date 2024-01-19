import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WindowContext = createContext({
  clientHeight: document.documentElement.clientHeight,
  clientWidth: document.documentElement.clientWidth,
  isFullscreen: Boolean(document.fullscreenElement),
});

function WindowContextProvider({ children }) {
  const getVh = useCallback(() => {
    return document.documentElement.clientHeight || 0;
  }, []);
  const getVw = useCallback(() => {
    return document.documentElement.clientWidth || 0;
  }, []);

  const [clientHeight, setVh] = useState(getVh());
  const [clientWidth, setVw] = useState(getVw());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setVh(getVh());
      setVw(getVw());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getVh, getVw]);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <WindowContext.Provider value={{ clientHeight, clientWidth, isFullscreen }}>
      {children}
    </WindowContext.Provider>
  );
}

function useWindowContext() {
  const context = useContext(WindowContext);

  // console.log(clientHeight, clientWidth);
  return context;
}

export { WindowContextProvider, useWindowContext };
