import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type PricingTier = {
  name: string;
  nameId: string;
  price: string;
  priceId: string;
  features: string[];
  featuresId: string;
  ctaLink: string;
  highlight?: boolean;
  showAsterisk?: boolean;
};

const PricingTiers: PricingTier[] = [
  {
    name: 'Community',
    nameId: 'homepage.pricing.community.name',
    price: 'FREE*',
    priceId: 'homepage.pricing.community.price',
    features: [
      'Install via NuGet.org',
      'Unlimited Deployment',
    ],
    featuresId: 'homepage.pricing.community.features',
    ctaLink: 'https://prismlibrary.com/account',
    showAsterisk: true,
  },
  {
    name: 'Commercial Plus',
    nameId: 'homepage.pricing.commercialPlus.name',
    price: '$499',
    priceId: 'homepage.pricing.commercialPlus.price',
    features: [
      'Commercial App Development',
      'Install via NuGet.org',
      'Install via Private NuGet Feed',
      'Access to CI Builds',
      'More Frequent Updates',
      'Prism.Plugin.Popups',
      'Prism.Essentials (in Beta)',
      'Additional Containers',
      'Access to Discord',
      'Prism.Magician (coming soon)',
      'Visual Studio Extensions (coming soon)',
    ],
    featuresId: 'homepage.pricing.commercialPlus.features',
    ctaLink: 'https://prismlibrary.com/account',
    highlight: true,
  },
  {
    name: 'Commercial',
    nameId: 'homepage.pricing.commercial.name',
    price: '$299',
    priceId: 'homepage.pricing.commercial.price',
    features: [
      'Commercial App Development',
      'Install via NuGet.org',
      'Unlimited Deployment',
    ],
    featuresId: 'homepage.pricing.commercial.features',
    ctaLink: 'https://prismlibrary.com/account',
  },
];

function PricingCard({name, nameId, price, priceId, features, featuresId, ctaLink, highlight, showAsterisk}: PricingTier) {
  return (
    <div className={clsx('col col--4', styles.pricingCard, highlight && styles.pricingCardHighlight)}>
      <div className={clsx('card', styles.card)}>
        <div className="card__header">
          {highlight && (
            <div className={styles.badge}>
              <Translate id="homepage.pricing.bestValue" description="Best Value badge">
                Best Value
              </Translate>
            </div>
          )}
          <h3 className={styles.pricingTitle}>
            <Translate id={nameId} description={`${nameId} name`}>
              {name}
            </Translate>
          </h3>
          <div className={styles.pricingPrice}>
            <Translate id={priceId} description={`${priceId} price`}>
              {price}
            </Translate>
          </div>
          <div className={styles.pricingBilling}>
            <Translate id="homepage.pricing.billing" description="Billing period">
              per year / per developer
            </Translate>
          </div>
        </div>
        <div className="card__body">
          <ul className={styles.pricingFeatures}>
            {features.map((feature, idx) => (
              <li key={idx}>
                <span className={styles.checkmark}>✓</span>
                <Translate id={`${featuresId}.${idx}`} description={`Feature ${idx}`}>
                  {feature}
                </Translate>
              </li>
            ))}
          </ul>
        </div>
        <div className="card__footer">
          <Link
            className={clsx('button button--block', highlight ? styles.buttonPrimary : styles.buttonSecondary)}
            to={ctaLink}
            target="_blank">
            <Translate id="homepage.pricing.buyNow" description="Buy Now button">
              Buy Now
            </Translate>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepagePricing(): ReactNode {
  return (
    <section className={styles.pricing}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 className={clsx('text--center', styles.pricingSectionTitle)}>
              <Translate id="homepage.pricing.title" description="Pricing section title">
                Pricing
              </Translate>
            </h2>
            <p className={clsx('text--center', styles.pricingSectionSubtitle)}>
              <Translate id="homepage.pricing.subtitle" description="Pricing section subtitle">
                Choose the perfect plan tailored to your business needs. Whether you&apos;re a budding startup or a thriving enterprise, we offer pricing options that align with your company&apos;s growth and budget.
              </Translate>
            </p>
          </div>
        </div>
        <div className="row" style={{marginTop: '2rem'}}>
          {PricingTiers.map((tier, idx) => (
            <PricingCard key={idx} {...tier} />
          ))}
        </div>
        <div className="row" style={{marginTop: '2rem'}}>
          <div className="col col--12">
            <p className={clsx('text--center', styles.pricingFooter)}>
              <Translate id="homepage.pricing.disclaimer" description="Community license disclaimer">
                *Companies and individuals with less than $1 million USD in annual gross revenue, or have never received more than $3 million USD in capital from an outside source, such as private equity or venture capital, are eligible for the Community License.
              </Translate>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
