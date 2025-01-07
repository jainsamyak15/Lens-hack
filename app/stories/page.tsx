"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase, createOrGetUser } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const initializeUser = async () => {
      if (address) {
        try {
          await createOrGetUser(address);
        } catch (error) {
          console.error('Failed to initialize user:', error);
        }
      }
    };

    initializeUser();
  }, [address]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select(`
            *,
            users (username),
            story_participants (count),
            story_contributions (count)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setStories(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Stories</h1>
        <Link href="/stories/create">
          <Button>Create Story</Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No stories yet</h2>
          <p className="text-muted-foreground mb-8">Be the first to create a story!</p>
          <Link href="/stories/create">
            <Button>Create Your First Story</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/stories/${story.id}`}>
                <div className="bg-card rounded-lg p-6 space-y-4 hover:bg-accent transition-colors">
                  <h2 className="text-xl font-semibold">{story.title}</h2>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{story.story_participants?.count || 0}/{story.max_participants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{story.story_contributions?.count || 0} contributions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{story.turn_duration_seconds}s/turn</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Created by</span>
                    <span>{story.users?.username || 'Anonymous'}</span>
                  </div>
                  <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {story.status}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}