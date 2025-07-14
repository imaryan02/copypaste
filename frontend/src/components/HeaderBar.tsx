import React from 'react';
import { LogOut, Wifi, AlertCircle, Copy } from 'lucide-react';

interface HeaderBarProps {
  roomId: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  onLeave: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ roomId, connectionStatus, onLeave }) => {
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
    } catch (err) {
      // Optionally, show toast error
      alert('Failed to copy Room ID');
    }
  };

  const getConnectionDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi size={16} className="text-green-500" />,
          text: `Connected to Room ${roomId}`,
          textColor: 'text-green-600',
          dotColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
          text: 'Connecting...',
          textColor: 'text-blue-600',
          dotColor: 'bg-blue-500'
        };
      case 'disconnected':
      default:
        return {
          icon: <AlertCircle size={16} className="text-red-500" />,
          text: 'Disconnected',
          textColor: 'text-red-600',
          dotColor: 'bg-red-500'
        };
    }
  };

  const connectionDisplay = getConnectionDisplay();

  return (
    <header className="glass-effect border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Room ID Section */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30 shadow-lg">
            <span className="text-sm font-semibold text-gray-700">Room ID:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent px-3 py-1.5 bg-gray-100 rounded-lg border truncate max-w-[120px] sm:max-w-xs">
                {roomId}
              </span>
              <button
                onClick={handleCopyRoomId}
                className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
                title="Copy Room ID"
                aria-label="Copy Room ID"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Left side - App name */}
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold gradient-text">CopyPaste</h1>
          </div>

          {/* Right side - Connection status and leave button */}
          <div className="flex items-center space-x-4">
            {/* Connection status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${connectionDisplay.dotColor} animate-pulse`} />
              <div className="flex items-center space-x-2">
                {connectionDisplay.icon}
                <span className={`text-sm font-medium ${connectionDisplay.textColor} hidden sm:inline`}>
                  {connectionDisplay.text}
                </span>
              </div>
            </div>

            {/* Leave button */}
            <button
              onClick={onLeave}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50 font-medium"
              aria-label="Leave Room"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
