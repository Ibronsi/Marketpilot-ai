import { MousePointer2 } from 'lucide-react';

export function Brand() {
  return (
    <div className="flex items-center gap-[10px]" aria-label="MarketPilot AI">
      <span className="brand-mark">
        <MousePointer2 size={18} strokeWidth={2.1} />
      </span>
      <span className="brand-name">
        MarketPilot <span className="brand-ai">AI</span>
      </span>
    </div>
  );
}
