import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {matchPath, useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';

type SocialImage = {kind: string; url: string; width: number; height: number; alt: string};
type Entry = {title: string; description: string; canonical: string; type: string; images: SocialImage[]};
type Data = {entries: Record<string, Entry>; icon: string; baseUrl: string};

export default function SocialMetadata(): ReactNode {
  const {pathname} = useLocation();
  const data = usePluginData('prism-social-cards') as Data;
  const options = {path: Object.keys(data.entries), exact: true};
  // Use the router's casing/slash rules, preserving explicit .html routes before
  // applying the same legacy HTML alias normalization as Docusaurus.
  const match = matchPath(pathname, options) ??
    matchPath(pathname.trim().replace(/(?:\/index)?\.html$/, '') || '/', options);
  const page = data.entries[match?.path ?? `${data.baseUrl}404.html`];
  const twitter = page.images.find((image) => image.kind === 'twitter')!;
  return (
    <Head>
      <link rel="canonical" href={page.canonical} />
      <link rel="apple-touch-icon" sizes="228x228" href={data.icon} />
      <meta name="description" content={page.description} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={page.canonical} />
      <meta property="og:type" content={page.type} />
      <meta property="og:site_name" content="Prism Library" />
      {/* Helmet preserves equal DOM nodes. Route-specific group identity keeps
          dimensions and type beside their image after client navigation. */}
      {page.images.filter((image) => image.kind !== 'twitter').flatMap((image) => [
        <meta key={`${image.kind}-url`} data-prism-social-image={image.url} property="og:image" content={image.url} />,
        <meta key={`${image.kind}-secure`} data-prism-social-image={image.url} property="og:image:secure_url" content={image.url} />,
        <meta key={`${image.kind}-type`} data-prism-social-image={image.url} property="og:image:type" content="image/png" />,
        <meta key={`${image.kind}-width`} data-prism-social-image={image.url} property="og:image:width" content={String(image.width)} />,
        <meta key={`${image.kind}-height`} data-prism-social-image={image.url} property="og:image:height" content={String(image.height)} />,
        <meta key={`${image.kind}-alt`} data-prism-social-image={image.url} property="og:image:alt" content={image.alt} />,
      ])}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={twitter.url} />
      <meta name="twitter:image:alt" content={twitter.alt} />
    </Head>
  );
}
