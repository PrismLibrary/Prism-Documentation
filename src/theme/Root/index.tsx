import React, {useEffect, useState, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import SocialMetadata from '@site/src/components/SocialMetadata';

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {pathname} = useLocation();
  const [ready, setReady] = useState(0);
  useEffect(() => {
    const refresh = () => setReady((value) => value + 1);
    window.addEventListener('prism:route-metadata-ready', refresh);
    return () => window.removeEventListener('prism:route-metadata-ready', refresh);
  }, []);
  return <>{children}<SocialMetadata key={`${pathname}:${ready}`} /></>;
}
