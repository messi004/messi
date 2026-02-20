import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/hooks/use-projects";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSlug: 'projects' }) }).catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      <Navigation />

      <main className="pt-32 pb-24 container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              <span className="text-gradient">Featured Projects</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light">
              A collection of my recent work in web development, automation, and security.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects found. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
