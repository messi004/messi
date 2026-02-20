import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Services from "@/pages/Services";
import Skills from "@/pages/Skills";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/Login";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import PageSeoPage from "@/pages/admin/PageSeoPage";
import SchemaPage from "@/pages/admin/SchemaPage";
import SitemapPage from "@/pages/admin/SitemapPage";
import RobotsPage from "@/pages/admin/RobotsPage";
import RedirectsPage from "@/pages/admin/RedirectsPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import GlobalSeoPage from "@/pages/admin/GlobalSeoPage";
import SettingsPage from "@/pages/admin/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/services" component={Services} />
      <Route path="/skills" component={Skills} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={DashboardPage} />
      <Route path="/admin/dashboard" component={DashboardPage} />
      <Route path="/admin/projects" component={ProjectsPage} />
      <Route path="/admin/messages" component={MessagesPage} />
      <Route path="/admin/page-seo" component={PageSeoPage} />
      <Route path="/admin/schema" component={SchemaPage} />
      <Route path="/admin/sitemap" component={SitemapPage} />
      <Route path="/admin/robots" component={RobotsPage} />
      <Route path="/admin/redirects" component={RedirectsPage} />
      <Route path="/admin/analytics" component={AnalyticsPage} />
      <Route path="/admin/global-seo" component={GlobalSeoPage} />
      <Route path="/admin/settings" component={SettingsPage} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
