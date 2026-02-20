import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Shield, Bot } from "lucide-react";

export default function Home() {
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSlug: 'home' }) }).catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-[10%] right-[20%] w-72 h-72 bg-secondary/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[30%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium tracking-wide text-foreground/80 uppercase">Available for new projects</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-[1.1] tracking-tight mb-6">
              Full Stack Developer <br />
              <span className="text-gradient">Automation & Security</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
          >
            I build robust web applications, sophisticated automation bots, and secure systems.
            Passionate about code quality and innovative solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-8"
          >
            <Link href="/projects">
              <Button size="lg" className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-background font-semibold rounded-xl shadow-[0_0_20px_rgba(30,190,255,0.4)] transition-all hover:scale-105">
                View Projects <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border border-white/10 hover:border-white/30 hover:bg-white/5 bg-transparent text-white rounded-xl transition-all">
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gradient-subtle">What I Do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Specialized in modern web technologies, automated workflows, and comprehensive security audits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code2 className="w-8 h-8 text-primary" />}
              title="Full Stack Dev"
              description="Modern web applications built with React, Node.js, and cutting-edge scalable frameworks."
              delay={0.1}
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-secondary" />}
              title="Automation"
              description="Custom intelligent bots for Telegram, WhatsApp, and Instagram to automate workflows."
              delay={0.2}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-red-400" />}
              title="Ethical Hacking"
              description="Security audits and vulnerability assessments to keep your digital systems safe and secure."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode, title: string, description: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-2xl glass-card relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-4 -translate-y-4 scale-150">
        {icon}
      </div>
      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-heading mb-3 text-white relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}
