import React, {useId, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

export type SampleCapture = {
  id: string;
  title: string;
  device: string;
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  sourceUrl: string;
};

type Props = {
  label: string;
  captures: readonly SampleCapture[];
  pending?: string;
};

export default function SampleGallery({label, captures, pending}: Props): ReactNode {
  const id = useId();
  const [selectedId, setSelectedId] = useState(captures[0]?.id);
  const selected = captures.find((capture) => capture.id === selectedId) ?? captures[0];

  if (!selected) {
    return <p className={styles.pending}>{pending ?? 'Runtime screenshots are pending for this framework.'}</p>;
  }

  const devices = [...new Set(captures.map((capture) => capture.device))];
  const scenes = captures.filter((capture) => capture.device === selected.device);
  const index = scenes.indexOf(selected);
  const selectScene = (next: number) => setSelectedId(scenes[next]!.id);

  return (
    <section className={styles.gallery} aria-label={label}>
      <div className={styles.controls}>
        <label htmlFor={`${id}-device`}>
          Device
          <select id={`${id}-device`} value={selected.device}
            onChange={(event) => setSelectedId(captures.find((capture) => capture.device === event.target.value)!.id)}>
            {devices.map((device) => <option key={device} value={device}>{device}</option>)}
          </select>
        </label>
        <label htmlFor={`${id}-scene`}>
          Screen or workflow
          <select id={`${id}-scene`} value={selected.id}
            onChange={(event) => setSelectedId(event.target.value)}>
            {scenes.map((capture) => <option key={capture.id} value={capture.id}>{capture.title}</option>)}
          </select>
        </label>
      </div>
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <img className={styles.image} src={selected.src} alt={selected.alt} loading="lazy" />
        </div>
        <figcaption aria-live="polite" aria-atomic="true">
          <strong>{selected.title}.</strong> {selected.caption}{' '}
          <a href={selected.sourceUrl}>Source {selected.sourceLabel}</a>.
        </figcaption>
      </figure>
      <div className={styles.navigation}>
        <button type="button" className="button button--secondary button--sm"
          disabled={index === 0} onClick={() => selectScene(index - 1)}
          aria-label={`Previous ${label} image`}>Previous</button>
        <span>{index + 1} of {scenes.length}</span>
        <button type="button" className="button button--secondary button--sm"
          disabled={index === scenes.length - 1} onClick={() => selectScene(index + 1)}
          aria-label={`Next ${label} image`}>Next</button>
      </div>
    </section>
  );
}
