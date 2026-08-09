"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavChild {
  label: string;
  href: string;
  hasSubMenu?: boolean;
  children?: NavChild[];
}

interface NavItem {
  label: string;
  href?: string;
  hasMegaMenu?: boolean;
  hasSubMenu?: boolean;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Features",
    hasMegaMenu: true,
    children: [
      { label: "Best beach resorts in Maldives", href: "#" },
      { label: "Top 10 budget cities in Europe", href: "#" },
      { label: "Hidden gems of Southeast Asia", href: "#" },
      { label: "Luxury safari lodges in Kenya", href: "#" },
      { label: "Weekend getaways from Dubai", href: "#" },
      { label: "Solo travel safety tips 2026", href: "#" },
    ],
  },
  {
    label: "Flights",
    hasMegaMenu: true,
    children: [
      { label: "Cheap flights to Bali", href: "#" },
      { label: "Business class deals from India", href: "#" },
      { label: "Direct flights to Maldives", href: "#" },
      { label: "Airline reviews and ratings", href: "#" },
    ],
  },
  {
    label: "Pages",
    hasSubMenu: true,
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Author", href: "/author" },
      {
        label: "Category Layout", href: "#", hasSubMenu: true,
        children: [
          { label: "Category Layout 01", href: "/category/athletics" },
          { label: "Category Layout 02", href: "/category/basketball" },
          { label: "Category Layout 03", href: "/category/cricket" },
          { label: "Category Layout 04", href: "/category/esports" },
          { label: "Category Layout 05", href: "/category/football" },
        ],
      },
      {
        label: "Post Layout", href: "#", hasSubMenu: true,
        children: [
          { label: "Post Layout 01", href: "#" },
          { label: "Post Layout 02", href: "#" },
          { label: "Post Layout 03", href: "#" },
          { label: "Post Layout 04", href: "#" },
          { label: "Post Layout 05", href: "#" },
          { label: "Post Layout 06", href: "#" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
  {
    label: "Static & Legal",
    hasSubMenu: true,
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Privacy Policy & GDPR/CCPA", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

interface MobileNavItem {
  label: string;
  href?: string;
  children?: MobileNavItem[];
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Author", href: "/author" },
  {
    label: "Pages",
    children: [
      {
        label: "Category Layout",
        children: [
          { label: "Category Layout 01", href: "/category/athletics" },
          { label: "Category Layout 02", href: "/category/basketball" },
          { label: "Category Layout 03", href: "/category/cricket" },
          { label: "Category Layout 04", href: "/category/esports" },
          { label: "Category Layout 05", href: "/category/football" },
        ],
      },
      {
        label: "Post Layout",
        children: [
          { label: "Post Layout 01", href: "#" },
          { label: "Post Layout 02", href: "#" },
          { label: "Post Layout 03", href: "#" },
          { label: "Post Layout 04", href: "#" },
          { label: "Post Layout 05", href: "#" },
        ],
      },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  { label: "Contact", href: "/contact" },
  {
    label: "Static & Legal",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Privacy Policy & GDPR/CCPA", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

const tickerNews = [
  "Dubai launches new direct flight routes to 12 Asian destinations",
  "Maldives resort opens underwater restaurant and spa",
  "European rail pass prices slashed for winter 2026 season",
  "New visa-free travel agreement signed between India and Japan",
  "Bali introduces tourist sustainability fee starting next month",
  "Cockpit Travel ranked top flight comparison site in Asia",
];

const tags = [
  "Flights", "Hotels", "Beach", "Adventure", "Cruises", "Backpacking",
  "Luxury", "Budget", "Solo", "Family", "Europe", "Asia",
  "Travel", "Visa",
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTicker, setActiveTicker] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState<Set<string>>(new Set());
  const [tagOffset, setTagOffset] = useState(0);
  const [maxTagOffset, setMaxTagOffset] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tagTrackRef = useRef<HTMLDivElement>(null);

  const canGoPrev = tagOffset > 0;
  const canGoNext = tagOffset < maxTagOffset;

  const recalcMaxOffset = useCallback(() => {
    const track = tagTrackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    if (children.length === 0) return;
    const GAP = 15;
    const trackWidth = track.parentElement!.clientWidth;
    const totalWidth = children.reduce((sum, child) => sum + child.offsetWidth, 0) + (children.length - 1) * GAP;
    setMaxTagOffset(Math.max(0, totalWidth - trackWidth));
  }, []);

  useEffect(() => {
    recalcMaxOffset();
    const onResize = () => recalcMaxOffset();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcMaxOffset]);

  const slideTags = useCallback((direction: "next" | "prev") => {
    const track = tagTrackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    if (children.length === 0) return;

    const GAP = 15;
    const step = children.length > 1 ? children[1].offsetWidth + GAP : children[0].offsetWidth;

    setTagOffset((prev) => {
      if (direction === "next") {
        return Math.min(prev + step, maxTagOffset);
      }
      return Math.max(prev - step, 0);
    });
  }, [maxTagOffset]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTicker((prev) => (prev + 1) % tickerNews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const stickyBar = headerRef.current.querySelector(".header-sticky-bar") as HTMLElement;
      if (!stickyBar) return;

      const headerTop = headerRef.current.getBoundingClientRect();
      if (headerTop.bottom < 0) {
        stickyBar.classList.add("is-sticky");
      } else {
        stickyBar.classList.remove("is-sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen || offcanvasOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, offcanvasOpen]);

  const toggleMobileExpand = (path: string) => {
    setMobileExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderMobileMenu = (items: MobileNavItem[], parentPath = ""): React.ReactNode => {
    return items.map((item) => {
      const path = parentPath ? `${parentPath} > ${item.label}` : item.label;
      const isExpanded = mobileExpanded.has(path);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <li key={item.label} className="menu-item">
          <Link
            href={item.href || "#"}
            className="menu-item-link"
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleMobileExpand(path);
              } else {
                setMobileOpen(false);
              }
            }}
          >
            <span className="menu-item-text">{item.label}</span>
            {hasChildren && (
              <span
                className={`sub-menu-icon ${isExpanded ? "sub-menu-open" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMobileExpand(path);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                </svg>
              </span>
            )}
          </Link>
          {hasChildren && (
            <ul className={`sub-menu ${isExpanded ? "show-sub-menu" : ""}`}>
              {renderMobileMenu(item.children!, path)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <>
      <header className="rstb-header" ref={headerRef}>
        {/* Top Header Row */}
        <div className="header-top">
          <div className="nerio-container">
            <div className="header-top-inner">
              {/* Logo */}
              <Link href="/" className="rstb-site-logo">
                {/* <Image
                  src="/assets/images/logo.png"
                  alt="Travel News"
                  width={100}
                  height={35}
                  priority
                /> */}
                <h2 className="text-xxl text-white font-bold ml-0">
                  <span className="text-[#0073FF]">Cockpit</span>
                  <span className="text-white">.</span>
                  <span className="text-white" style={{ marginLeft: '-0.40rem' }}>Travel</span>
                </h2>
              </Link>

              {/* Navigation */}
              <nav className="rstb-nav-menu nav-breakpoint-lg">
                <ul className="primary-menu">
                  {navItems.map((item) => (
                    <li
                      key={item.label}
                      className={`menu-item ${item.hasMegaMenu ? "menu-item-has-mega-menu" : ""} ${item.hasSubMenu ? "menu-item-has-children" : ""}`}
                    >
                      <Link
                        href={item.href || "#"}
                        className="menu-item-link"
                        onClick={(e) => {
                          if (item.hasMegaMenu || item.hasSubMenu) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <span className="menu-item-text">{item.label}</span>
                        {(item.hasMegaMenu || item.hasSubMenu) && (
                          <span className="sub-menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                            </svg>
                          </span>
                        )}
                      </Link>

                      {/* Mega Menu */}
                      {item.hasMegaMenu && item.children && (
                        <div className="mega-menu">
                          <div className="mega-menu-grid">
                            <div className="mega-menu-item">
                              <div className="mega-menu-item-title">{item.label}</div>
                              {item.children.slice(0, 3).map((child) => (
                                <Link key={child.label} href={child.href} className="mega-menu-item-link">
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                            <div className="mega-menu-item">
                              <div className="mega-menu-item-title">Latest</div>
                              {item.children.slice(3).map((child) => (
                                <Link key={child.label} href={child.href} className="mega-menu-item-link">
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                            <div className="mega-menu-item">
                              <div className="mega-menu-item-title">Popular</div>
                              {item.children.slice(0, 2).map((child) => (
                                <Link key={child.label} href={child.href} className="mega-menu-item-link">
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Regular Sub Menu */}
                      {item.hasSubMenu && item.children && (
                        <ul className="sub-menu">
                          {item.children.map((child) => (
                            <li key={child.label} className={`menu-item ${child.hasSubMenu ? "menu-item-has-children" : ""}`}>
                              <Link
                                href={child.href}
                                className="menu-item-link"
                                onClick={(e) => {
                                  if (child.hasSubMenu) e.preventDefault();
                                }}
                              >
                                <span className="menu-item-text">{child.label}</span>
                                {child.hasSubMenu && (
                                  <span className="sub-menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                                    </svg>
                                  </span>
                                )}
                              </Link>
                              {child.hasSubMenu && child.children && (
                                <ul className="sub-menu">
                                  {child.children.map((grandchild) => (
                                    <li key={grandchild.label} className="menu-item">
                                      <Link href={grandchild.href} className="menu-item-link">
                                        <span className="menu-item-text">{grandchild.label}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Mobile Menu Toggler */}
                <div className="menu-toggler-wrap">
                  <button
                    className={`menu-toggler ${mobileOpen ? "panel-open" : ""}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                  >
                    <span className="open-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
                        <path d="M6 1.8001C6 1.13738 6.53728 0.600098 7.2 0.600098H22.8C23.4627 0.600098 24 1.13738 24 1.8001C24 2.46282 23.4627 3.0001 22.8 3.0001H7.2C6.53728 3.0001 6 2.46277 6 1.8001ZM22.8 7.8001H1.2C0.537281 7.8001 0 8.33743 0 9.0001C0 9.66282 0.537281 10.2001 1.2 10.2001H22.8C23.4627 10.2001 24 9.66282 24 9.0001C24 8.33743 23.4627 7.8001 22.8 7.8001ZM22.8 15.0001H12C11.3373 15.0001 10.8 15.5374 10.8 16.2001C10.8 16.8628 11.3373 17.4001 12 17.4001H22.8C23.4627 17.4001 24 16.8628 24 16.2001C24 15.5374 23.4627 15.0001 22.8 15.0001Z" />
                      </svg>
                    </span>
                    <span className="close-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Mobile Panel */}
                <div className={`mobile-panel-wrapper panel-offcanvas position-right ${mobileOpen ? "show-panel" : ""}`}>
                  <div className="mobile-panel-overly" onClick={() => setMobileOpen(false)} />
                  <div className="mobile-panel-content">
                    <button className="mobile-panel-close" onClick={() => setMobileOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
                      </svg>
                    </button>
                    <div className="mobile-panel-logo">
                      <Image src="/assets/images/logo.png" alt="logo" width={150} height={35} style={{ height: 35, width: "auto" }} />
                    </div>
                    <ul className="mobile-menu has-vertical-divider">
                      {renderMobileMenu(mobileNavItems)}
                    </ul>
                  </div>
                </div>
              </nav>

              {/* Header Actions */}
              <div className="flex items-center gap-3 header-actions-desktop">
                <Link href="/login" className="rs-button user-btn">
                  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z" />
                  </svg>
                </Link>

                <Link href="/register" className="rs-button style-default text-anim-flip-top hidden lg:inline-flex" style={{ height: 50, padding: "0 25px" }}>
                  <span className="button-text" data-text="Sign Up">Sign Up</span>
                </Link>

                <div ref={searchRef}>
                  <div className="rstb-mini-search">
                    <button
                      className={`search-btn ${searchOpen ? "search-open" : ""}`}
                      onClick={() => setSearchOpen(!searchOpen)}
                      aria-label="Search"
                    >
                      <span className="open-icon">
                        <svg viewBox="0 0 612.01 612.01" xmlns="http://www.w3.org/2000/svg">
                          <path d="M606.209 578.714 448.198 423.228C489.576 378.272 515 318.817 515 253.393 514.98 113.439 399.704 0 257.493 0S.006 113.439.006 253.393s115.276 253.393 257.487 253.393c61.445 0 117.801-21.253 162.068-56.586l158.624 156.099c7.729 7.614 20.277 7.614 28.006 0a19.291 19.291 0 0 0 .018-27.585zM257.493 467.8c-120.326 0-217.869-95.993-217.869-214.407S137.167 38.986 257.493 38.986c120.327 0 217.869 95.993 217.869 214.407S377.82 467.8 257.493 467.8z" />
                        </svg>
                      </span>
                      <span className="close-icon">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25 512a25 25 0 0 1-17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462A24.93 24.93 0 0 1 25 512z" />
                          <path d="M487 512a24.93 24.93 0 0 1-17.68-7.32l-462-462A25 25 0 0 1 42.68 7.32l462 462A25 25 0 0 1 487 512z" />
                        </svg>
                      </span>
                    </button>
                    <div className={`search-form-area ${searchOpen ? "search-open" : ""}`}>
                      <form role="search">
                        <input type="search" className="search-field" placeholder="Search..." />
                      </form>
                    </div>
                  </div>
                </div>

                {/* Offcanvas Toggle (tablet+) */}
                <div className="rstb-offcanvas-wrap hidden lg:block">
                  <div className="offcanvas-toggle-wrap">
                    <button
                      className="offcanvas-toggle"
                      onClick={() => setOffcanvasOpen(!offcanvasOpen)}
                      aria-label="Menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
                        <path d="M6 1.8001C6 1.13738 6.53728 0.600098 7.2 0.600098H22.8C23.4627 0.600098 24 1.13738 24 1.8001C24 2.46282 23.4627 3.0001 22.8 3.0001H7.2C6.53728 3.0001 6 2.46277 6 1.8001ZM22.8 7.8001H1.2C0.537281 7.8001 0 8.33743 0 9.0001C0 9.66282 0.537281 10.2001 1.2 10.2001H22.8C23.4627 10.2001 24 9.66282 24 9.0001C24 8.33743 23.4627 7.8001 22.8 7.8001ZM22.8 15.0001H12C11.3373 15.0001 10.8 15.5374 10.8 16.2001C10.8 16.8628 11.3373 17.4001 12 17.4001H22.8C23.4627 17.4001 24 16.8628 24 16.2001C24 15.5374 23.4627 15.0001 22.8 15.0001Z" />
                      </svg>
                    </button>
                  </div>
                  <div className={`rstb-offcanvas-panel ${offcanvasOpen ? "show-offcanvas" : ""}`}>
                    <div className="offcanvas-overly" onClick={() => setOffcanvasOpen(false)} />
                    <div className="offcanvas-container">
                      <button className="offcanvas-close" onClick={() => setOffcanvasOpen(false)}>
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25 512a25 25 0 0 1-17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462A24.93 24.93 0 0 1 25 512z" />
                          <path d="M487 512a24.93 24.93 0 0 1-17.68-7.32l-462-462A25 25 0 0 1 42.68 7.32l462 462A25 25 0 0 1 487 512z" />
                        </svg>
                      </button>
                      <div className="offcanvas-content" style={{ padding: "80px 50px 50px" }}>
                        <div className="offcanvas-logo">
                          <Link href="/">
                            <Image src="/assets/images/logo.png" alt="Cockpit Travel" width={180} height={35} style={{ height: 35, width: "auto" }} />
                          </Link>
                        </div>
                        <p className="offcanvas-description">
                          Your trusted partner for finding the best flight deals, hotel bookings, and travel inspiration worldwide.
                        </p>
                        <div className="offcanvas-gallery">
                          <a href="/category/flights"><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop" alt="Beach Paradise" width={150} height={150} /></a>
                          <a href="/category/hotels"><img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=150&h=150&fit=crop" alt="Tropical Resort" width={150} height={150} /></a>
                          <a href="/category/destinations"><img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&h=150&fit=crop" alt="Mountain Lake" width={150} height={150} /></a>
                          <a href="/category/travel-intelligence"><img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&h=150&fit=crop" alt="Road Trip" width={150} height={150} /></a>
                          <a href="/category/flights"><img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=150&h=150&fit=crop" alt="Ancient Temple" width={150} height={150} /></a>
                          <a href="/category/hotels"><img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop" alt="Travel Backpack" width={150} height={150} /></a>
                        </div>
                        <div className="offcanvas-contact">
                          <h4>Quick Contact:</h4>
                          <ul className="offcanvas-contact-list">
                            <li>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M15.7918 12.3893C15.3823 11.9629 14.8884 11.735 14.365 11.735C13.8458 11.735 13.3477 11.9587 12.9214 12.3851L11.5875 13.7147C11.4778 13.6556 11.368 13.6007 11.2625 13.5459C11.1105 13.4699 10.967 13.3981 10.8446 13.3222C9.59513 12.5286 8.45964 11.4944 7.37059 10.1563C6.84295 9.48936 6.48837 8.92795 6.23088 8.3581C6.57702 8.04151 6.89782 7.71226 7.21019 7.39568C7.32838 7.27748 7.44657 7.15507 7.56476 7.03688C8.4512 6.15044 8.4512 5.00229 7.56476 4.11585L6.41239 2.96348C6.28154 2.83263 6.14646 2.69755 6.01983 2.56248C5.76656 2.30077 5.50063 2.03061 5.22625 1.77734C4.8168 1.37211 4.32715 1.15684 3.81217 1.15684C3.29719 1.15684 2.7991 1.37211 2.37698 1.77734C1.66708 2.48724 1.23631 3.48681 1.16476 4.56273C1.04168 6.41458 1.72898 8.29236 2.87468 10.1563C4.31603 12.5111 6.1661 14.5384 8.35842 16.1697C10.3752 17.6807 12.7096 18.8484 15.2008 19.5891C15.3488 19.6335 15.5012 19.6625 15.6545 19.6877C16.138 19.7664 16.6405 19.7821 17.125 19.6973C18.2752 19.4957 19.3085 18.9206 20.0455 18.0807C20.7825 17.2409 21.1756 16.1919 21.1489 15.1138C21.1244 14.1469 20.7299 13.2298 20.0483 12.5278L15.7918 12.3893Z" />
                              </svg>
                              +81112522552
                            </li>
                            <li>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
                                <path d="M21.8667 0H5.33333C4.16 0 3.2 1.10769 3.2 2.46154V3.38462C3.2 3.72308 3.44 4 3.73333 4C4.02667 4 4.26667 3.72308 4.26667 3.38462V2.46154C4.26667 2.33846 4.29333 2.21538 4.32 2.09231L10.2933 8L4.32 13.9077C4.29333 13.7846 4.26667 13.6615 4.26667 13.5385V12.6154C4.26667 12.2769 4.02667 12 3.73333 12C3.44 12 3.2 12.2769 3.2 12.6154V13.5385C3.2 14.8923 4.16 16 5.33333 16H21.8667C23.04 16 24 14.8923 24 13.5385V2.46154C24 1.10769 23.04 0 21.8667 0Z" />
                              </svg>
                              info@nerio.com
                            </li>
                            <li>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 22">
                                <path d="M7.34697 1.71897C7.10935 1.71725 6.91556 1.90846 6.91385 2.14565C6.91213 2.38284 7.10291 2.57663 7.34053 2.57835C7.57771 2.58006 7.7715 2.38928 7.77322 2.15209C7.77494 1.91491 7.58416 1.72112 7.34697 1.71897Z" />
                                <path d="M9.9413 16.1753C12.7993 12.4965 14.5854 10.5782 14.6095 7.35962C14.6397 3.3101 11.3534 0 7.30417 0C3.30223 0 0.0306679 3.24105 0.000245952 7.25005C-0.0243322 10.5559 1.79492 12.4716 4.67263 16.1747C1.80984 16.6025 0.000245952 17.6774 0.000245952 18.9922C0.000245952 19.873 0.814333 20.6633 2.29259 21.2176C3.63807 21.7221 5.41814 22 7.30486 22C9.19158 22 10.9716 21.7221 12.3171 21.2176C13.7954 20.6632 14.6095 19.8729 14.6095 18.9922C14.6095 17.6781 12.8016 16.6034 9.9413 16.1753Z" />
                              </svg>
                              Ta-134/A, NY 11110, USA
                            </li>
                          </ul>
                        </div>
                        <div className="offcanvas-social">
                          <a href="#"><svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg></a>
                          <a href="#"><svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
                          <a href="#"><svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" /></svg></a>
                          <a href="#"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg></a>
                        </div>
                        <div className="offcanvas-cta">
                          <Link href="/contact" className="rs-button style-default text-anim-flip-top w-full" style={{ height: 50 }}>
                            <span className="button-text" data-text="Get In Touch">Get In Touch</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Header Row - Ticker + Tags */}
        <div className="header-bottom">
          <div className="nerio-container">
            <div className="header-bottom-inner">
              {/* Breaking News Ticker */}
              <div className="fpg-post-ticker">
                <div className="fpg-ticker-top">
                  <span className="fpg-popup-circle" />
                  <p className="fpg-ticker-label">Live News</p>
                </div>
                <div className="fpg-ticker-content">
                  {tickerNews.map((news, i) => (
                    <p key={i} className={`fpg-ticker-title ${i === activeTicker ? "is-active" : ""}`}>
                      <Link href="#">{news}</Link>
                    </p>
                  ))}
                </div>
              </div>

              {/* Tag Cloud with Scroll Arrows */}
              <div className="tag-cloud-wrapper">
                <div className="tag-cloud-overflow">
                  <div
                    className="tag-cloud-track"
                    ref={tagTrackRef}
                    style={{ transform: `translateX(-${tagOffset}px)`, transition: "transform 0.4s ease" }}
                  >
                    {tags.map((tag, i) => (
                      <Link key={i} href={`/tag/${tag.toLowerCase()}`} className="tag-cloud-link">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="tag-cloud-arrows">
                  <button
                    aria-label="Previous tags"
                    onClick={() => slideTags("prev")}
                    disabled={!canGoPrev}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    aria-label="Next tags"
                    onClick={() => slideTags("next")}
                    disabled={!canGoNext}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Header */}
        <div className="header-sticky-bar" style={{
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 999,
          transform: "translateY(-120%)",
          transition: "0.6s cubic-bezier(0.24, 0.74, 0.58, 1)",
          visibility: "hidden",
          top: 0,
        }}>
          <div className="header-top" style={{ backgroundColor: "var(--secondaryColor)", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            <div className="nerio-container">
              <div className="header-top-inner" style={{ minHeight: 70 }}>
                <Link href="/" className="rstb-site-logo">
                  {/* <Image
                    src="/assets/images/logo.png"
                    alt="Travel News"
                    width={150}
                    height={35}
                    style={{ height: 35, width: "auto" }}
                    priority
                  /> */}
                  <h2 className="text-xxl text-white font-bold ml-0">
                    <span className="text-[#0073FF]">Cockpit</span>
                    <span className="text-white">.</span>
                    <span className="text-white" style={{ marginLeft: '-0.40rem' }}>Travel</span>
                  </h2>
                </Link>

                <nav className="rstb-nav-menu nav-breakpoint-lg">
                  <ul className="primary-menu">
                    {navItems.map((item) => (
                      <li
                        key={item.label}
                        className={`menu-item ${item.hasMegaMenu ? "menu-item-has-mega-menu" : ""} ${item.hasSubMenu ? "menu-item-has-children" : ""}`}
                      >
                        <Link
                          href={item.href || "#"}
                          className="menu-item-link"
                          onClick={(e) => {
                            if (item.hasMegaMenu || item.hasSubMenu) e.preventDefault();
                          }}
                        >
                          <span className="menu-item-text">{item.label}</span>
                          {(item.hasMegaMenu || item.hasSubMenu) && (
                            <span className="sub-menu-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                              </svg>
                            </span>
                          )}
                        </Link>

                        {item.hasMegaMenu && item.children && (
                          <div className="mega-menu">
                            <div className="mega-menu-grid">
                              <div className="mega-menu-item">
                                <div className="mega-menu-item-title">{item.label}</div>
                                {item.children.slice(0, 3).map((child) => (
                                  <Link key={child.label} href={child.href} className="mega-menu-item-link">{child.label}</Link>
                                ))}
                              </div>
                              <div className="mega-menu-item">
                                <div className="mega-menu-item-title">Latest</div>
                                {item.children.slice(3).map((child) => (
                                  <Link key={child.label} href={child.href} className="mega-menu-item-link">{child.label}</Link>
                                ))}
                              </div>
                              <div className="mega-menu-item">
                                <div className="mega-menu-item-title">Popular</div>
                                {item.children.slice(0, 2).map((child) => (
                                  <Link key={child.label} href={child.href} className="mega-menu-item-link">{child.label}</Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {item.hasSubMenu && item.children && (
                          <ul className="sub-menu">
                            {item.children.map((child) => (
                              <li key={child.label} className={`menu-item ${child.hasSubMenu ? "menu-item-has-children" : ""}`}>
                                <Link
                                  href={child.href}
                                  className="menu-item-link"
                                  onClick={(e) => {
                                    if (child.hasSubMenu) e.preventDefault();
                                  }}
                                >
                                  <span className="menu-item-text">{child.label}</span>
                                  {child.hasSubMenu && (
                                    <span className="sub-menu-icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                                      </svg>
                                    </span>
                                  )}
                                </Link>
                                {child.hasSubMenu && child.children && (
                                  <ul className="sub-menu">
                                    {child.children.map((grandchild) => (
                                      <li key={grandchild.label} className="menu-item">
                                        <Link href={grandchild.href} className="menu-item-link">
                                          <span className="menu-item-text">{grandchild.label}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Menu Toggler */}
                  <div className="menu-toggler-wrap">
                    <button
                      className={`menu-toggler ${mobileOpen ? "panel-open" : ""}`}
                      onClick={() => setMobileOpen(!mobileOpen)}
                      aria-label="Toggle menu"
                    >
                      <span className="open-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
                          <path d="M6 1.8001C6 1.13738 6.53728 0.600098 7.2 0.600098H22.8C23.4627 0.600098 24 1.13738 24 1.8001C24 2.46282 23.4627 3.0001 22.8 3.0001H7.2C6.53728 3.0001 6 2.46277 6 1.8001ZM22.8 7.8001H1.2C0.537281 7.8001 0 8.33743 0 9.0001C0 9.66282 0.537281 10.2001 1.2 10.2001H22.8C23.4627 10.2001 24 9.66282 24 9.0001C24 8.33743 23.4627 7.8001 22.8 7.8001ZM22.8 15.0001H12C11.3373 15.0001 10.8 15.5374 10.8 16.2001C10.8 16.8628 11.3373 17.4001 12 17.4001H22.8C23.4627 17.4001 24 16.8628 24 16.2001C24 15.5374 23.4627 15.0001 22.8 15.0001Z" />
                        </svg>
                      </span>
                      <span className="close-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </nav>

                <div className="flex items-center gap-3 header-actions-desktop">
                  <Link href="/login" className="rs-button user-btn">
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z" />
                    </svg>
                  </Link>

                  <Link href="/register" className="rs-button style-default text-anim-flip-top hidden lg:inline-flex" style={{ height: 50, padding: "0 25px" }}>
                    <span className="button-text" data-text="Sign Up">Sign Up</span>
                  </Link>

                  <div className="rstb-mini-search">
                    <button className="search-btn" aria-label="Search">
                      <span className="open-icon">
                        <svg viewBox="0 0 612.01 612.01" xmlns="http://www.w3.org/2000/svg">
                          <path d="M606.209 578.714 448.198 423.228C489.576 378.272 515 318.817 515 253.393 514.98 113.439 399.704 0 257.493 0S.006 113.439.006 253.393s115.276 253.393 257.487 253.393c61.445 0 117.801-21.253 162.068-56.586l158.624 156.099c7.729 7.614 20.277 7.614 28.006 0a19.291 19.291 0 0 0 .018-27.585zM257.493 467.8c-120.326 0-217.869-95.993-217.869-214.407S137.167 38.986 257.493 38.986c120.327 0 217.869 95.993 217.869 214.407S377.82 467.8 257.493 467.8z" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  <div className="rstb-offcanvas-wrap hidden lg:block">
                    <div className="offcanvas-toggle-wrap">
                      <button className="offcanvas-toggle" onClick={() => setOffcanvasOpen(!offcanvasOpen)} aria-label="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
                          <path d="M6 1.8001C6 1.13738 6.53728 0.600098 7.2 0.600098H22.8C23.4627 0.600098 24 1.13738 24 1.8001C24 2.46282 23.4627 3.0001 22.8 3.0001H7.2C6.53728 3.0001 6 2.46277 6 1.8001ZM22.8 7.8001H1.2C0.537281 7.8001 0 8.33743 0 9.0001C0 9.66282 0.537281 10.2001 1.2 10.2001H22.8C23.4627 10.2001 24 9.66282 24 9.0001C24 8.33743 23.4627 7.8001 22.8 7.8001ZM22.8 15.0001H12C11.3373 15.0001 10.8 15.5374 10.8 16.2001C10.8 16.8628 11.3373 17.4001 12 17.4001H22.8C23.4627 17.4001 24 16.8628 24 16.2001C24 15.5374 23.4627 15.0001 22.8 15.0001Z" />
                        </svg>
                      </button>
                    </div>
                    <div className={`rstb-offcanvas-panel ${offcanvasOpen ? "show-offcanvas" : ""}`}>
                      <div className="offcanvas-overly" onClick={() => setOffcanvasOpen(false)} />
                      <div className="offcanvas-container">
                        <button className="offcanvas-close" onClick={() => setOffcanvasOpen(false)}>
                          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 512a25 25 0 0 1-17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462A24.93 24.93 0 0 1 25 512z" />
                            <path d="M487 512a24.93 24.93 0 0 1-17.68-7.32l-462-462A25 25 0 0 1 42.68 7.32l462 462A25 25 0 0 1 487 512z" />
                          </svg>
                        </button>
                        <div className="offcanvas-content" style={{ padding: "80px 50px 50px" }}>
                          <div className="offcanvas-logo">
                            <Link href="/">
                              <h2 className="text-xxl text-white font-bold ml-0">
                                <span className="text-[#0073FF]">Cockpit</span>
                                <span className="text-white">.</span>
                                <span className="text-white" style={{ marginLeft: '-0.40rem' }}>Travel</span>
                              </h2>
                              {/* <Image src="/assets/images/logo.png" alt="Cockpit Travel" width={180} height={35} style={{ height: 35, width: "auto" }} /> */}
                            </Link>
                          </div>
                          <p className="offcanvas-description">
                            Your trusted partner for finding the best flight deals, hotel bookings, and travel inspiration worldwide.
                          </p>
                          <div className="offcanvas-gallery">
                            <a href="/category/flights"><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop" alt="Beach Paradise" width={150} height={150} /></a>
                            <a href="/category/hotels"><img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=150&h=150&fit=crop" alt="Tropical Resort" width={150} height={150} /></a>
                            <a href="/category/destinations"><img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&h=150&fit=crop" alt="Mountain Lake" width={150} height={150} /></a>
                            <a href="/category/travel-intelligence"><img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&h=150&fit=crop" alt="Road Trip" width={150} height={150} /></a>
                            <a href="/category/flights"><img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=150&h=150&fit=crop" alt="Ancient Temple" width={150} height={150} /></a>
                            <a href="/category/hotels"><img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop" alt="Travel Backpack" width={150} height={150} /></a>
                          </div>
                          <div className="offcanvas-contact">
                            <h4>Quick Contact:</h4>
                            <ul className="offcanvas-contact-list">
                              <li>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M15.7918 12.3893C15.3823 11.9629 14.8884 11.735 14.365 11.735C13.8458 11.735 13.3477 11.9587 12.9214 12.3851L11.5875 13.7147C11.4778 13.6556 11.368 13.6007 11.2625 13.5459C11.1105 13.4699 10.967 13.3981 10.8446 13.3222C9.59513 12.5286 8.45964 11.4944 7.37059 10.1563C6.84295 9.48936 6.48837 8.92795 6.23088 8.3581C6.57702 8.04151 6.89782 7.71226 7.21019 7.39568C7.32838 7.27748 7.44657 7.15507 7.56476 7.03688C8.4512 6.15044 8.4512 5.00229 7.56476 4.11585L6.41239 2.96348C6.28154 2.83263 6.14646 2.69755 6.01983 2.56248C5.76656 2.30077 5.50063 2.03061 5.22625 1.77734C4.8168 1.37211 4.32715 1.15684 3.81217 1.15684C3.29719 1.15684 2.7991 1.37211 2.37698 1.77734C1.66708 2.48724 1.23631 3.48681 1.16476 4.56273C1.04168 6.41458 1.72898 8.29236 2.87468 10.1563C4.31603 12.5111 6.1661 14.5384 8.35842 16.1697C10.3752 17.6807 12.7096 18.8484 15.2008 19.5891C15.3488 19.6335 15.5012 19.6625 15.6545 19.6877C16.138 19.7664 16.6405 19.7821 17.125 19.6973C18.2752 19.4957 19.3085 18.9206 20.0455 18.0807C20.7825 17.2409 21.1756 16.1919 21.1489 15.1138C21.1244 14.1469 20.7299 13.2298 20.0483 12.5278L15.7918 12.3893Z" />
                                </svg>
                                +81112522552
                              </li>
                              <li>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
                                  <path d="M21.8667 0H5.33333C4.16 0 3.2 1.10769 3.2 2.46154V3.38462C3.2 3.72308 3.44 4 3.73333 4C4.02667 4 4.26667 3.72308 4.26667 3.38462V2.46154C4.26667 2.33846 4.29333 2.21538 4.32 2.09231L10.2933 8L4.32 13.9077C4.29333 13.7846 4.26667 13.6615 4.26667 13.5385V12.6154C4.26667 12.2769 4.02667 12 3.73333 12C3.44 12 3.2 12.2769 3.2 12.6154V13.5385C3.2 14.8923 4.16 16 5.33333 16H21.8667C23.04 16 24 14.8923 24 13.5385V2.46154C24 1.10769 23.04 0 21.8667 0Z" />
                                </svg>
                                info@cockpit.travel
                              </li>
                              <li>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 22">
                                  <path d="M7.34697 1.71897C7.10935 1.71725 6.91556 1.90846 6.91385 2.14565C6.91213 2.38284 7.10291 2.57663 7.34053 2.57835C7.57771 2.58006 7.7715 2.38928 7.77322 2.15209C7.77494 1.91491 7.58416 1.72112 7.34697 1.71897Z" />
                                  <path d="M9.9413 16.1753C12.7993 12.4965 14.5854 10.5782 14.6095 7.35962C14.6397 3.3101 11.3534 0 7.30417 0C3.30223 0 0.0306679 3.24105 0.000245952 7.25005C-0.0243322 10.5559 1.79492 12.4716 4.67263 16.1747C1.80984 16.6025 0.000245952 17.6774 0.000245952 18.9922C0.000245952 19.873 0.814333 20.6633 2.29259 21.2176C3.63807 21.7221 5.41814 22 7.30486 22C9.19158 22 10.9716 21.7221 12.3171 21.2176C13.7954 20.6632 14.6095 19.8729 14.6095 18.9922C14.6095 17.6781 12.8016 16.6034 9.9413 16.1753Z" />
                                </svg>
                                Ta-134/A, NY 11110, USA
                              </li>
                            </ul>
                          </div>
                          <div className="offcanvas-social">
                            <a href="#"><svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg></a>
                            <a href="#"><svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
                            <a href="#"><svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" /></svg></a>
                            <a href="#"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg></a>
                          </div>
                          <div className="offcanvas-cta">
                            <Link href="/contact" className="rs-button style-default text-anim-flip-top w-full" style={{ height: 50 }}>
                              <span className="button-text" data-text="Get In Touch">Get In Touch</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
