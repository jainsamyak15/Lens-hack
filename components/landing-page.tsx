"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { PenLine, Users, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenLine className="h-6 w-6" />
            <span className="font-bold text-xl">StoryBuilder</span>
          </div>
          <ConnectKitButton />
        </div>
      </header>

      <main className="container pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-8 py-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Create Stories Together,{" "}
            <span className="text-primary">Word by Word</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[750px]">
            Join a community of creative writers and build amazing stories in
            real-time. Take turns, collaborate, and watch your imagination come to
            life.
          </p>
          <div className="flex gap-4">
            <Link href="/stories">
              <Button size="lg" className="h-12">
                Start Writing
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="h-12">
                Explore Stories
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card"
          >
            <Users className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Collaborative Writing</h3>
            <p className="text-muted-foreground">
              Write stories together in real-time with friends or join random
              sessions with writers worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card"
          >
            <Sparkles className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Timed Challenges</h3>
            <p className="text-muted-foreground">
              Race against the clock in timed writing sessions. Add words or
              sentences to create unexpected twists.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card"
          >
            <BookOpen className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Story Library</h3>
            <p className="text-muted-foreground">
              Browse a collection of completed stories, share your favorites, and
              get inspired by other writers.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 StoryBuilder. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}