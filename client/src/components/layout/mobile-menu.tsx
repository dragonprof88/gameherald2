import { Link } from "wouter";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
};

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-primary-950 border-t border-primary-900">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex flex-col space-y-3">
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <a 
                className="font-medium py-2 hover:text-primary transition-colors"
                onClick={onClose}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
