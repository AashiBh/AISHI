
import React, { useState, useRef } from 'react';
import { HeartFeatures, PredictionResult } from './types';
import { analyzeHeartHealth } from './services/geminiService';
import InputGroup from './components/InputGroup';
import ResultsDisplay from './components/ResultsDisplay';
import { Activity, Heart, Upload, Download, Database, Microscope, ShieldCheck, AlertCircle, Fingerprint } from 'lucide-react';

const App: React.FC = () => {
  const [features, setFeatures] = useState<HeartFeatures>({
    age: 54, sex: 1, cp: 2, bp: 130, chol: 240,
    maxhr: 155, exang: 0, oldpeak: 1.2, ca: 0, thal: 3
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeatures(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const dataLine = lines.find(l => l && !l.startsWith('#') && !l.includes('class') && !l.includes('meta') && !l.includes('feature') && !l.includes('continuous') && l.trim().length > 0);
      if (dataLine) {
        const v = dataLine.split(/,|\t/).map(val => val.trim());
        if (v.length >= 10) {
          setFeatures({
            age: parseFloat(v[0]) || 0,
            sex: parseFloat(v[1]) || 0,
            cp: parseFloat(v[2]) || 0,
            bp: parseFloat(v[3]) || 0,
            chol: parseFloat(v[4]) || 0,
            maxhr: parseFloat(v[5]) || 0,
            exang: parseFloat(v[6]) || 0,
            oldpeak: parseFloat(v[7]) || 0,
            ca: parseFloat(v[8]) || 0,
            thal: parseFloat(v[9]) || 0
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const downloadOrangeTab = () => {
    const header = "age\tsex\tcp\tbp\tchol\tmaxhr\texang\toldpeak\tca\tthal\n";
    const types = "continuous\tdiscrete\tdiscrete\tcontinuous\tcontinuous\tcontinuous\tdiscrete\tcontinuous\tdiscrete\tdiscrete\n";
    const roles = "feature\tfeature\tfeature\tfeature\tfeature\tfeature\tfeature\tfeature\tfeature\tfeature\n";
    const values = `${features.age}\t${features.sex}\t${features.cp}\t${features.bp}\t${features.chol}\t${features.maxhr}\t${features.exang}\t${features.oldpeak}\t${features.ca}\t${features.thal}\n`;
    
    const blob = new Blob([header + types + roles + values], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orange_export_${Date.now()}.tab`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeHeartHealth(features);
      setResult(data);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      setError(err.message || "Analysis Failed: Please check your internet connection and API configuration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <header className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8 glass-card p-10 rounded-[3rem]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-blue-200 animate-float">
              <Heart className="w-9 h-9 text-white fill-current opacity-90" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
               <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">CardiaGuard <span className="text-blue-600">Pro</span></h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <Database className="w-3 h-3 text-orange-400" /> UCI Heart Database Logic
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-[11px] font-black border border-slate-100 shadow-sm transition-all hover:-translate-y-1"
          >
            <Upload className="w-4 h-4 text-blue-500" /> IMPORT ORANGE (.TAB)
          </button>
          <button 
            type="button"
            onClick={downloadOrangeTab}
            className="group flex items-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-[11px] font-black border border-slate-100 shadow-sm transition-all hover:-translate-y-1"
          >
            <Download className="w-4 h-4 text-emerald-500" /> EXPORT ORANGE (.TAB)
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".tab,.csv" onChange={handleFileUpload} />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <aside className="xl:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-blue-500" /> Ranking Priority
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-[11px] font-bold text-blue-700 mb-1">High Importance (> 1)</p>
                <p className="text-[10px] text-blue-600/70 leading-relaxed font-medium">
                  CA (Vessels) and Thal are weighted as primary indicators in Orange.
                </p>
              </div>
              {[
                { label: 'Thal (Hematology)', val: 95, color: 'bg-indigo-500' },
                { label: 'Vessels (CA)', val: 82, color: 'bg-blue-500' },
                { label: 'Chest Pain (CP)', val: 68, color: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-125 transition-transform duration-700">
               <Fingerprint className="w-24 h-24" />
            </div>
            <h4 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-blue-400">Diagnosis Alert</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              If Thal > 3 or CA > 0, the system triggers a "Pathological Warning" protocol matching UCI standards.
            </p>
          </div>
        </aside>

        <main className="xl:col-span-9">
          <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-slate-50 relative">
            <form onSubmit={handleSubmit} className="space-y-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                <div className="space-y-10 md:col-span-2 lg:col-span-3">
                   <div className="flex items-center gap-4 mb-2">
                     <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black flex items-center justify-center">01</span>
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] flex-1">Bio-Metric Profiling</h3>
                     <div className="h-px bg-slate-100 flex-[4]"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <InputGroup label="Patient Age" name="age" value={features.age} onChange={handleInputChange} min={1} max={120} />
                     <InputGroup label="Sex (0=F, 1=M)" name="sex" value={features.sex} onChange={handleInputChange} options={[{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }]} />
                     <InputGroup label="Sys. BP (mmHg)" name="bp" value={features.bp} onChange={handleInputChange} min={80} max={220} />
                   </div>
                </div>

                <div className="space-y-10 md:col-span-2 lg:col-span-3">
                   <div className="flex items-center gap-4 mb-2">
                     <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black flex items-center justify-center">02</span>
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] flex-1">Clinical Data</h3>
                     <div className="h-px bg-slate-100 flex-[4]"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <InputGroup label="Cholesterol" name="chol" value={features.chol} onChange={handleInputChange} min={100} max={600} helperText="mg/dl units" />
                     <InputGroup label="Max Heart Rate" name="maxhr" value={features.maxhr} onChange={handleInputChange} min={60} max={220} />
                     <InputGroup label="Angina (0=N, 1=Y)" name="exang" value={features.exang} onChange={handleInputChange} options={[{ label: 'None Reported', value: 0 }, { label: 'Positive', value: 1 }]} />
                   </div>
                </div>

                <div className="space-y-10 md:col-span-2 lg:col-span-3">
                   <div className="flex items-center gap-4 mb-2">
                     <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 text-[11px] font-black flex items-center justify-center">03</span>
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] flex-1">Risk Factors</h3>
                     <div className="h-px bg-slate-100 flex-[4]"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <InputGroup label="CP Type (1-4)" name="cp" value={features.cp} onChange={handleInputChange} options={[{ label: 'Typical Angina', value: 1 }, { label: 'Atypical Angina', value: 2 }, { label: 'Non-Anginal', value: 3 }, { label: 'Asymptomatic', value: 4 }]} />
                      <InputGroup label="Thal (3, 6, 7)" name="thal" value={features.thal} onChange={handleInputChange} options={[{ label: 'Normal (3)', value: 3 }, { label: 'Fixed Defect (6)', value: 6 }, { label: 'Reversable (7)', value: 7 }]} />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <InputGroup label="Oldpeak (>1.0 Risk)" name="oldpeak" value={features.oldpeak} onChange={handleInputChange} step={0.1} />
                     <InputGroup label="Vessels (CA 0-3)" name="ca" value={features.ca} onChange={handleInputChange} min={0} max={3} />
                   </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    group relative px-20 py-8 rounded-[3rem] font-black text-xl tracking-tight transition-all active:scale-95 shadow-[0_30px_60px_rgba(37,99,235,0.25)]
                    ${loading 
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {loading ? (
                      <>
                        <div className="w-7 h-7 border-[4px] border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <span>Analyzing Dataset...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        <span>Perform Diagnostics</span>
                      </>
                    )}
                  </div>
                </button>
                {error && (
                   <div className="mt-8 flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-xs uppercase tracking-wider">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </div>
                )}
              </div>
            </form>

            <div id="results-section">
              {result && <ResultsDisplay result={result} />}
            </div>
          </div>
        </main>
      </div>
      
      <footer className="mt-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] pb-10">
        Clinical Diagnostic Module &copy; 2024 | Powered by Orange Logic
      </footer>
    </div>
  );
};

export default App;
