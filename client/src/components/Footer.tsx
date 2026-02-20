import { Link } from "wouter";
import { FaGithub, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { Mail } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Skills", href: "/skills" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/messi004", icon: FaGithub },
  { name: "Telegram", href: "https://t.me/Messi0004", icon: FaTelegram },
  { name: "WhatsApp", href: "https://wa.me/918387041436", icon: FaWhatsapp },
  { name: "HuggingFace", href: "https://huggingface.co/Messi004", icon: SiHuggingface },
  { name: "Email", href: "mailto:mksheela@duck.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-background/80 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <span className="bg-primary/20 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-lg">M</span>
              Messi<span className="text-primary">.</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Full Stack Developer specializing in intelligent automation, secure bot development, and comprehensive ethical hacking.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-heading text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-primary transition-colors hover:pl-2 duration-300 block"
                    data-testid={`footer-link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold font-heading text-white mb-6">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-primary/80 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(30,190,255,0.4)]"
                  data-testid={`footer-social-${social.name.toLowerCase()}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Messi. All rights reserved.
          </p>
          <p className="text-sm font-medium">
            <a href="https://messidev.in" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              messidev.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
