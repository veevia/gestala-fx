import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ori", label: "Ori" },
  { href: "/poly", label: "Poly" },
  { href: "/wob", label: "Wob" },
];

export const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">GESTALA ({pageTitle})</div>
          <div className="hidden md:flex gap-8 text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`${location.pathname === link.href ? "text-blue-400" : "hover:text-blue-400"} transition`}>
                {link.label}
              </Link>
            ))}
          </div>
          {/* Hamburger Menu Button for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="z-[101] flex flex-col justify-around w-6 h-6">
              <span className="block w-full h-0.5 bg-white"></span>
              <span className="block w-full h-0.5 bg-white"></span>
              <span className="block w-full h-0.5 bg-white"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fly-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-black/90 backdrop-blur-lg z-[100] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-3xl font-bold ${
                location.pathname === link.href ? "text-blue-400" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {children}

      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-[120px] font-bold leading-none text-center md:text-9xl">Gestala</h2>
        </div>
      </footer>
    </div>
  );
};