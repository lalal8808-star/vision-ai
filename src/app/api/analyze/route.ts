import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { AnalysisResult, AnalysisResponse } from '@/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

async function fetchLawLink(query: string): Promise<string | undefined> {
    if (!query) return undefined;
    const OC_ID = process.env.LAW_OC_ID || 'lalal88';
    try {
        // Extract law name by splitting before the article pattern (제XX조)
        // e.g. "산업안전보건기준에 관한 규칙 제14조 (낙하물 방지)" → "산업안전보건기준에 관한 규칙"
        const articleSplit = query.split(/\s*제\d+조/);
        const mainLaw = articleSplit[0].trim();

        if (!mainLaw) return undefined;

        const url = `http://www.law.go.kr/DRF/lawSearch.do?OC=${OC_ID}&target=law&type=JSON&query=${encodeURIComponent(mainLaw)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data?.LawSearch?.law && data.LawSearch.law.length > 0) {
            const detailLink = data.LawSearch.law[0].법령상세링크;

            // Extract MST id for precise anchoring
            const mstMatch = detailLink.match(/MST=(\d+)/);
            if (mstMatch) {
                const mst = mstMatch[1];

                // Find article number in query (e.g., '14' from '제14조')
                const articleMatch = query.match(/제(\d+)조/);
                if (articleMatch) {
                    const articleNum = articleMatch[1];
                    return `https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=${mst}#J${articleNum}:0`;
                }
                return `https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=${mst}`;
            }
            return `https://www.law.go.kr${detailLink}`;
        }
    } catch (e) {
        console.error('Law API error:', e);
    }
    return undefined;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { imageBase64, context } = body;

        if (!imageBase64) {
            return NextResponse.json<AnalysisResponse>(
                { success: false, error: '이미지 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        const rawResult = await analyzeImage(imageBase64, context);

        const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json<AnalysisResponse>(
                { success: false, error: 'AI 분석 결과를 파싱할 수 없습니다.' },
                { status: 500 }
            );
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Enrich recommendations with actual law links
        const recommendations = await Promise.all(
            (parsed.recommendations || []).map(async (r: Record<string, string | number>, i: number) => {
                const lawLink = r.regulation ? await fetchLawLink(String(r.regulation)) : undefined;
                return {
                    id: generateId() + i,
                    priority: r.priority || i + 1,
                    title: r.title,
                    description: r.description,
                    regulation: r.regulation,
                    regulationLink: lawLink,
                };
            })
        );

        const analysisResult: AnalysisResult = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            imageData: imageBase64.substring(0, 100) + '...',
            riskLevel: parsed.riskLevel || 'LOW',
            summary: parsed.summary || '분석 결과를 확인할 수 없습니다.',
            sceneDescription: parsed.sceneDescription || '',
            hazards: (parsed.hazards || []).map((h: Record<string, string>, i: number) => ({
                id: generateId() + i,
                category: h.category,
                description: h.description,
                severity: h.severity || 'LOW',
                location: h.location,
            })),
            recommendations,
        };

        // Save to Database if user is logged in
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            await prisma.analysis.create({
                data: {
                    userId: session.user.id,
                    result: JSON.stringify(analysisResult),
                },
            });
        }

        return NextResponse.json<AnalysisResponse>({
            success: true,
            data: analysisResult,
        });
    } catch (error) {
        console.error('Analysis error:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        return NextResponse.json<AnalysisResponse>(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
