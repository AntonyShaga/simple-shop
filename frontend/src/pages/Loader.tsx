import { useEffect, useRef, useState } from 'react';

type Props = {
  isFetching: boolean;
};

function Loader({ isFetching }: Props) {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isFetching) {
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
  }, [isFetching]);

  return (
    <>
      <div className={`overlay ${isLoaderVisible ? 'visible' : ''}`}>
        <div className="overlay-loader">Loading…</div>
      </div>
    </>
  );
}

export default Loader;
