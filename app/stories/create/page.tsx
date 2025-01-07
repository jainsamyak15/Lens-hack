"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { supabase, createOrGetUser } from '@/utils/supabase';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function CreateStory() {
  const router = useRouter();
  const { address } = useAccount();
  const [title, setTitle] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [turnDuration, setTurnDuration] = useState(60);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);

    try {
      // Create or get user
      const user = await createOrGetUser(address);

      // Create story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert({
          title,
          max_participants: maxParticipants,
          turn_duration_seconds: turnDuration,
          created_by: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (storyError) throw storyError;

      // Join as first participant
      const { error: participantError } = await supabase
        .from('story_participants')
        .insert({
          story_id: story.id,
          user_id: user.id
        });

      if (participantError) throw participantError;

      toast.success('Story created successfully!');
      router.push(`/stories/${story.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create story');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Story</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your story"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Participants ({maxParticipants})</Label>
          <Slider
            value={[maxParticipants]}
            onValueChange={(value) => setMaxParticipants(value[0])}
            min={2}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Turn Duration ({turnDuration} seconds)</Label>
          <Slider
            value={[turnDuration]}
            onValueChange={(value) => setTurnDuration(value[0])}
            min={30}
            max={180}
            step={30}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isCreating || !address}
        >
          {isCreating ? 'Creating...' : 'Create Story'}
        </Button>
      </form>
    </div>
  );
}