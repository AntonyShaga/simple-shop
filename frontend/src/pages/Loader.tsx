import { useEffect, useRef, useState } from 'react';

type Props = {
  active: boolean;
};

function Loader({ active }: Props) {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (active) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      setIsLoaderVisible(true);
      return;
    }

    hideTimerRef.current = window.setTimeout(() => {
      setIsLoaderVisible(false);
      hideTimerRef.current = null;
    }, 300);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [active]);

  return (
    <>
      <div className={`overlay ${isLoaderVisible ? 'visible' : ''}`}>
        <div className="overlay-loader">Loading…</div>
      </div>
    </>
  );
}

export default Loader;
