import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "car-images";

function extractPath(url: string): string | null {
  if (!url) return null;
  // Match both /object/public/car-images/... and /object/sign/car-images/...
  const m = url.match(/\/car-images\/([^?]+)/);
  if (m) return decodeURIComponent(m[1]);
  // Already a bare path
  if (!url.startsWith("http")) return url;
  return null;
}

const cache = new Map<string, string>();

export function StorageImage({ src, alt, className }: { src?: string | null; alt?: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(() => (src && cache.get(src)) || null);

  useEffect(() => {
    if (!src) { setUrl(null); return; }
    const cached = cache.get(src);
    if (cached) { setUrl(cached); return; }
    const path = extractPath(src);
    if (!path) { setUrl(src); return; }
    let cancelled = false;
    supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60).then(({ data }) => {
      if (cancelled) return;
      const signed = data?.signedUrl ?? src;
      cache.set(src, signed);
      setUrl(signed);
    });
    return () => { cancelled = true; };
  }, [src]);

  if (!url) return <div className={className} aria-label={alt} />;
  return <img src={url} alt={alt ?? ""} className={className} />;
}