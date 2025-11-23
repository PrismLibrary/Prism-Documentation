import type {ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type TeamMember = {
  name: string;
  title: string;
  image: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
};

const teamMembers: TeamMember[] = [
  {
    name: 'Brian Lagunas',
    title: 'Microsoft MVP',
    image: '/img/brian-lagunas.jpg',
    twitter: 'https://x.com/brianlagunas',
    youtube: 'https://www.youtube.com/@brianlagunas',
    linkedin: 'https://www.linkedin.com/in/brianlagunas',
  },
  {
    name: 'Dan Siegel',
    title: 'Microsoft MVP',
    image: '/img/dan-siegel.jpg',
    twitter: 'https://x.com/dansiegel',
    youtube: 'https://www.youtube.com/@dansiegel',
    linkedin: 'https://www.linkedin.com/in/dansiegel',
  },
];

function TeamMemberCard({member}: {member: TeamMember}) {
  return (
    <div className={styles.teamCard}>
      <div className={styles.teamImageContainer}>
        <img
          src={member.image}
          alt={member.name}
          className={styles.teamImage}
          loading="lazy"
        />
      </div>
      <div className={styles.teamInfo}>
        <h3 className={styles.teamName}>{member.name}</h3>
        <p className={styles.teamTitle}>{member.title}</p>
        <div className={styles.teamSocial}>
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label={`${member.name} on X (Twitter)`}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {member.youtube && (
            <a
              href={member.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label={`${member.name} on YouTube`}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label={`${member.name} on LinkedIn`}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomepageTeam(): ReactNode {
  return (
    <section className={styles.teamSection}>
      <div className="container">
        <div className={styles.teamContent}>
          <h2 className={styles.teamHeading}>
            <Translate
              id="homepage.team.title"
              description="The homepage team section title">
              Meet our team
            </Translate>
          </h2>
          <p className={styles.teamSubtitle}>
            <Translate
              id="homepage.team.subtitle"
              description="The homepage team section subtitle">
              We&apos;re a dynamic group of individuals who are passionate about what we do.
            </Translate>
          </p>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, idx) => (
              <TeamMemberCard key={idx} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

