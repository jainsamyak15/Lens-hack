"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/utils/supabase';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function StoryRoom() {
  const { id } = useParams();
  const { address } = useAccount();
  const [story, setStory] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [contribution, setContribution] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchStoryData = async () => {
      const { data: storyData } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (storyData) {
        setStory(storyData);
        setTimeLeft(storyData.turn_duration_seconds);
      }

      const { data: contributionsData } = await supabase
        .from('story_contributions')
        .select('*, users(username)')
        .eq('story_id', id)
        .order('turn_number', { ascending: true });

      if (contributionsData) {
        setContributions(contributionsData);
        setCurrentTurn(contributionsData.length);
      }

      const { data: participantsData } = await supabase
        .from('story_participants')
        .select('*, users(username)')
        .eq('story_id', id);

      if (participantsData) {
        setParticipants(participantsData);
      }
    };

    fetchStoryData();

    // Set up real-time subscriptions
    const contributionsSubscription = supabase
      .channel('contributions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'story_contributions',
        filter: `story_id=eq.${id}`,
      }, payload => {
        setContributions(current => [...current, payload.new]);
        setCurrentTurn(current => current + 1);
      })
      .subscribe();

    return () => {
      contributionsSubscription.unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(current => current - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmitContribution = async () => {
    if (!address || !contribution.trim()) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!userData) {
        toast.error('User not found');
        return;
      }

      const { error } = await supabase
        .from('story_contributions')
        .insert({
          story_id: id,
          user_id: userData.id,
          content: contribution.trim(),
          turn_number: currentTurn
        });

      if (error) throw error;

      setContribution('');
      toast.success('Contribution added!');
    } catch (error) {
      toast.error('Failed to add contribution');
      console.error(error);
    }
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-4">
            {contributions.map((contribution, index) => (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert max-w-none"
              >
                <p>
                  <span className="text-muted-foreground">
                    {contribution.users?.username || 'Anonymous'}:
                  </span>{' '}
                  {contribution.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <Textarea
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder="Add to the story..."
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmitContribution}
              className="w-full"
              disabled={timeLeft === 0}
            >
              Submit ({timeLeft}s)
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Participants</h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{participant.users?.username || 'Anonymous'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Story Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Turn Duration: {story.turn_duration_seconds}s</p>
              <p>Max Participants: {story.max_participants}</p>
              <p>Status: {story.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}