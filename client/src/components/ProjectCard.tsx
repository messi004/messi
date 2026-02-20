import { Project } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full relative group"
    >
      {/* Decorative background glow that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <Card className="h-full flex flex-col overflow-hidden glass-card border-white/5 rounded-2xl relative z-10">
        <div className="relative aspect-video overflow-hidden bg-background">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300 flex items-center justify-center">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white backdrop-blur-md rounded-xl">
                Visit Project <ExternalLink size={16} />
              </Button>
            </a>
          </div>
        </div>

        <CardHeader className="pt-6 relative z-10">
          <CardTitle className="text-2xl font-bold font-heading text-white group-hover:text-primary transition-colors">{project.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow relative z-10">
          <p className="text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </CardContent>

        <CardFooter className="pt-4 pb-6 relative z-10">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl transition-all">
              View Details
            </Button>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
