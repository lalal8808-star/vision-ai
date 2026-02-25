import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SAFETY_ANALYSIS_PROMPT = `당신은 현장 및 일상 안전 분석 전문가입니다. 제공된 이미지를 분석하여 위험 요소를 식별하고 안전 가이드라인을 제시해주세요.

다음 기준에 따라 분석해주세요:

1. **위험 등급 판정**:
   - HIGH: 즉각적인 위험이 존재하며 사고 발생 가능성이 높음
   - MEDIUM: 잠재적 위험이 존재하며 주의가 필요함
   - LOW: 경미한 위험 요소가 있으나 즉각적 위험은 낮음
   - SAFE: 특별한 위험 요소가 발견되지 않음

2. **분석 영역**:
   - 구조적 안전성 (건물, 시설물 균열, 기울어짐 등)
   - 전기 안전 (노출된 전선, 과부하 콘센트, 손상된 케이블 등)
   - 화재 위험 (가연물 배치, 소화기 부재, 비상구 차단 등)
   - 추락/전도 위험 (미끄러운 바닥, 난간 부재, 높이 작업 등)
   - 화학물질 위험 (유해물질 노출, 부적절한 보관 등)
   - 인체공학적 위험 (부적절한 작업 자세, 과도한 하중 등)
   - 개인보호장구(PPE) 착용 여부

3. **관련 법규/기준 (반드시 아래 실존 조항 목록에서만 선택할 것. 이 목록에 없는 조항은 사용하지 마시오)**:
   - 산업안전보건법 제37조 (안전보건표지의 설치ㆍ부착)
   - 산업안전보건법 제38조 (안전조치): 사업주의 일반적 안전조치 의무
   - 산업안전보건법 제39조 (보건조치): 사업주의 건강장해 예방 조치
   - 산업안전보건기준에 관한 규칙 제14조 (낙하물에 의한 위험의 방지)
   - 산업안전보건기준에 관한 규칙 제32조 (보호구의 지급 등)
   - 산업안전보건기준에 관한 규칙 제42조 (추락의 방지)
   - 산업안전보건기준에 관한 규칙 제43조 (개구부 등의 방호 조치)
   - 산업안전보건기준에 관한 규칙 제225조 (위험물질 등의 제조 등 작업 시의 조치)
   - 산업안전보건기준에 관한 규칙 제301조 (전기 기계ㆍ기구 등의 충전부 방호)
   - 산업안전보건기준에 관한 규칙 제313조 (배선 등의 절연피복 등)
   - 화재의 예방 및 안전관리에 관한 법률 제17조 (화재의 예방조치 등)
   - 소방시설 설치 및 관리에 관한 법률 제12조 (소방시설의 설치ㆍ유지 및 관리)

반드시 아래 JSON 형식으로 응답해주세요. JSON 외의 텍스트는 포함하지 마세요:
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "summary": "전반적인 안전 상태 요약 (2-3문장)",
  "sceneDescription": "이미지에 보이는 장면 설명 (1-2문장)",
  "hazards": [
    {
      "category": "위험 카테고리",
      "description": "구체적인 위험 설명",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "location": "이미지에서의 위치 설명"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "title": "권고 제목",
      "description": "구체적인 안전 조치 설명",
      "regulation": "관련 법규 또는 기준 (있는 경우, 반드시 '산업안전보건법 제38조'처럼 구체적인 조항까지 명시)"
    }
  ]
}`;

export async function analyzeImage(imageBase64: string, context?: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = context
    ? `${SAFETY_ANALYSIS_PROMPT}\n\n추가 컨텍스트: ${context}`
    : SAFETY_ANALYSIS_PROMPT;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: 'image/jpeg',
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = result.response;
  return response.text();
}
