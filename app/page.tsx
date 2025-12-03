'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return <main />;
}
