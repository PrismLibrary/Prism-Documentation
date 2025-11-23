/**
 * Custom DocsVersionBanner component to prevent showing unreleased banner
 * for the current version (9.1)
 */

import React from 'react';
import {useDocsVersion} from '@docusaurus/theme-common/internal';

export default function DocsVersionBanner(): JSX.Element | null {
  const version = useDocsVersion();
  
  // Don't show banner for current version (9.1) or if it's marked as the latest
  // The current version should never show as unreleased
  if (version.isLast || version.label === '9.1' || version.path === 'current') {
    return null;
  }
  
  // For older versions, show the default banner
  return (
    <div
      style={{
        margin: '0.5rem 0',
        padding: '0.5rem',
        backgroundColor: 'var(--ifm-color-warning)',
        color: 'var(--ifm-color-warning-contrast-foreground)',
        textAlign: 'center',
      }}
    >
      This is documentation for Prism Library {version.label} version.
      <br />
      For up-to-date documentation, see the{' '}
      <a href="/docs">latest version (9.1)</a>.
    </div>
  );
}

