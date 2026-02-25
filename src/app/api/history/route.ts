import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const analyses = await prisma.analysis.findMany({
            where: { userId: session.user.id },
            orderBy: { timestamp: "desc" },
        });

        // Parse the results back into AnalysisResult array
        const data = analyses.map((a: { id: string, result: string }) => {
            try {
                const parsed = JSON.parse(a.result);
                parsed.dbId = a.id;
                return parsed;
            } catch {
                return null;
            }
        }).filter(Boolean);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 });
    }
}
