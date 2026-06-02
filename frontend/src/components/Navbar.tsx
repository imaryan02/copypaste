import React from 'react';
import { Copy, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="glass-effect border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex min-w-0 items-center space-x-2 sm:space-x-3 cursor-pointer group outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
            aria-label="Go to Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex flex-shrink-0 items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold gradient-text group-hover:underline transition-all truncate">
                CopyPaste
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 -mt-1">Real-time sharing</p>
            </div>
          </Link>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <span className="hidden sm:inline text-xs text-gray-500 italic tracking-wide">
              Built by
            </span>
            <a
              href="https://www.linkedin.com/in/imaryan02/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white/70 hover:bg-blue-50 border border-blue-100 rounded-full pl-2 pr-2 sm:pr-4 py-1.5 shadow transition group space-x-1.5 sm:space-x-2"
            >
              <Linkedin size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="signature text-blue-700 font-semibold text-[1.05rem] tracking-wide ml-1 hidden sm:inline">
                Aryan Gupta
              </span>
              <span className="signature text-blue-700 font-semibold text-[1.05rem] tracking-wide ml-1 sm:hidden">
                Aryan
              </span>
              <ExternalLink size={14} className="hidden sm:block text-gray-400 group-hover:text-blue-700 transition-colors" />
            </a>
            <style>{`
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
