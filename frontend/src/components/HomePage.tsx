import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Plus, ArrowRight, Globe } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const HomePage: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsCreating(false);
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    navigate(`/room/${roomId.trim().toUpperCase()}`);
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  const steps = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: "Create or Join a Room",
      description: "Generate a unique room ID or enter an existing one"
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Paste your content",
      description: "Share text, code, or notes in the secure room"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Instantly view it from another device",
      description: "Real-time sync across all connected devices"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
              CopyPaste
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-medium">
              Secure. Real-time. No hassle.
            </p>
          </div>

          {/* How it works - directly below hero */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="animate-slide-up glass-effect rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Instruction Block */}
          <div className="mb-6 text-sm text-gray-600 text-center bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <p className="mb-1 font-medium">🧭 How to use:</p>
            <ul className="list-disc list-inside text-left text-sm">
              <li><strong>If you already have a Room ID</strong>, enter it and click <span className="text-blue-600 font-semibold">Join Room</span>.</li>
              <li><strong>If you want to start fresh</strong>, click <span className="text-blue-600 font-semibold">Create Room</span> and share the generated ID with others.</li>
            </ul>
          </div>

          {/* Input Form */}
          <div className="max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-effect rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="roomId" className="block text-sm font-semibold text-gray-700 mb-3">
                    Room ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      placeholder="Enter room ID"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 font-mono text-center"
                    />
                    {roomId && (
                      <button
                        onClick={handleCopyRoomId}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-lg hover:bg-blue-50"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Room
                  </>
                )}
              </button>
              
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className="w-full bg-white text-blue-600 py-4 px-6 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ArrowRight size={20} />
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
