
import React from 'react';

interface RiskMeterProps {
  score: number;
  level: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, level }) => {
  const getColor = () => {
    if (level === 'High') return 'from-rose-500 to-red-700';
    if (level === 'Medium') return 'from-orange-400 to-amber-600';
    return 'from-emerald-400 to-teal-600';
  };

  const getBorderColor = () => {
    if (level === 'High') return 'border-rose-100';
    if (level === 'Medium') return 'border-amber-100';
    return 'border-emerald-100';
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-sm border ${getBorderColor()} h-full transition-all hover:scale-[1.02]`}>
      <div className="relative w-56 h-56">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="94"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="16"
          />
          <circle
            cx="112"
            cy="112"
            r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeDasharray={590}
            strokeDashoffset={590 - (590 * score) / 100}
            className={`transition-all duration-1000 ease-out text-transparent bg-clip-border ${getColor()}`}
            style={{ stroke: 'url(#gaugeGradient)' }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={level === 'High' ? '#f43f5e' : level === 'Medium' ? '#fb923c' : '#34d399'} />
              <stop offset="100%" stopColor={level === 'High' ? '#be123c' : level === 'Medium' ? '#d97706' : '#059669'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-slate-800 mono tracking-tighter">{score}%</span>
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] mt-1 ${
            level === 'High' ? 'text-red-500' : level === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
          }`}>{level} Risk</span>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-1">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Diagnostic Probability</p>
        <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
      </div>
    </div>
  );
};

export default RiskMeter;
