import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, BookHeart, HeartPulse, ShieldCheck, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'dashboard-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">MediChain+</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Secure, Smart, and Connected Healthcare
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              A blockchain-powered healthcare platform with IoT integration for
              real-time monitoring and AI-powered advice.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need for modern healthcare management.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-md transition-transform hover:scale-105">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Symptom Checker</h3>
                <p className="mt-2 text-muted-foreground">
                  Get preliminary advice on your symptoms from our AI assistant.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-md transition-transform hover:scale-105">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Vitals Monitoring</h3>
                <p className="mt-2 text-muted-foreground">
                  Track your vital signs in real-time with IoT device integration.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-md transition-transform hover:scale-105">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <BookHeart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">First-Aid Guides</h3>
                <p className="mt-2 text-muted-foreground">
                  Access easy-to-follow first-aid instructions for emergencies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-muted-foreground">
        © {new Date().getFullYear()} MediChain+. All rights reserved.
      </footer>
    </div>
  );
}
