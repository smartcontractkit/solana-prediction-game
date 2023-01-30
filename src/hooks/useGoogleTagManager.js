import { useEffect } from "react";
import TagManager from "react-gtm-module";

const useGoogleTagManager = (trackingCode) => {
  useEffect(() => {
    if (trackingCode) {
      TagManager.initialize({ gtmId: trackingCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useGoogleTagManager;
