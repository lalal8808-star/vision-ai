import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Vision AI 안전 분석기 | 실시간 위험 요소 감지",
  description: "스마트폰 카메라로 현장/일상의 위험 요소를 AI가 실시간으로 분석하고 안전 가이드라인을 제시합니다. 산업안전보건법 기반 전문 분석.",
  keywords: ["안전 분석", "Vision AI", "위험 감지", "산업안전", "AI 카메라"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <main className="page-container">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
