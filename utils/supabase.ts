import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create or get user with wallet authentication
export const createOrGetUser = async (walletAddress: string) => {
  try {
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingUser) return existingUser;

    // Create new user if doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ wallet_address: walletAddress }])
      .select()
      .single();

    if (insertError) throw insertError;
    return newUser;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
};