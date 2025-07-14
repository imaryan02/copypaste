import React, { useEffect, useState } from 'react';
import { Heart, Linkedin, ExternalLink, AlertTriangle, BookOpen, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust if your path is different

const Footer: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // Only increment for first-time visits (per browser)
    const fetchAndIncrement = async () => {
      if (!localStorage.getItem('visited-copypaste')) {
        await supabase.rpc('increment_count');
        localStorage.setItem('visited-copypaste', 'yes');
      }
      const { data } = await supabase
        .from('visit_counts')
        .select('count')
        .eq('id', 1)
        .single();
      setVisitCount(data?.count ?? 0);
    };
    fetchAndIncrement();
  }, []);

  return (
    <footer className="py-12 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand & Mission */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow">
                <Copy size={17} className="text-white" />
              </span>
              <span className="text-xl font-bold gradient-text">CopyPaste</span>
            </div>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Seamless. Private. Real-time.</span>
              <br />
              Instantly copy, paste, and sync across devices—no hassle.
            </p>
            {/* 👇 Visitor Counter */}
            <div className="mt-2 text-xs text-gray-500">
              {visitCount !== null ? (
                <span>
                  👀 <span className="font-semibold">{visitCount.toLocaleString()}</span> visits so far
                </span>
              ) : (
                <span>Loading visits...</span>
              )}
            </div>
          </div>

          {/* Educational Notice */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={19} className="text-amber-600" />
              <span className="font-semibold text-gray-800">Educational Purpose</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-amber-800 text-xs text-left">
                  <span className="font-medium">Learning Project</span>
                  <br />
                  This tool is for learning and demonstration only.<br />
                  Do not use for confidential or production data.
                </div>
              </div>
            </div>
          </div>

          {/* Creator & Connect */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <span className="font-semibold text-gray-800 mb-3">
              Made with
              <Heart size={14} className="inline text-red-500 mx-1 animate-pulse" />
              <span className="signature text-blue-700 font-semibold text-base tracking-wide ml-1">
                Aryan Gupta
                <span
                  className="inline-block ml-1 align-middle"
                  style={{
                    animation: "blink 2.5s infinite",
                    fontSize: "1.05em"
                  }}
                >😉</span>
              </span>
            </span>
            <a
              href="https://www.linkedin.com/in/imaryan02/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow group"
              aria-label="Aryan Gupta LinkedIn"
            >
              <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-wide font-bold signature">Connect on LinkedIn</span>
              <ExternalLink size={13} />
            </a>
            <style>{`
              @keyframes blink {
                0%, 90%, 100% { opacity: 1; }
                92%, 94% { opacity: 0.2; }
              }
              .signature {
                font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                letter-spacing: 0.03em;
                text-shadow: 0 1px 2px rgba(30, 64, 175, 0.07);
                transition: color 0.2s;
              }
            `}</style>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-300 pt-6 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span>© 2025 CopyPaste</span>
              <span>•</span>
              <span>Educational Project</span>
              <span>•</span>
              <span>React & Supabase</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Crafted with</span>
              <Heart size={13} className="text-red-500 animate-pulse" />
              <span>for learners & makers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
