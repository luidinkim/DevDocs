import React from 'react'
import Link from 'next/link'

interface LinkCardProps {
  title: string
  description: string
  href: string
  icon?: string
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, description, href, icon }) => {
  return (
    <Link href={href} className="link-card">
      <div className="link-card-content">
        {icon && <span className="link-card-icon">{icon}</span>}
        <div className="link-card-text">
          <h3 className="link-card-title">{title}</h3>
          <p className="link-card-description">{description}</p>
        </div>
        <svg 
          className="link-card-arrow" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  )
}

export const LinkCards: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="link-cards-container">{children}</div>
}