
import React from 'react';
import { PredictionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ShieldAlert, Heart, ClipboardList, Info } from 'lucide-react';
import RiskMeter from './RiskMeter';

interface ResultsDisplayProps {
  result: PredictionResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const chartData = result.feature_importance.map(f => ({
    name: f.label,
    impact: f.impact,
    desc: f.description
  }));

  return (
    <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskMeter score={result.risk_score} level={result.risk_level} />
        
        <div className="md:col-span-2 space-y-6">
          <div className={`p-6 rounded-3xl border-2 flex flex-col gap-4 ${
            result.risk_level === 'High' ? 'bg-red-50/50 border-red-100 text-red-900' :
            result.risk_level === 'Medium' ? 'bg-amber-50/50 border-amber-100 text-amber-900' :
            'bg-emerald-50/50 border-emerald-100 text-emerald-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">{result.prediction}</h2>
            </div>
            <p className="text-sm leading-relaxed font-medium opacity-90 italic">
              "Based on Orange/UCI heuristic mapping, your parameters show a {result.risk_level.toLowerCase()} probability of cardiovascular disease."
            </p>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <span>AI Confidence: {Math.round(result.confidence * 100)}%</span>
              <span className="opacity-40">|</span>
              <span>Dataset: UCI-Heart-1988</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Info className="w-4 h-4" /> Orange Logic Breakdown
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {result.orange_database_logic}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
            <Activity className="w-5 h-5 text-blue-500" />
            Impact of Parameters
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[-100, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>Reduces Risk Factors</span>
            <span>Increases Risk Factors</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
              <Heart className="w-5 h-5 text-rose-500" />
              Clinical Insights
            </h3>
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-sm">
                {result.clinical_analysis}
              </p>
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <ClipboardList className="w-4 h-4" /> Recommendation Plan
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-700">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
