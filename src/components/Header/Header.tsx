import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";

import "./styles.css";

export interface HeaderNavChildItem {
  label: string;
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
}

export interface HeaderNavItem {
  label: string;
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  children?: HeaderNavChildItem[];
}

export interface HeaderProps {
  brand?: ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  homeHref?: string;
  navItems: HeaderNavItem[];
  className?: string;
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m5.5 7.5 4.5 5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({
  brand,
  logoSrc,
  logoAlt = "Brand logo",
  homeHref = "/",
  navItems,
  className = "",
}: HeaderProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const classes = ["webable-header", className].filter(Boolean).join(" ");

  const renderedBrand = useMemo(() => {
    if (brand) {
      return brand;
    }

    if (logoSrc) {
      return <img src={logoSrc} alt={logoAlt} className="webable-header__logo-image" />;
    }

    return <span className="webable-header__brand-text">Webable</span>;
  }, [brand, logoAlt, logoSrc]);

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(index);
    }

    if (event.key === "Escape") {
      setOpenIndex(null);
    }
  };

  return (
    <header className={classes}>
      <div className="webable-header__inner">
        <a className="webable-header__brand" href={homeHref} aria-label="Go to homepage">
          {renderedBrand}
        </a>

        <nav className="webable-header__nav" aria-label="Primary navigation">
          <ul className="webable-header__list">
            {navItems.map((item, index) => {
              const hasChildren = Boolean(item.children?.length);
              const menuId = `webable-header-menu-${index}`;
              const isOpen = openIndex === index;

              return (
                <li
                  key={`${item.label}-${index}`}
                  className="webable-header__item"
                  onMouseEnter={() => hasChildren && setOpenIndex(index)}
                  onMouseLeave={() => hasChildren && setOpenIndex(null)}
                >
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        className="webable-header__trigger"
                        aria-expanded={isOpen}
                        aria-controls={menuId}
                        onClick={() => handleToggle(index)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                      >
                        <span>{item.label}</span>
                        <span className="webable-header__chevron">
                          <ChevronDownIcon />
                        </span>
                      </button>

                      <ul
                        id={menuId}
                        className={`webable-header__menu ${isOpen ? "webable-header__menu--open" : ""}`}
                        role="menu"
                      >
                        {item.children?.map((child) => (
                          <li key={`${item.label}-${child.label}`} role="none">
                            <a
                              className="webable-header__menu-link"
                              href={child.href}
                              target={child.target}
                              rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
                              role="menuitem"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a
                      className="webable-header__link"
                      href={item.href ?? "#"}
                      target={item.target}
                      rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
