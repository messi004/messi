import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "../../../shared/schema.js";
import { useCreateMessage } from "@/hooks/use-contact";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

import {
  FaWhatsapp,
  FaTelegram,
  FaGithub,
  FaEnvelope
} from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function usePageTracking() {
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSlug: 'contact' }) }).catch(() => { });
  }, []);
}


export default function Contact() {
  usePageTracking();
  const { toast } = useToast();
  const createMessage = useCreateMessage();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  async function onSubmit(data: InsertContactMessage) {
    try {
      await createMessage.mutateAsync(data);
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }

  const socialLinks = [
    { icon: <FaWhatsapp className="w-6 h-6" />, label: "WhatsApp", value: "+91 8387041436", href: "https://wa.me/918387041436" },
    { icon: <FaTelegram className="w-6 h-6" />, label: "Telegram", value: "@Messi0004", href: "https://t.me/Messi0004" },
    { icon: <FaGithub className="w-6 h-6" />, label: "GitHub", value: "messi004", href: "https://github.com/messi004" },
    { icon: <SiHuggingface className="w-6 h-6" />, label: "HuggingFace", value: "@Messi004", href: "https://huggingface.co/Messi004" },
    { icon: <FaEnvelope className="w-6 h-6" />, label: "Email", value: "mksheela@duck.com", href: "mailto:mksheela@duck.com" },
  ];

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <Navigation />

      <main className="pt-32 pb-24 container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
                Let's Work <span className="text-gradient">Together</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
                Have a project in mind or just want to say hi? I'm always open to discussing new projects,
                creative ideas or opportunities to be part of your visions.
              </p>
            </div>

            <div className="grid gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-5 rounded-2xl glass-card relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(30,190,255,0.4)] relative z-10">
                    {link.icon}
                  </div>
                  <div className="relative z-10">
                    <p className="font-semibold text-white text-lg">{link.label}</p>
                    <p className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">{link.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card p-8 lg:p-10 rounded-2xl border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10" />

              <CardContent className="p-0 relative z-10">
                <h2 className="text-3xl font-bold font-heading mb-8 text-white">Send a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="bg-white/5 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30 h-12 rounded-xl text-white placeholder:text-white/30 backdrop-blur-md transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              className="bg-white/5 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30 h-12 rounded-xl text-white placeholder:text-white/30 backdrop-blur-md transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell me about your project..."
                              className="bg-white/5 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30 min-h-[160px] rounded-xl text-white placeholder:text-white/30 backdrop-blur-md resize-y transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-background rounded-xl shadow-[0_0_20px_rgba(30,190,255,0.3)] hover:shadow-[0_0_25px_rgba(30,190,255,0.5)] transition-all hover:-translate-y-1"
                      disabled={createMessage.isPending}
                    >
                      {createMessage.isPending ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
