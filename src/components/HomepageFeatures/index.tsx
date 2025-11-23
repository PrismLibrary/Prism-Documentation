import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  titleId: string;
  icon: string;
  description: ReactNode;
  descriptionId: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Cross-Platform, Unified API',
    titleId: 'homepage.features.crossPlatform.title',
    icon: '🌐',
    description: (
      <Translate
        id="homepage.features.crossPlatform.description"
        description="Cross-platform feature description">
        Write once, deploy everywhere. Prism 9 provides a unified API across WPF, .NET MAUI, 
        Uno Platform, and Avalonia. Maximize code reuse and minimize platform-specific code.
      </Translate>
    ),
    descriptionId: 'homepage.features.crossPlatform.description',
  },
  {
    title: 'MVVM Made Simple',
    titleId: 'homepage.features.mvvm.title',
    icon: '⚡',
    description: (
      <Translate
        id="homepage.features.mvvm.description"
        description="MVVM feature description">
        Build maintainable, testable applications with Prism&apos;s implementation of MVVM patterns. 
        Dependency injection, commands, and navigation work seamlessly together out of the box.
      </Translate>
    ),
    descriptionId: 'homepage.features.mvvm.description',
  },
  {
    title: 'Enterprise Ready',
    titleId: 'homepage.features.enterprise.title',
    icon: '🏢',
    description: (
      <Translate
        id="homepage.features.enterprise.description"
        description="Enterprise feature description">
        Modular architecture, event aggregation, and loose coupling make Prism perfect for 
        large-scale applications. Keep your code organized and your team productive.
      </Translate>
    ),
    descriptionId: 'homepage.features.enterprise.description',
  },
];

function Feature({title, titleId, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon} style={{fontSize: '4rem', marginBottom: '1rem'}}>
          {icon}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>
          <Translate id={titleId} description={`${titleId} title`}>
            {title}
          </Translate>
        </h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
