
export interface HeartFeatures {
  age: number;
  sex: number;
  cp: number;
  bp: number;
  chol: number;
  maxhr: number;
  exang: number;
  oldpeak: number;
  ca: number;
  thal: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface PredictionResult {
  prediction: string;
  risk_level: RiskLevel;
  risk_score: number; // 0-100
  confidence: number;
  clinical_analysis: string;
  orange_database_logic: string; 
  recommendations: string[];
  feature_importance: {
    label: string;
    impact: number; 
    description: string;
  }[];
}
