import { Link, useLocation } from 'wouter';
import { navItems } from '@/modules/module-config';

export function Navigation({ mobile = false }: { mobile?: boolean }) {
  const [location] = useLocation();

  return (
    <nav
      className={mobile ? 'mobile-nav' : 'flex flex-col gap-[3px]'}
      aria-label="Navigation principale"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className="nav-link"
            aria-current={active ? 'page' : undefined}
            data-testid={`link-nav-${item.path === '/' ? 'dashboard' : item.path.slice(1)}`}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
