import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  conversation_id: string;
  type: 'user' | 'dory';
  content: string;
  created_at: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useConversations = (userId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createConversation = async (title = 'New Chat with Dory') => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert([{ user_id: userId, title }])
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    setConversations(prev => [data, ...prev]);
    setCurrentConversationId(data.id);
    return data;
  };

  const saveMessage = async (conversationId: string, type: 'user' | 'dory', content: string) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id: conversationId, type, content }])
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return null;
    }

    setMessages(prev => [...prev, { 
      ...data, 
      type: data.type as 'user' | 'dory' 
    } as Message]);
    return data;
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
        type: item.type as 'user' | 'dory'
      } as Message)));
    }
    setLoading(false);
  };

  const loadConversations = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

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