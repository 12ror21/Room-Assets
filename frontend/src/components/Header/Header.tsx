import clsx from "clsx";
import s from "./Header.module.css";
import type { NavItem } from "./header.types";
import { DEFAULT_NAV } from "./header.config";

export interface HeaderProps {
  navItems?: NavItem[];
  activeNavId: string;
  onNavigate: (id: string) => void;
}

export function Header({
  navItems = DEFAULT_NAV,
  activeNavId,
  onNavigate,
}: HeaderProps) {
  return (
    <header className={s.header}>
      <div className={s.row}>

        {/* Левая зона: логотип + название приложения */}
        <div className={s.brand}>
          <div className={s.logoBox} aria-hidden>
            <span className={s.logoIc}>🏢</span>
          </div>
          <div className={s.app}>Room Booking</div>
        </div>

        {/* Центральная зона: навигация по вкладкам */}
        <nav className={s.nav} aria-label="Основная навигация">
          {navItems.map((item) => {
            const active = item.id === activeNavId;

            return (
              <button
                key={item.id}
                type="button"
                className={clsx(s.tab, active && s.tabActive)}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                title={item.label}
              >
                <span className={s.tabIc}>📋</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={s.spacer} />
      </div>
    </header>
  );
}