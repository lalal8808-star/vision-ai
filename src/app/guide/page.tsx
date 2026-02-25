import { Flame, Zap, HardHat, Construction, FlaskConical, Eye } from 'lucide-react';

export default function GuidePage() {
    return (
        <>
            <div className="page-header">
                <h1>📖 안전 가이드라인</h1>
                <p>주요 위험 카테고리별 안전 점검 사항과 관련 법규를 안내합니다.</p>
            </div>

            <div className="guide-sections">
                {/* 화재 안전 */}
                <section className="guide-section">
                    <h2>
                        <Flame size={20} style={{ color: 'var(--accent-red)' }} />
                        화재 안전
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>🔥 가연물 관리</h4>
                            <p>인화성 물질은 지정된 장소에 보관하고, 화기 취급 장소와 최소 8m 이상 이격해야 합니다. 가연물 주변에 소화기를 비치하세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🧯 소화 설비</h4>
                            <p>소화기는 보행거리 20m 이내에 설치하고, 6개월마다 점검합니다. 소화 설비의 위치 표시가 명확해야 합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🚪 비상구 관리</h4>
                            <p>비상구는 항상 개방 상태를 유지하고, 비상구 앞 물건 적재를 금지합니다. 비상 유도등이 정상 작동하는지 확인하세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>📜 관련 법규</h4>
                            <p>화재예방, 소방시설 설치·유지 및 안전관리에 관한 법률 (소방시설법), 위험물안전관리법</p>
                        </div>
                    </div>
                </section>

                {/* 전기 안전 */}
                <section className="guide-section">
                    <h2>
                        <Zap size={20} style={{ color: 'var(--accent-yellow)' }} />
                        전기 안전
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>⚡ 전선 관리</h4>
                            <p>노출된 전선이나 손상된 케이블은 즉시 교체합니다. 전선은 바닥에 방치하지 않고 케이블 트레이를 사용하세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🔌 콘센트 과부하</h4>
                            <p>멀티탭 문어발 배선을 금지합니다. 하나의 콘센트에 정격 용량 이상의 전기기기를 연결하지 마세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🏷️ 전기 설비 표시</h4>
                            <p>분전반, 고압 설비에는 위험 표시를 부착하고, 비인가자의 접근을 차단합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>📜 관련 법규</h4>
                            <p>전기사업법, 산업안전보건법 시행규칙 제301조~제328조 (전기로 인한 위험 방지)</p>
                        </div>
                    </div>
                </section>

                {/* 추락/전도 위험 */}
                <section className="guide-section">
                    <h2>
                        <Construction size={20} style={{ color: 'var(--accent-cyan)' }} />
                        추락·전도 위험
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>🪜 높이 작업</h4>
                            <p>2m 이상 높이에서 작업 시 안전난간 설치가 필수입니다. 안전대를 착용하고 고정점에 연결합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🚶 미끄러짐 방지</h4>
                            <p>바닥에 물이나 기름이 있으면 즉시 제거하고, 미끄럼 방지 표시를 설치합니다. 계단에는 미끄럼 방지 테이프를 부착하세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🏗️ 개구부 관리</h4>
                            <p>바닥 개구부에는 견고한 덮개를 설치하거나 난간을 설치합니다. &quot;개구부 주의&quot; 표지판을 부착하세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>📜 관련 법규</h4>
                            <p>산업안전보건법 시행규칙 제42조~제63조 (추락 위험 방지), 건설업 산업안전보건관리비 계상기준</p>
                        </div>
                    </div>
                </section>

                {/* 개인보호장구 */}
                <section className="guide-section">
                    <h2>
                        <HardHat size={20} style={{ color: 'var(--accent-green)' }} />
                        개인보호장구 (PPE)
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>🪖 안전모</h4>
                            <p>건설 현장, 공장 등에서는 반드시 안전모를 착용합니다. 턱끈을 체결하고, 3년 이상 된 안전모는 교체합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🧤 보호장갑</h4>
                            <p>작업 유형에 적합한 장갑을 선택합니다. 화학물질 취급 시에는 내화학 장갑, 날카로운 물체 취급 시에는 방절 장갑을 착용합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>👓 보안경</h4>
                            <p>분진, 파편, 화학물질이 발생하는 작업에서는 보안경을 착용합니다. 용접 작업 시에는 용접용 차광 보안면을 사용합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>👢 안전화</h4>
                            <p>중량물 취급, 건설 현장에서는 강선이 내장된 안전화를 착용합니다. 전기 작업 시에는 절연화를 착용합니다.</p>
                        </div>
                    </div>
                </section>

                {/* 화학물질 안전 */}
                <section className="guide-section">
                    <h2>
                        <FlaskConical size={20} style={{ color: 'var(--accent-purple)' }} />
                        화학물질 안전
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>🏷️ MSDS 비치</h4>
                            <p>모든 화학물질에 대한 물질안전보건자료(MSDS)를 작업장에 비치하고, 근로자가 쉽게 접근할 수 있어야 합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>📦 적절한 보관</h4>
                            <p>화학물질은 종류별로 분리 보관하고, 환기가 가능한 지정 장소에 보관합니다. 용기에 내용물 표시를 명확히 합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🌬️ 환기 설비</h4>
                            <p>유해 가스가 발생하는 장소에는 국소 배기장치를 설치합니다. 밀폐 공간 작업 시에는 충분한 환기를 확보합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>📜 관련 법규</h4>
                            <p>화학물질관리법, 산업안전보건법 시행규칙 제420조~제452조 (화학물질에 의한 건강장해의 예방)</p>
                        </div>
                    </div>
                </section>

                {/* 일상 안전 */}
                <section className="guide-section">
                    <h2>
                        <Eye size={20} style={{ color: 'var(--accent-blue)' }} />
                        일상 안전 체크리스트
                    </h2>
                    <div className="guide-items">
                        <div className="guide-item">
                            <h4>🏠 가정 내 안전</h4>
                            <p>가스밸브, 전기 콘센트, 소화기, 감지기를 주기적으로 점검합니다. 무거운 물체는 높은 곳에 두지 마세요.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🏢 사무실 안전</h4>
                            <p>비상구 위치를 확인하고, 대피 경로에 장애물이 없는지 점검합니다. 장시간 컴퓨터 작업 시 적절한 휴식을 취합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🏪 상업 시설</h4>
                            <p>피난 안내도를 눈에 띄는 곳에 게시하고, 비상조명등과 유도등의 정상 작동을 확인합니다.</p>
                        </div>
                        <div className="guide-item">
                            <h4>🅿️ 주차장/지하공간</h4>
                            <p>환기 설비 작동 상태, 비상 대피로 표시, CCTV 작동 여부를 확인합니다. 비상벨 위치를 파악해두세요.</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
