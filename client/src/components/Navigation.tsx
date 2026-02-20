import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-heading font-bold tracking-tighter cursor-pointer flex items-center gap-2">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-xl flex items-center justify-center">M</span>
              Messi<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <div key={link.href} className="relative px-3 py-2">
                <Link href={link.href}>
                  <span className={`relative z-10 text-sm font-medium transition-colors hover:text-white cursor-pointer ${isActive(link.href) ? "text-white" : "text-muted-foreground"
                    }`}>
                    {link.label}
                  </span>
                </Link>
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            ))}
            <div className="ml-4 pl-4 border-l border-white/10">
              <Link href="/contact">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-background font-semibold px-6 shadow-[0_0_15px_rgba(30,190,255,0.3)]">
                  Hire Me
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-2xl shadow-2xl absolute top-full left-0 right-0"
          >
            <nav className="flex flex-col p-6 gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block text-lg font-medium p-3 rounded-xl transition-all ${isActive(link.href)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/5">
                <Link href="/contact">
                  <Button className="w-full h-12 text-lg font-semibold bg-primary text-background" onClick={() => setIsOpen(false)}>
                    Hire Me
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
