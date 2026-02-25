import Link from 'next/link';
import { Camera, Shield, Zap, FileText } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Shield size={14} />
          AI 기반 실시간 안전 분석
        </div>
        <h1 className="hero-title">
          카메라 하나로<br />
          <span className="gradient-text">안전을 분석합니다</span>
        </h1>
        <p className="hero-description">
          스마트폰 카메라로 현장이나 공간을 비추면 Vision AI가
          위험 요소를 실시간으로 감지하고, 산업안전보건법 기반의
          전문 안전 가이드라인을 즉시 제공합니다.
        </p>
        <div className="hero-actions">
          <Link href="/analyze" className="btn btn-primary">
            <Camera size={18} />
            분석 시작하기
          </Link>
          <Link href="/guide" className="btn btn-secondary">
            <FileText size={18} />
            안전 가이드
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon blue">📷</div>
          <h3>실시간 카메라 분석</h3>
          <p>
            스마트폰 카메라로 현장을 비추고 캡처하면 AI가
            즉시 위험 요소를 분석합니다. 전면/후면 카메라 모두 지원합니다.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon purple">🤖</div>
          <h3>Gemini Vision AI</h3>
          <p>
            Google Gemini의 최신 멀티모달 AI가 이미지를 정밀하게 분석하여
            구조적 위험, 전기 안전, 화재 위험 등을 감지합니다.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon cyan">⚖️</div>
          <h3>법규 기반 가이드</h3>
          <p>
            산업안전보건법, 화재예방법, OSHA 기준 등 실제 법규와
            기준에 근거한 전문적인 안전 권고사항을 제공합니다.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon green">📊</div>
          <h3>위험도 등급 판정</h3>
          <p>
            발견된 위험 요소의 심각도를 HIGH, MEDIUM, LOW, SAFE
            4단계로 분류하여 우선순위에 따른 대응을 안내합니다.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginTop: '80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '40px' }}>
          어떻게 <span className="gradient-text">작동하나요?</span>
        </h2>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="feature-card">
            <div className="feature-icon blue" style={{ margin: '0 auto 16px' }}>1️⃣</div>
            <h3>카메라 촬영</h3>
            <p>분석하고 싶은 공간이나 장비를 카메라로 촬영합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple" style={{ margin: '0 auto 16px' }}>2️⃣</div>
            <h3>AI 분석</h3>
            <p>Gemini Vision AI가 이미지를 분석하여 위험 요소를 감지합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green" style={{ margin: '0 auto 16px' }}>3️⃣</div>
            <h3>안전 보고</h3>
            <p>위험도 등급, 위험 요소, 안전 권고사항이 즉시 제공됩니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
