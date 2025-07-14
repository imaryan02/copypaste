import React from 'react';
import { Copy, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="glass-effect border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and brand (Clickable, links to Home) */}
          <Link
            to="/"
            className="flex items-center space-x-3 cursor-pointer group outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
            aria-label="Go to Home"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text group-hover:underline transition-all">
                CopyPaste
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Real-time sharing</p>
            </div>
          </Link>

          {/* Right side - Creator signature */}
          <div className="flex items-center space-x-2">
            {/* Show this only on md+ screens */}
            <span className="hidden sm:inline text-xs text-gray-500 italic tracking-wide">
              Built with
              <span className="mx-1 animate-pulse" style={{ color: "#e63946" }}>❤️</span>
              by
            </span>
            <a
              href="https://www.linkedin.com/in/imaryan02/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white/70 hover:bg-blue-50 border border-blue-100 rounded-full pl-2 pr-4 py-1.5 shadow transition group space-x-2"
            >
              <Linkedin size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              {/* Full signature on desktop, minimal on mobile */}
              <span className="signature text-blue-700 font-semibold text-[1.05rem] tracking-wide ml-1 hidden sm:inline">
                Aryan Gupta
                <span
                  className="inline-block ml-1"
                  style={{
                    animation: "blink 2.5s infinite",
                    fontSize: "1.1em"
                  }}
                >😉</span>
              </span>
              <span className="signature text-blue-700 font-semibold text-[1.05rem] tracking-wide ml-1 sm:hidden">
                Aryan
              </span>
              <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-700 transition-colors" />
            </a>
            {/* Blink animation style */}
            <style>{`
              @keyframes blink {
                0%, 90%, 100% { opacity: 1; }
                92%, 94% { opacity: 0.2; }
              }
              .signature {
                font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                letter-spacing: 0.03em;
                text-shadow: 0 1px 2px rgba(30, 64, 175, 0.08);
                transition: color 0.2s;
              }
            `}</style>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
