import React, { useEffect } from 'react';
import { MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

interface DisqusCommentsProps {
  identifier: string;
  title: string;
  url?: string;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: () => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  identifier,
  title,
  url,
}) => {
  useEffect(() => {
    const pageUrl = url || window.location.href;
    const pageIdentifier = identifier || 'hdb-decide-community';
    const pageTitle = title || 'HDB Decide Discussion';

    // Set Disqus global configuration
    window.disqus_config = function (this: {
      page: { url: string; identifier: string; title: string };
    }) {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = pageTitle;
    };

    // If DISQUS is already initialized, reset it for the current page/flat
    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: {
            page: { url: string; identifier: string; title: string };
          }) {
            this.page.url = pageUrl;
            this.page.identifier = pageIdentifier;
            this.page.title = pageTitle;
          },
        });
      } catch (e) {
        console.warn('Disqus reset error:', e);
      }
    } else {
      // Check if script already exists
      const existingScript = document.getElementById('disqus-embed-script');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://hdb-decide.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        (d.head || d.body).appendChild(s);
      }
    }
  }, [identifier, title, url]);

  return (
    <section
      id="disqus-community-section"
      className="mt-8 bg-white p-6 md:p-8 rounded-xl border border-[#e0e3e5] shadow-sm transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#e0e3e5]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0e6969]/10 text-[#0e6969]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#041627] font-['Inter'] flex items-center gap-2">
              <span>Community Discussions & Neighborhood Insights</span>
            </h3>
            <p className="text-xs text-[#74777d]">
              Ask questions, discuss unit valuations, and share experiences with fellow Singapore homeowners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#0e6969] bg-[#a4f0ef]/20 border border-[#88d3d3]/50 px-2.5 py-1 rounded font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Disqus Moderated</span>
          </span>
        </div>
      </div>

      {/* Disqus Embed Container */}
      <div className="min-h-[280px]">
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a
            href="https://disqus.com/?ref_noscript"
            className="text-[#0e6969] underline font-medium"
            rel="nofollow"
          >
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
