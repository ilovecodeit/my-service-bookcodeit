import { Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { name: '예약 현황', path: '/' },
    { name: '내 예약 목록', path: '/my-bookings' },
    { name: '자원 관리', path: '#' },
    { name: '사용 가이드', path: '#' },
  ];

  return (
    <header className="bg-white border-b border-outline-variant sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter text-primary">
          Bookcodeit
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors pb-1 ${
                location.pathname === item.path
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
