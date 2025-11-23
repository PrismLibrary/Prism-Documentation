import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePricing from '@site/src/components/HomepagePricing';
import HomepageTeam from '@site/src/components/HomepageTeam';
import {fetchTotalDownloads, formatDownloadsInMillions} from '@site/src/utils/nuget-downloads';

import styles from './index.module.css';

type AppScenario = {
  id: string;
  type: 'desktop' | 'mobile';
  title: string;
  content: ReactNode;
};

const appScenarios: AppScenario[] = [
  {
    id: 'orders',
    type: 'desktop',
    title: 'Order Management System',
    content: (
      <div className={styles.desktopContent}>
        <div className={styles.appHeader}>
          <div className={styles.appTitle}>Order Management</div>
        </div>
        <div className={styles.appBody}>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Orders</div>
              <div className={styles.statValue}>1,247</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Pending</div>
              <div className={styles.statValue}>89</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Revenue</div>
              <div className={styles.statValue}>$124K</div>
            </div>
          </div>
          <div className={styles.tableArea}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCol}>Order #</div>
              <div className={styles.tableCol}>Customer</div>
              <div className={styles.tableCol}>Status</div>
              <div className={styles.tableCol}>Amount</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>#ORD-2024-001</div>
              <div className={styles.tableCol}>Acme Corp</div>
              <div className={clsx(styles.badge, styles.badgeSuccess)}>Shipped</div>
              <div className={styles.tableCol}>$2,450</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>#ORD-2024-002</div>
              <div className={styles.tableCol}>Tech Solutions</div>
              <div className={clsx(styles.badge, styles.badgeWarning)}>Processing</div>
              <div className={styles.tableCol}>$1,890</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>#ORD-2024-003</div>
              <div className={styles.tableCol}>Global Industries</div>
              <div className={clsx(styles.badge, styles.badgeInfo)}>Pending</div>
              <div className={styles.tableCol}>$3,200</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'delivery',
    type: 'mobile',
    title: 'Delivery Driver App',
    content: (
      <div className={styles.mobileContent}>
        <div className={styles.mobileHeader}>Active Deliveries</div>
        <div className={styles.mobileList}>
          <div className={styles.deliveryItem}>
            <div className={styles.deliveryIcon}>🚚</div>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryAddress}>123 Main St</div>
              <div className={styles.deliveryTime}>ETA: 15 min</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeSuccess)}>On Route</div>
          </div>
          <div className={styles.deliveryItem}>
            <div className={styles.deliveryIcon}>📦</div>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryAddress}>456 Oak Ave</div>
              <div className={styles.deliveryTime}>ETA: 8 min</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeWarning)}>Next</div>
          </div>
          <div className={styles.deliveryItem}>
            <div className={styles.deliveryIcon}>🏠</div>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryAddress}>789 Pine Rd</div>
              <div className={styles.deliveryTime}>ETA: 22 min</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeInfo)}>Queued</div>
          </div>
        </div>
        <div className={styles.mapPreview}>
          <div className={styles.mapMarker}>📍</div>
          <div className={styles.mapRoute}></div>
        </div>
      </div>
    ),
  },
  {
    id: 'stocks',
    type: 'desktop',
    title: 'Stock Market Analytics',
    content: (
      <div className={styles.desktopContent}>
        <div className={styles.appHeader}>
          <div className={styles.appTitle}>Market Dashboard</div>
        </div>
        <div className={styles.appBody}>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Portfolio Value</div>
              <div className={styles.statValue}>$245,890</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Today's Gain</div>
              <div className={clsx(styles.statValue, styles.statPositive)}>+2.4%</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Active Positions</div>
              <div className={styles.statValue}>12</div>
            </div>
          </div>
          <div className={styles.chartArea}>
            <div className={styles.chartBars}>
              <div className={styles.chartBar} style={{height: '65%'}}></div>
              <div className={styles.chartBar} style={{height: '80%'}}></div>
              <div className={styles.chartBar} style={{height: '45%'}}></div>
              <div className={styles.chartBar} style={{height: '90%'}}></div>
              <div className={styles.chartBar} style={{height: '70%'}}></div>
              <div className={styles.chartBar} style={{height: '55%'}}></div>
            </div>
          </div>
          <div className={styles.stockList}>
            <div className={styles.stockItem}>
              <div className={styles.stockSymbol}>AAPL</div>
              <div className={styles.stockPrice}>$178.50</div>
              <div className={clsx(styles.stockChange, styles.stockPositive)}>+1.2%</div>
            </div>
            <div className={styles.stockItem}>
              <div className={styles.stockSymbol}>MSFT</div>
              <div className={styles.stockPrice}>$385.20</div>
              <div className={clsx(styles.stockChange, styles.stockPositive)}>+0.8%</div>
            </div>
            <div className={styles.stockItem}>
              <div className={styles.stockSymbol}>GOOGL</div>
              <div className={styles.stockPrice}>$142.30</div>
              <div className={clsx(styles.stockChange, styles.stockNegative)}>-0.5%</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'inventory',
    type: 'mobile',
    title: 'Inventory Management',
    content: (
      <div className={styles.mobileContent}>
        <div className={styles.mobileHeaderTwoLine}>
          <div>Warehouse</div>
          <div>Inventory</div>
        </div>
        <div className={styles.mobileList}>
          <div className={styles.inventoryItem}>
            <div className={styles.inventoryIcon}>📱</div>
            <div className={styles.inventoryInfo}>
              <div className={styles.inventoryName}>Smartphones</div>
              <div className={styles.inventoryStock}>Stock: 1,245 units</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeInStock)}>IN STOCK</div>
          </div>
          <div className={styles.inventoryItem}>
            <div className={styles.inventoryIcon}>💻</div>
            <div className={styles.inventoryInfo}>
              <div className={styles.inventoryName}>Laptops</div>
              <div className={styles.inventoryStock}>Stock: 342 units</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeLowStock)}>LOW STOCK</div>
          </div>
          <div className={styles.inventoryItem}>
            <div className={styles.inventoryIcon}>⌚</div>
            <div className={styles.inventoryInfo}>
              <div className={styles.inventoryName}>Smartwatches</div>
              <div className={styles.inventoryStock}>Stock: 89 units</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeReorder)}>REORDER</div>
          </div>
        </div>
        <div className={styles.scanArea}>
          <button className={styles.scanButton}>
            <span className={styles.scanIcon}>📷</span>
            <span>Scan Barcode</span>
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 'sales',
    type: 'desktop',
    title: 'Sales Dashboard',
    content: (
      <div className={styles.desktopContent}>
        <div className={styles.appHeader}>
          <div className={styles.appTitle}>Sales Performance</div>
        </div>
        <div className={styles.appBody}>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Monthly Revenue</div>
              <div className={styles.statValue}>$89,450</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>New Customers</div>
              <div className={styles.statValue}>156</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Conversion Rate</div>
              <div className={styles.statValue}>12.4%</div>
            </div>
          </div>
          <div className={styles.chartArea}>
            <div className={styles.chartBars}>
              <div className={styles.chartBar} style={{height: '50%'}}></div>
              <div className={styles.chartBar} style={{height: '65%'}}></div>
              <div className={styles.chartBar} style={{height: '80%'}}></div>
              <div className={styles.chartBar} style={{height: '75%'}}></div>
              <div className={styles.chartBar} style={{height: '90%'}}></div>
              <div className={styles.chartBar} style={{height: '85%'}}></div>
            </div>
          </div>
          <div className={styles.appFooter}>
            <div className={styles.appDate}>Last updated: Today</div>
            <div className={styles.appSource}>Real-time data synchronization</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'fieldservice',
    type: 'mobile',
    title: 'Field Service App',
    content: (
      <div className={styles.mobileContent}>
        <div className={styles.mobileHeader}>Service Requests</div>
        <div className={styles.mobileList}>
          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}>🔧</div>
            <div className={styles.serviceInfo}>
              <div className={styles.serviceTitle}>HVAC Repair</div>
              <div className={styles.serviceLocation}>123 Business Park</div>
              <div className={styles.serviceTime}>Scheduled: 2:00 PM</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeWarning)}>In Progress</div>
          </div>
          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}>⚡</div>
            <div className={styles.serviceInfo}>
              <div className={styles.serviceTitle}>Electrical Service</div>
              <div className={styles.serviceLocation}>456 Industrial Way</div>
              <div className={styles.serviceTime}>Scheduled: 3:30 PM</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeInfo)}>Upcoming</div>
          </div>
          <div className={styles.serviceItem}>
            <div className={styles.serviceIcon}>🔨</div>
            <div className={styles.serviceInfo}>
              <div className={styles.serviceTitle}>Plumbing Repair</div>
              <div className={styles.serviceLocation}>789 Commercial Blvd</div>
              <div className={styles.serviceTime}>Scheduled: 4:15 PM</div>
            </div>
            <div className={clsx(styles.badge, styles.badgeInfo)}>Upcoming</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'financial',
    type: 'desktop',
    title: 'Financial Reporting',
    content: (
      <div className={styles.desktopContent}>
        <div className={styles.appHeader}>
          <div className={styles.appTitle}>Financial Overview</div>
        </div>
        <div className={styles.appBody}>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Assets</div>
              <div className={styles.statValue}>$2.4M</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Revenue</div>
              <div className={styles.statValue}>$450K</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Profit Margin</div>
              <div className={styles.statValue}>18.5%</div>
            </div>
          </div>
          <div className={styles.financialTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCol}>Account</div>
              <div className={styles.tableCol}>Balance</div>
              <div className={styles.tableCol}>Change</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>Operating Account</div>
              <div className={styles.tableCol}>$125,000</div>
              <div className={clsx(styles.stockChange, styles.stockPositive)}>+5.2%</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>Investment Account</div>
              <div className={styles.tableCol}>$1,850,000</div>
              <div className={clsx(styles.stockChange, styles.stockPositive)}>+3.8%</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCol}>Savings Account</div>
              <div className={styles.tableCol}>$425,000</div>
              <div className={clsx(styles.stockChange, styles.stockPositive)}>+1.2%</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

function HomepageHeader() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % appScenarios.length);
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentApp = appScenarios[currentIndex];

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <Translate
                id="homepage.hero.title"
                description="The homepage hero title">
                Empower Your XAML Applications
              </Translate>
            </h1>
            <p className={styles.heroSubtitle}>
              <Translate
                id="homepage.hero.description"
                description="The homepage hero description">
                Leverage the power of the Prism Library to build robust and maintainable WPF, .NET MAUI, Uno Platform, and Avalonia applications with ease.
              </Translate>
            </p>
            <div className={styles.heroButtons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/current">
                <Translate
                  id="homepage.hero.getStarted"
                  description="The homepage get started button text">
                  Get started
                </Translate>
              </Link>
            </div>
            <div className={styles.appIndicators}>
              {appScenarios.map((_, idx) => (
                <button
                  key={idx}
                  className={clsx(styles.indicator, idx === currentIndex && styles.indicatorActive)}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Show ${appScenarios[idx].title}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.heroShowcase}>
            {currentApp.type === 'desktop' ? (
              <div className={styles.laptopFrame}>
                <div className={styles.laptopScreen}>
                  <div className={styles.laptopBezel}>
                    <div className={styles.laptopCamera}></div>
                  </div>
                  <div className={styles.laptopContent}>
                    {currentApp.content}
                  </div>
                </div>
                <div className={styles.laptopBase}>
                  <div className={styles.laptopKeyboard}></div>
                  <div className={styles.laptopTrackpad}></div>
                </div>
              </div>
            ) : (
              <div className={styles.iphoneFrame}>
                <div className={styles.iphoneNotch}></div>
                <div className={styles.iphoneScreen}>
                  {currentApp.content}
                </div>
                <div className={styles.iphoneHomeIndicator}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageStats() {
  const [downloadsText, setDownloadsText] = useState<string>('0'); // Fallback value
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch download count on client side
    // Uses DEFAULT_OWNER from nuget-downloads.ts
    fetchTotalDownloads()
      .then((totalDownloads) => {
        console.log('Successfully fetched downloads:', totalDownloads);
        const formatted = formatDownloadsInMillions(totalDownloads);
        setDownloadsText(formatted);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error('Failed to fetch download count:', error);
        setError(error.message || 'Failed to fetch download count');
        // Keep the fallback value on error
        setIsLoading(false);
      });
  }, []);

  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsContent}>
          <div className={styles.statsItem}>
            <div className={styles.statsNumber}>
              {isLoading ? '...' : downloadsText}
            </div>
            <div className={styles.statsLabel}>
              <Translate
                id="homepage.stats.downloads"
                description="Downloads stat label">
                Total Downloads
              </Translate>
            </div>
            <div className={styles.statsDescription}>
              Trusted by developers worldwide on{' '}
              <a href="https://www.nuget.org/profiles/PrismLibrary" target="_blank" rel="noopener noreferrer">
                NuGet
              </a>
            </div>
          </div>
          <div className={styles.statsItem}>
            <div className={styles.statsNumber}>9.0</div>
            <div className={styles.statsLabel}>
              <Translate
                id="homepage.stats.version"
                description="Version stat label">
                Latest Version
              </Translate>
            </div>
            <div className={styles.statsDescription}>
              Unified API across all platforms
            </div>
          </div>
          <div className={styles.statsItem}>
            <div className={styles.statsNumber}>4</div>
            <div className={styles.statsLabel}>
              <Translate
                id="homepage.stats.platforms"
                description="Platforms stat label">
                Supported Platforms
              </Translate>
            </div>
            <div className={styles.statsDescription}>
              WPF, .NET MAUI, Uno Platform, Avalonia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <HomepageStats />
        <HomepageFeatures />
        <HomepagePricing />
        <HomepageTeam />
      </main>
    </Layout>
  );
}
