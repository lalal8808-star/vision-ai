'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, X, Upload, Scan } from 'lucide-react';
import { AnalysisResult, AnalysisResponse } from '@/types';
import AnalysisResultPanel from '@/components/AnalysisResult';

export default function AnalyzePage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Start Camera
    const startCamera = useCallback(async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 960 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
            setIsCameraOn(true);
        } catch (err) {
            console.error('Camera error:', err);
            setError('카메라에 접근할 수 없습니다. 카메라 권한을 허용해주세요.');
        }
    }, [facingMode]);

    // Stop Camera
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOn(false);
    }, [stream]);

    // Switch Camera
    const switchCamera = useCallback(() => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }, [stopCamera]);

    // Auto-restart camera when facingMode changes
    useEffect(() => {
        if (isCameraOn === false && stream === null && facingMode) {
            // Only restart if we intentionally switched
        }
    }, [facingMode, isCameraOn, stream]);

    // Restart camera after switching
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Capture Frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 거울 모드일 때 캡처 화면도 반전 저장
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
    }, [stopCamera, facingMode]);

    // Handle File Upload
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            setCapturedImage(imageData);
            stopCamera();
        };
        reader.readAsDataURL(file);
    }, [stopCamera]);

    // Analyze Image
    const analyzeImage = useCallback(async () => {
        if (!capturedImage) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Extract base64 from data URL
            const base64 = capturedImage.split(',')[1];

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: base64 }),
            });

            const data: AnalysisResponse = await response.json();

            if (data.success && data.data) {
                // Store full image data for history
                data.data.imageData = capturedImage;
                setResult(data.data);

                // Save to history
                const history = JSON.parse(localStorage.getItem('analysis_history') || '[]');
                const historyItem = { ...data.data, imageData: capturedImage.substring(0, 200) + '...' };
                history.unshift(historyItem);
                if (history.length > 20) history.pop();
                localStorage.setItem('analysis_history', JSON.stringify(history));
            } else {
                setError(data.error || '분석에 실패했습니다.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError('서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [capturedImage]);

    // Reset
    const reset = useCallback(() => {
        setCapturedImage(null);
        setResult(null);
        setError(null);
        setIsAnalyzing(false);
    }, []);

    return (
        <div className="analyze-layout">
            {/* Camera Section */}
            <div className="camera-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        📷 이미지 촬영/업로드
                    </h2>
                </div>

                {/* Camera Viewport or Captured Image */}
                {capturedImage ? (
                    <div className="captured-preview">
                        <img src={capturedImage} alt="캡처된 이미지" />
                        <span className="captured-badge">📸 캡처됨</span>
                    </div>
                ) : (
                    <div className="camera-viewport">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                display: isCameraOn ? 'block' : 'none',
                                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                            }}
                        />
                        <canvas ref={canvasRef} />

                        {!isCameraOn && (
                            <div className="camera-overlay">
                                <Camera size={48} />
                                <p>카메라를 시작하거나 이미지를 업로드하세요</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="scanning-overlay">
                                <div className="scanning-animation">
                                    <div className="scanning-ring" />
                                    <span className="scanning-text">AI 분석 중...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Controls */}
                <div className="camera-controls">
                    {!capturedImage ? (
                        <>
                            {!isCameraOn ? (
                                <button className="btn btn-primary" onClick={startCamera}>
                                    <Camera size={18} />
                                    카메라 시작
                                </button>
                            ) : (
                                <>
                                    <button className="btn-icon" onClick={switchCamera} title="카메라 전환">
                                        <RefreshCw size={18} />
                                    </button>
                                    <button className="capture-btn" onClick={captureFrame} title="촬영">
                                        <Scan size={24} />
                                    </button>
                                    <button className="btn-icon" onClick={stopCamera} title="카메라 중지">
                                        <X size={18} />
                                    </button>
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="btn btn-secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={18} />
                                이미지 업로드
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={analyzeImage}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                        분석 중...
                                    </>
                                ) : (
                                    <>
                                        <Scan size={18} />
                                        안전 분석 시작
                                    </>
                                )}
                            </button>
                            <button className="btn btn-secondary" onClick={reset}>
                                <RefreshCw size={18} />
                                다시 촬영
                            </button>
                        </>
                    )}
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--accent-red)',
                        fontSize: '0.85rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            <div className="results-section">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    📊 분석 결과
                </h2>

                {isAnalyzing && (
                    <div className="loading-spinner">
                        <div className="spinner" />
                        <span className="loading-text">AI가 이미지를 분석하고 있습니다...</span>
                    </div>
                )}

                {result ? (
                    <AnalysisResultPanel result={result} />
                ) : !isAnalyzing ? (
                    <div className="result-empty">
                        <Scan size={48} />
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>분석 결과가 여기에 표시됩니다</p>
                            <p>카메라로 촬영하거나 이미지를 업로드한 후<br />안전 분석을 시작하세요</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
