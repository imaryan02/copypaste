import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeaderBar from './HeaderBar';
import TextSyncBox from './TextSyncBox';
import Footer from './Footer';

const PasteRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Handle connection status changes from TextSyncBox
  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  };

  // Initial connection status
  useEffect(() => {
    setConnectionStatus('connecting');
  }, []);

  const handleLeave = () => {
    navigate('/');
  };

  if (!id) {
    return <div>Error: Room ID not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar />
      <HeaderBar 
        roomId={id} 
        connectionStatus={connectionStatus}
        onLeave={handleLeave} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <TextSyncBox
            roomId={id}
            onConnectionChange={handleConnectionChange}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PasteRoom;
