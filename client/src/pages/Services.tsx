import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Laptop, Database, Bot, Cog, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

function usePageTracking() {
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSlug: 'services' }) }).catch(() => { });
  }, []);
}

const services = [
  {
    icon: <Laptop className="w-12 h-12 text-blue-500" />,
    title: "Web & App Development",
    description: "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js. Responsive, fast, and SEO-friendly."
  },
  {
    icon: <Database className="w-12 h-12 text-purple-500" />,
    title: "Software Development",
    description: "Desktop applications and backend systems tailored to your business needs. Scalable architecture and clean code."
  },
  {
    icon: <Bot className="w-12 h-12 text-green-500" />,
    title: "Bot Development",
    description: "Automated bots for Telegram, WhatsApp, and Instagram. Handle customer support, content distribution, and task automation effortlessly."
  },
  {
    icon: <Cog className="w-12 h-12 text-orange-500" />,
    title: "Automation Tools",
    description: "Scripts and tools to automate repetitive tasks, data scraping, and workflow optimization. Save time and reduce errors."
  },
  {
    icon: <ShieldAlert className="w-12 h-12 text-red-500" />,
    title: "Ethical Hacking",
    description: "Security assessments, penetration testing, and vulnerability analysis to identify and fix security weaknesses in your systems."
  }
];

export default function Services() {
  usePageTracking();

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <Navigation />

      <main className="pt-32 pb-24 container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Services & <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light">
              I provide comprehensive technical solutions ranging from robust full-stack development
              to intricate security auditing and automated workflows.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full relative overflow-hidden glass-card p-8 group border-white/5 rounded-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500 transform translate-x-4 -translate-y-4 scale-150">
                  {service.icon}
                </div>

                <div className="relative z-10">
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold font-heading mb-4 text-white group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </div>

                <CardContent className="p-0 relative z-10 mt-2">
                  <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
