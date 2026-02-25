import { AnalysisResult } from '@/types';
import RiskBadge from './RiskBadge';
import { AlertTriangle, Shield, MapPin, Scale } from 'lucide-react';

interface AnalysisResultProps {
    result: AnalysisResult;
}

export default function AnalysisResultPanel({ result }: AnalysisResultProps) {
    return (
        <div className="results-content">
            {/* Risk Overview */}
            <div className={`risk-overview ${result.riskLevel.toLowerCase()}`}>
                <span className="risk-level-large">
                    {result.riskLevel === 'HIGH' ? '🔴' :
                        result.riskLevel === 'MEDIUM' ? '🟡' :
                            result.riskLevel === 'LOW' ? '🔵' : '🟢'}
                </span>
                <div className="risk-info">
                    <h3>
                        안전 등급: <RiskBadge level={result.riskLevel} />
                    </h3>
                    <p>{result.summary}</p>
                </div>
            </div>

            {/* Scene Description */}
            {result.sceneDescription && (
                <div className="result-card">
                    <h3>
                        <Shield size={16} />
                        장면 설명
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {result.sceneDescription}
                    </p>
                </div>
            )}

            {/* Hazards */}
            {result.hazards.length > 0 && (
                <div className="result-card">
                    <h3>
                        <AlertTriangle size={16} />
                        발견된 위험 요소 ({result.hazards.length}건)
                    </h3>
                    <div className="hazard-list">
                        {result.hazards.map((hazard) => (
                            <div key={hazard.id} className="hazard-item">
                                <div className={`hazard-marker ${hazard.severity.toLowerCase()}`} />
                                <div className="hazard-content">
                                    <h4>{hazard.category}</h4>
                                    <p>{hazard.description}</p>
                                    {hazard.location && (
                                        <div className="hazard-location">
                                            <MapPin size={10} style={{ display: 'inline', marginRight: 4 }} />
                                            {hazard.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <div className="result-card">
                    <h3>
                        <Scale size={16} />
                        안전 권고사항
                    </h3>
                    <div className="recommendation-list">
                        {result.recommendations.map((rec) => (
                            <div key={rec.id} className="recommendation-item">
                                <span className="recommendation-number">{rec.priority}</span>
                                <div className="recommendation-content">
                                    <h4>{rec.title}</h4>
                                    <p>{rec.description}</p>
                                    {rec.regulation && (
                                        <span className="recommendation-regulation">
                                            📜 {rec.regulationLink ? (
                                                <a href={rec.regulationLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                    {rec.regulation} 상세 보기
                                                </a>
                                            ) : (
                                                rec.regulation
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
