export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export interface Hazard {
  id: string;
  category: string;
  description: string;
  severity: RiskLevel;
  location?: string;
}

export interface SafetyRecommendation {
  id: string;
  priority: number;
  title: string;
  description: string;
  regulation?: string;
  regulationLink?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageData: string;
  riskLevel: RiskLevel;
  summary: string;
  hazards: Hazard[];
  recommendations: SafetyRecommendation[];
  sceneDescription: string;
}

export interface AnalysisRequest {
  imageBase64: string;
  context?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
