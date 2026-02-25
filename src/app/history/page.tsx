'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, AlertTriangle, LogIn } from 'lucide-react';
import RiskBadge from '@/components/RiskBadge';
import { AnalysisResult } from '@/types';
import { useSession, signIn } from 'next-auth/react';

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (session) {
            fetch('/api/history')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setHistory(data.data);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            // Unauthenticated fallback
            const stored = localStorage.getItem('analysis_history');
            if (stored) {
                try {
                    setHistory(JSON.parse(stored));
                } catch {
                    setHistory([]);
                }
            }
            setLoading(false);
        }
    }, [session, status]);

    const clearHistory = () => {
        if (!session) {
            localStorage.removeItem('analysis_history');
            setHistory([]);
            setSelectedItem(null);
        } else {
            alert('DB 기록 삭제 기능은 준비중입니다.');
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>;
    }

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>📋 분석 이력</h1>
                    <p>지금까지 수행한 안전 분석 결과를 확인합니다.</p>
                </div>
                {!session && (
                    <button className="auth-btn" onClick={() => signIn('google')} style={{ alignSelf: 'center' }}>
                        <LogIn size={16} /> 구글 로그인 후 이력 동기화
                    </button>
                )}
                {history.length > 0 && !session && (
                    <button className="btn btn-secondary" onClick={clearHistory} style={{ fontSize: '0.85rem' }}>
                        <Trash2 size={14} />
                        로컬 기록 삭제
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="history-empty">
                    <Clock size={64} />
                    <p>{session ? '저장된 클라우드 분석 이력이 없습니다.' : '아직 분석 이력이 없습니다.'}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
                        분석 페이지에서 이미지를 촬영하고 분석을 시작해보세요.
                    </p>
                </div>
            ) : (
                <>
                    {selectedItem && (
                        <div style={{ marginBottom: 24 }}>
                            <button className="btn btn-secondary" onClick={() => setSelectedItem(null)} style={{ marginBottom: 12, fontSize: '0.85rem' }}>
                                ← 목록으로 돌아가기
                            </button>
                            <div className={`risk-overview ${selectedItem.riskLevel.toLowerCase()}`}>
                                <span className="risk-level-large">
                                    {selectedItem.riskLevel === 'HIGH' ? '🔴' :
                                        selectedItem.riskLevel === 'MEDIUM' ? '🟡' :
                                            selectedItem.riskLevel === 'LOW' ? '🔵' : '🟢'}
                                </span>
                                <div className="risk-info">
                                    <h3>안전 등급: <RiskBadge level={selectedItem.riskLevel} /></h3>
                                    <p>{selectedItem.summary}</p>
                                </div>
                            </div>
                            {selectedItem.hazards.length > 0 && (
                                <div className="result-card" style={{ marginTop: 12 }}>
                                    <h3><AlertTriangle size={16} /> 발견된 위험 요소</h3>
                                    <div className="hazard-list">
                                        {selectedItem.hazards.map((h) => (
                                            <div key={h.id} className="hazard-item">
                                                <div className={`hazard-marker ${h.severity.toLowerCase()}`} />
                                                <div className="hazard-content">
                                                    <h4>{h.category}</h4>
                                                    <p>{h.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedItem.recommendations.length > 0 && (
                                <div className="result-card" style={{ marginTop: 12 }}>
                                    <h3>안전 권고사항</h3>
                                    <div className="recommendation-list">
                                        {selectedItem.recommendations.map((r) => (
                                            <div key={r.id} className="recommendation-item">
                                                <span className="recommendation-number">{r.priority}</span>
                                                <div className="recommendation-content">
                                                    <h4>{r.title}</h4>
                                                    <p>{r.description}</p>
                                                    {r.regulation && (
                                                        <span className="recommendation-regulation">
                                                            📜 {r.regulationLink ? (
                                                                <a href={r.regulationLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                                    {r.regulation} 상세 보기
                                                                </a>
                                                            ) : (
                                                                r.regulation
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
                    )}

                    {!selectedItem && (
                        <div className="history-grid">
                            {history.map((item, index) => (
                                <div key={item.id || index} className="history-card" onClick={() => setSelectedItem(item)}>
                                    <div className="history-card-header">
                                        <RiskBadge level={item.riskLevel} />
                                        <span className="history-date">{formatDate(item.timestamp)}</span>
                                    </div>
                                    <div className="history-card-body">
                                        <p>{item.summary}</p>
                                    </div>
                                    <div className="history-stats">
                                        <span>⚠️ 위험 {item.hazards.length}건</span>
                                        <span>📋 권고 {item.recommendations.length}건</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
