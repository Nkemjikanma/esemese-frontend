import { useMemo, useState } from "react";
import { ipfsURL } from "@/lib/utils";
import type { SyntheticEvent } from "react";

interface IPFSImageProps {
  cid: string;
  filename: string;
  src: string;
  alt?: string;
  className: string;
  sizes?: string;
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: () => void;
}
export const IPFSImage = ({
  cid,
  filename,
  src,
  sizes,
  alt,
  className,
  onError,
  onLoad,
}: IPFSImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasErrored) {
      setHasErrored(true);
      if (onError) onError(e);
    }
  };

  if (hasErrored) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-500">Image unavailable</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className={`${className} ${!loaded ? "opacity-0" : "opacity-100"}`}
      onLoad={handleLoad}
      onError={handleError}
      crossOrigin="anonymous"
    />
  );
};
