'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const LoadingBar = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    let showTimeout: NodeJS.Timeout;

    const startLoading = () => {
      clearTimeout(hideTimeout);
      showTimeout = setTimeout(() => {
        setLoading(true);
        setShow(true);
      }, 0); // Delay before showing the loading bar
    };

    const completeLoading = () => {
      clearTimeout(showTimeout);
      setLoading(false);
      hideTimeout = setTimeout(() => setShow(false), 200); // Delay before hiding the loading bar
    };

    // Start loading when pathname changes
    startLoading();

    // Simulate the end of loading after 2 seconds
    const completeLoadingTimeout = setTimeout(completeLoading, 1500); // Adjust this time to simulate loading duration

    // Cleanup timeouts if the component unmounts
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(completeLoadingTimeout);
    };
  }, [pathname]);

  return (
    show && (
      <div className="fixed left-0 top-0 w-full h-2 z-50">
        <div
          className={`h-full w-full transition-all duration-500 ${
            loading ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
        ></div>
      </div>
    )
  );
};

export default LoadingBar;