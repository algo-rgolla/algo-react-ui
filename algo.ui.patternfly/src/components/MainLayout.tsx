import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
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

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Nav aria-label="Portfolio navigation">
          <NavList>
            <NavItem
              itemId={0}
              component={NavLink}
              to="/"
              isActive={location.pathname === '/'}
            >
              Dashboard
            </NavItem>
            <NavItem
              itemId={1}
              component={NavLink}
              to="/watchlist"
              isActive={location.pathname === '/watchlist'}
            >
              Watchlist
            </NavItem>
            <NavItem
              itemId={2}
              component={NavLink}
              to="/   "
              isActive={location.pathname === '/transactions'}
            >
              Algo Portfolio
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
            <MastheadBrand>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'var(--pf-global--warning-color--100)',
                    display: 'inline-block',
                  }}
                />
                <span>Portfolio Manager Pro</span>
              </span>
            </MastheadBrand>
          </MastheadMain>
        </Masthead>
      }
      sidebar={sidebar}
      isContentFilled
    >
      <PageSection isFilled variant="default">
        {children}
      </PageSection>
    </Page>
  )
}
