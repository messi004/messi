import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  FileText, 
  Code, 
  Map, 
  Bot, 
  BarChart3, 
  Settings, 
  ArrowLeftRight,
  LogOut,
  Globe
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { label: "Messages", icon: MessageSquare, href: "/admin/messages" },
  { label: "Page SEO", icon: FileText, href: "/admin/page-seo" },
  { label: "Schema Markup", icon: Code, href: "/admin/schema" },
  { label: "Sitemap", icon: Map, href: "/admin/sitemap" },
  { label: "Robots.txt", icon: Bot, href: "/admin/robots" },
  { label: "Redirects", icon: ArrowLeftRight, href: "/admin/redirects" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Global SEO", icon: Globe, href: "/admin/global-seo" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold font-heading text-primary">Admin Panel</h1>
          <p className="text-xs text-muted-foreground mt-1">Messi Portfolio</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <h2 className="text-lg font-semibold font-heading">{title}</h2>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Globe size={14} /> View Site
            </Button>
          </Link>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

        <footer className="h-12 border-t border-border flex items-center justify-center px-6 bg-card">
          <p className="text-xs text-muted-foreground">Messi Portfolio Admin Panel - 2026</p>
        </footer>
      </main>
    </div>
  );
}
