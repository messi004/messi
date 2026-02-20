import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

function usePageTracking() {
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSlug: 'skills' }) }).catch(() => { });
  }, []);
}

const skills = [
  {
    category: "Artificial Intelligence",
    items: ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "OpenAI API"]
  },
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS", "Bash"]
  },
  {
    category: "Web Development",
    items: ["React", "Node.js", "Express", "Next.js", "Tailwind CSS", "PostgreSQL", "SQLite"]
  },
  {
    category: "Tools & DevOps",
    items: ["Git", "Docker", "Linux", "AWS", "Nginx", "GitHub Actions"]
  }
];

export default function Skills() {
  usePageTracking();

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <Navigation />

      <main className="pt-32 pb-24 container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Technical <span className="text-gradient">Skills</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light">
              A comprehensive overview of my technical expertise, tools, and platforms I work with daily to build scalable solutions.
            </p>
          </motion.div>
        </div>

        <div className="space-y-16 max-w-4xl mx-auto">
          {skills.map((group, index) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 rounded-2xl relative border-white/5"
            >
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-8 flex items-center gap-4 text-white">
                <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(30,190,255,0.5)]" />
                {group.category}
              </h2>
              <div className="flex flex-wrap gap-4">
                {group.items.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-base font-medium px-5 py-2.5 bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all duration-300 cursor-default hover:shadow-[0_0_15px_rgba(30,190,255,0.2)] rounded-xl"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
