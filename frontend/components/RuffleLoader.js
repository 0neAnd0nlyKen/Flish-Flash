// components/RuffleLoader.js
import { useEffect } from 'react';

export default function RuffleLoader() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/ruffle/ruffle.js';
    script.async = true;
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  return null;
}