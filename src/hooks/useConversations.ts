import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  conversation_id: string;
  type: 'user' | 'mochi';
  content: string;
  created_at: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id?: string; // Make nullable for guest users
}

export const useConversations = (guestId?: string) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createConversation = async (title = 'New Chat with Mochi') => {
    try {
      // Use authenticated user ID if available, otherwise null for guest
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ 
          user_id: user?.id || null, 
          title 
        }])
        .select()
        .maybeSingle();

      if (error || !data) {
        console.error('Error creating conversation:', error);
        return null;
      }

      setConversations(prev => [data, ...prev]);
      setCurrentConversationId(data.id);
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const saveMessage = async (conversationId: string, type: 'user' | 'mochi', content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ conversation_id: conversationId, type, content }])
        .select()
        .maybeSingle();

      if (error || !data) {
        console.error('Error saving message:', error);
        return null;
      }

      setMessages(prev => [...prev, { 
        ...data, 
        type: data.type as 'user' | 'mochi' 
      } as Message]);
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages((data || []).map(item => ({
        ...item,
        type: item.type as 'user' | 'mochi'
      } as Message)));
    }
    setLoading(false);
  };

  const loadConversations = async () => {
    // Only load conversations if user is authenticated
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  return {
    conversations,
    messages,
    currentConversationId,
    loading,
    createConversation,
    saveMessage,
    setCurrentConversationId,
    loadMessages,
    loadConversations
  };
};