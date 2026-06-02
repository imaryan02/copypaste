import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Plus, ArrowRight, Globe, Clock, ShieldAlert } from 'lucide-react';
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
      title: 'Start a room',
      description: 'Create a room ID, or enter one someone already shared with you.'
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: 'Paste text once',
      description: 'Drop in notes, code snippets, links, or quick messages.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Open it anywhere',
      description: 'Use the same room ID on another device and see updates live.'
    }
  ];

  const useCases = ['Move text from phone to laptop', 'Share quick notes', 'Pass links across devices', 'Sync code snippets'];
  const roomPreview = [
    { label: 'Phone', text: 'Copy this link...' },
    { label: 'Laptop', text: 'Copy this link...' },
    { label: 'Tablet', text: 'Copy this link...' }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/80 border border-blue-100 text-xs sm:text-sm font-semibold text-blue-700 shadow-sm mb-4 sm:mb-5">
              <Clock size={16} />
              <span className="truncate">Temporary real-time text rooms</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold gradient-text mb-4 sm:mb-5 leading-tight break-words">
              CopyPasteGuru
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-3 sm:mb-4 font-semibold">
              Share text between devices without logging in.
            </p>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Create a room, paste your content, and use the same room ID on another phone,
              laptop, or browser. Everyone in the room sees the latest text automatically.
            </p>
          </div>

          <div className="grid xl:grid-cols-[300px_448px_300px] gap-8 items-center justify-center mb-10">
            <div className="hidden xl:block space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">Live room preview</h2>
                <div className="space-y-3">
                  {roomPreview.map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{item.label}</span>
                        <span className="text-green-600 font-semibold">synced</span>
                      </div>
                      <div className="font-mono text-sm text-gray-700 truncate">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-lg">
                <p className="text-sm font-semibold mb-2">One room ID</p>
                <p className="text-sm text-blue-50 leading-relaxed">
                  Share the ID once. Any browser using it sees the same text box.
                </p>
              </div>
            </div>

            <div className="min-w-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-5 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <p className="mb-2 font-semibold text-gray-800">Use a room to share text instantly:</p>
                <ul className="list-disc list-outside pl-5 text-left text-sm space-y-1">
                  <li><strong>Have a Room ID?</strong> Enter it and click <span className="text-blue-600 font-semibold">Join Room</span>.</li>
                  <li><strong>Starting fresh?</strong> Click <span className="text-blue-600 font-semibold">Create Room</span>, then share the room ID.</li>
                </ul>
              </div>

              <div className="glass-effect rounded-2xl p-5 sm:p-8 shadow-xl">
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
                          aria-label="Copy Room ID"
                        >
                          <Copy size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
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

            <div className="hidden xl:block space-y-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">Best for quick transfers</h2>
                <div className="space-y-3">
                  {useCases.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">
                      <Copy size={16} className="text-blue-600 flex-shrink-0" />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Anyone with the room ID can edit it. Avoid passwords, API keys, and private documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
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

          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
            <div className="space-y-5">
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Use it for</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {useCases.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">
                      <Copy size={16} className="text-blue-600 flex-shrink-0" />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-bold text-amber-900 mb-1">Good for quick sharing, not private secrets</h2>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Anyone with the room ID can view and edit that room. Do not paste passwords,
                      private documents, API keys, or sensitive production data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">What happens after joining?</h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  You get a shared text box for that room. Paste or type anything, and it syncs
                  automatically for everyone using the same room ID.
                </p>
                <p>
                  Copy the room ID from the room page and open it on another device whenever you
                  need the same text there.
                </p>
                <p className="font-medium text-gray-800">
                  No sign-up, no install, just a temporary room for quick text transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
