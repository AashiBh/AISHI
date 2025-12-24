
import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { label: string; value: number }[];
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  name, 
  type = "number", 
  value, 
  onChange, 
  options, 
  helperText,
  min,
  max,
  step
}) => {
  return (
    <div className="flex flex-col space-y-3 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      {options ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none text-slate-800 font-bold text-sm appearance-none cursor-pointer hover:bg-slate-100/50"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none text-slate-800 font-black text-sm mono placeholder-slate-300 hover:bg-slate-100/50 input-glow"
        />
      )}
      {helperText && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter ml-1 opacity-70">{helperText}</p>}
    </div>
  );
};

export default InputGroup;
