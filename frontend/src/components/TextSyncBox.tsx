import React, { useRef, useEffect, useState } from 'react';
import { Copy, Trash2, Users, Check, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TextSyncBoxProps {
  roomId: string;
  onConnectionChange?: (connected: boolean) => void;
}

const TextSyncBox: React.FC<TextSyncBoxProps> = ({
  roomId,
  onConnectionChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 300) + 'px';
    }
  }, [content]);

  // Fetch initial content or create new room
  useEffect(() => {
    const fetchOrCreateRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to fetch existing room
        const { data, error: fetchError } = await supabase
          .from('pastes')
          .select('*')
          .eq('room_id', roomId)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // Room doesn't exist, create it
          const { error: insertError } = await supabase
            .from('pastes')
            .insert({
              room_id: roomId,
              content: ''
            });

          if (insertError) {
            throw new Error(`Failed to create room: ${insertError.message}`);
          }

          setContent('');
        } else if (fetchError) {
          throw new Error(`Failed to fetch room: ${fetchError.message}`);
        } else if (data) {
          setContent(data.content || '');
        }

        setConnected(true);
        onConnectionChange?.(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to room';
        if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('dummy')) {
          setError('Demo mode: Real-time sync requires Supabase setup. Click "Connect to Supabase" to enable full functionality.');
        } else {
          setError(errorMessage);
        }
        setConnected(false);
        onConnectionChange?.(false);
        console.error('Room setup error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateRoom();
  }, [roomId, onConnectionChange]);

  // Set up real-time subscription
  useEffect(() => {
    if (!connected || loading) return;

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pastes',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newContent = payload.new.content as string;
          // Only update if content is different and user is not currently typing
          if (newContent !== content && !isTyping) {
            setContent(newContent);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnected(true);
          onConnectionChange?.(true);
        } else if (status === 'CHANNEL_ERROR') {
          setConnected(false);
          onConnectionChange?.(false);
          setError('Real-time connection failed');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, connected, loading, content, isTyping, onConnectionChange]);

  // Handle content changes with debounced updates
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsTyping(true);

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('pastes')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString()
          })
          .eq('room_id', roomId);

        if (error) {
          console.error('Failed to update content:', error);
          setError('Failed to sync content');
        }
      } catch (err) {
        console.error('Update error:', err);
        setError('Failed to sync content');
      } finally {
        setIsTyping(false);
      }
    }, 500); // 500ms debounce
  };

  const handleCopy = async () => {
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleClear = async () => {
    try {
      setContent('');
      const { error } = await supabase
        .from('pastes')
        .update({ 
          content: '',
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Failed to clear content:', error);
        setError('Failed to clear content');
      } else {
        setCleared(true);
        setTimeout(() => setCleared(false), 2000);
      }
    } catch (err) {
      console.error('Clear error:', err);
      setError('Failed to clear content');
    }
  };

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const characterCount = content.length;
  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const getConnectionStatus = () => {
    if (loading) {
      return {
        icon: <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
        text: 'Connecting...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-500'
      };
    }
    if (error) {
      return {
        icon: <AlertCircle size={16} className="text-red-500" />,
        text: 'Connection Error',
        color: 'text-red-600',
        bgColor: 'bg-red-500'
      };
    }
    if (connected) {
      return {
        icon: <Wifi size={16} className="text-green-500" />,
        text: 'Live Sync',
        color: 'text-green-600',
        bgColor: 'bg-green-500'
      };
    }
    return {
      icon: <WifiOff size={16} className="text-gray-500" />,
      text: 'Disconnected',
      color: 'text-gray-600',
      bgColor: 'bg-gray-500'
    };
  };

  const connectionStatus = getConnectionStatus();

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl shadow-xl p-8 animate-slide-up">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-medium">Connecting to room...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-2xl shadow-xl p-8 animate-slide-up">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl shadow-xl overflow-hidden animate-slide-up">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={`Start typing or paste your content here... ${connected ? 'Content syncs in real-time with everyone in the room.' : 'Connecting to sync...'}`}
          className="w-full px-6 py-6 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset border-none bg-transparent text-base leading-relaxed"
          style={{ 
            minHeight: '300px', 
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' 
          }}
        />
        
        {/* Connection status indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
            connected ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
            loading ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
            'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-white' : 'bg-white animate-pulse'}`} />
            {connectionStatus.text}
          </div>
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Syncing...
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-blue-500" />
              <span className="font-medium">Room {roomId}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>{characterCount.toLocaleString()} chars</span>
              <span>{wordCount.toLocaleString()} words</span>
              <span>{lineCount.toLocaleString()} lines</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              disabled={!content || !connected}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={handleClear}
              disabled={!content || !connected}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">{cleared ? 'Cleared!' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="sm:hidden mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>{characterCount.toLocaleString()} chars</span>
          <span>{wordCount.toLocaleString()} words</span>
          <span>{lineCount.toLocaleString()} lines</span>
        </div>
      </div>
    </div>
  );
};

export default TextSyncBox;
