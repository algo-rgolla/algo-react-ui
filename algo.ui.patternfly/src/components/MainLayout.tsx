import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadMain,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core'
import { BarsIcon } from '@patternfly/react-icons'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Nav aria-label="Portfolio navigation">
          <NavList>
            <NavItem itemId={0} isActive={location.pathname === '/'}>
              <NavLink to="/" end>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem itemId={1} isActive={location.pathname.startsWith('/watchlist')}>
              <NavLink to="/watchlist">Watchlist</NavLink>
            </NavItem>
            <NavItem itemId={2} isActive={location.pathname.startsWith('/portfolio')}>
              <NavLink to="/portfolio">Algo Portfolio</NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  )

  return (
    <Page
      masthead={
        <Masthead>
          <MastheadMain>
            <Button
              variant="plain"
              aria-label={isSidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              aria-pressed={isSidebarOpen}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="main-layout__menu-toggle"
              icon={<BarsIcon />}
            />
            <MastheadBrand>
              <span className="main-layout__brand">
                <span className="main-layout__brand-dot" />
                <span>Portfolio Manager Pro</span>
              </span>
            </MastheadBrand>
          </MastheadMain>
        </Masthead>
      }
      sidebar={isSidebarOpen ? sidebar : undefined}
      isContentFilled
    >
      <PageSection isFilled variant="default">
        {children}
      </PageSection>
    </Page>
  )
}
