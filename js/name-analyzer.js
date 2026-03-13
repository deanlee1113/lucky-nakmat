// ✨ 성명학 분석 엔진
// 한글 이름 → 소리오행 매핑 및 사주 궁합 분석

class NameAnalyzer {
    constructor() {
        // 초성 → 오행 매핑
        this.CONSONANT_ELEMENTS = {
            // 木 (나무)
            'ㄱ': '木', 'ㄲ': '木', 'ㅋ': '木',
            
            // 火 (불)
            'ㄴ': '火', 'ㄷ': '火', 'ㄸ': '火', 'ㄹ': '火', 'ㅌ': '火',
            
            // 土 (흙)
            'ㅇ': '土', 'ㅎ': '土',
            
            // 金 (쇠)
            'ㅈ': '金', 'ㅉ': '金', 'ㅊ': '金', 'ㅅ': '金', 'ㅆ': '金',
            
            // 水 (물)
            'ㅁ': '水', 'ㅂ': '水', 'ㅃ': '水', 'ㅍ': '水'
        };
        
        // 오행 이름
        this.ELEMENT_NAMES = {
            '木': '목(木)',
            '火': '화(火)',
            '土': '토(土)',
            '金': '금(金)',
            '水': '수(水)'
        };
        
        // 오행 색상
        this.ELEMENT_COLORS = {
            '木': '#22c55e', // 초록
            '火': '#ef4444', // 빨강
            '土': '#f59e0b', // 주황/노랑
            '金': '#d4af37', // 금색
            '水': '#3b82f6'  // 파랑
        };
        
        // 상생(相生) 관계
        this.SUPPORT_MAP = {
            '木': '火', // 목생화
            '火': '土', // 화생토
            '土': '金', // 토생금
            '金': '水', // 금생수
            '水': '木'  // 수생목
        };
        
        // 상극(相剋) 관계
        this.COUNTER_MAP = {
            '木': '土', // 목극토
            '火': '金', // 화극금
            '土': '水', // 토극수
            '金': '木', // 금극목
            '水': '火'  // 수극화
        };
    }
    
    // 한글 초성 추출
    getInitialConsonant(char) {
        const code = char.charCodeAt(0) - 0xAC00;
        
        if (code < 0 || code > 11171) {
            return null; // 한글이 아님
        }
        
        const initialIndex = Math.floor(code / 588);
        const initials = [
            'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
            'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
        ];
        
        return initials[initialIndex];
    }
    
    // 초성 → 오행 변환
    consonantToElement(consonant) {
        return this.CONSONANT_ELEMENTS[consonant] || null;
    }
    
    // 이름 전체 분석
    analyzeName(name) {
        if (!name || name.trim() === '') {
            return null;
        }
        
        const chars = name.trim().split('');
        const analysis = {
            name: name.trim(),
            characters: [],
            elements: { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 },
            dominant: null,
            elementList: []
        };
        
        for (let char of chars) {
            const initial = this.getInitialConsonant(char);
            const element = this.consonantToElement(initial);
            
            if (element) {
                analysis.characters.push({
                    char,
                    initial,
                    element,
                    elementName: this.ELEMENT_NAMES[element]
                });
                analysis.elements[element]++;
                analysis.elementList.push(element);
            }
        }
        
        // 가장 많은 오행
        const sorted = Object.entries(analysis.elements)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
        
        if (sorted.length > 0) {
            analysis.dominant = sorted[0][0];
        }
        
        return analysis;
    }
    
    // 사주-이름 궁합 계산
    calculateCompatibility(sajuElements, nameAnalysis) {
        if (!nameAnalysis) {
            return null;
        }
        
        let score = 50;
        let feedback = [];
        
        // 사주의 가장 약한 오행
        const weakest = Object.entries(sajuElements.counts)
            .sort((a, b) => a[1] - b[1])[0];
        
        // 이름이 약한 오행을 보완하는가?
        if (nameAnalysis.elements[weakest[0]] > 0) {
            score += 25;
            feedback.push(`사주에 부족한 ${this.ELEMENT_NAMES[weakest[0]]} 기운을 이름이 보완해줍니다 ✅`);
        }
        
        // 이름의 주요 오행
        const nameDominant = nameAnalysis.dominant;
        
        if (nameDominant) {
            // 상생 관계 체크
            if (this.SUPPORT_MAP[nameDominant] === weakest[0]) {
                score += 15;
                feedback.push(`이름의 ${this.ELEMENT_NAMES[nameDominant]} 기운이 사주를 생(生)합니다`);
            }
            
            // 상극 관계 체크 (과한 경우 감점)
            if (this.COUNTER_MAP[nameDominant] === sajuElements.strongest) {
                score -= 10;
                feedback.push(`이름이 사주의 강한 기운을 견제합니다`);
            }
            
            // 이름 자체의 균형
            const elementValues = Object.values(nameAnalysis.elements).filter(v => v > 0);
            if (elementValues.length >= 2) {
                score += 5;
                feedback.push(`이름 자체가 균형잡혀 있습니다`);
            }
        }
        
        // 점수 범위 제한
        score = Math.min(Math.max(score, 0), 100);
        
        return {
            score,
            grade: this.getCompatibilityGrade(score),
            feedback: feedback.length > 0 ? feedback.join('\n') : '평범한 궁합입니다'
        };
    }
    
    // 궁합 등급
    getCompatibilityGrade(score) {
        if (score >= 90) return { stars: '⭐⭐⭐⭐⭐', text: '완벽한 궁합!' };
        if (score >= 75) return { stars: '⭐⭐⭐⭐☆', text: '좋은 궁합' };
        if (score >= 60) return { stars: '⭐⭐⭐☆☆', text: '평범한 궁합' };
        if (score >= 40) return { stars: '⭐⭐☆☆☆', text: '약간 불균형' };
        return { stars: '⭐☆☆☆☆', text: '주의 필요' };
    }
    
    // 오늘 이름 기운 작용 판단
    getTodayNameEffect(nameAnalysis, fishingDayElement) {
        if (!nameAnalysis || !nameAnalysis.dominant) {
            return null;
        }
        
        const nameDominant = nameAnalysis.dominant;
        
        // 상생 관계
        if (this.SUPPORT_MAP[nameDominant] === fishingDayElement) {
            return {
                effect: '상승',
                icon: '↑',
                message: `이름의 ${this.ELEMENT_NAMES[nameDominant]} 기운이 오늘 ${this.ELEMENT_NAMES[fishingDayElement]} 낚시 운세와 잘 맞아 조황 운이 한층 더 상승합니다! 🎣`
            };
        }
        
        // 상극 관계
        if (this.COUNTER_MAP[nameDominant] === fishingDayElement) {
            return {
                effect: '감소',
                icon: '↓',
                message: `이름의 기운이 오늘과 맞지 않아 조황이 평소보다 낮을 수 있습니다.`
            };
        }
        
        // 중립
        return {
            effect: '보통',
            icon: '→',
            message: `이름의 기운이 오늘 낚시 운세에 중립적으로 작용합니다.`
        };
    }
    
    // 낚시 운세 추천 (이름 기반)
    getFishingRecommendation(nameAnalysis) {
        if (!nameAnalysis || !nameAnalysis.dominant) {
            return null;
        }
        
        const dominant = nameAnalysis.dominant;
        
        const recommendations = {
            '木': {
                direction: '동쪽',
                directionDetail: '동쪽 포인트가 특히 유리합니다',
                color: '초록색, 연두색',
                colorDetail: '초록 계열 장비나 루어 사용',
                fish: '붕어, 잉어, 쏘가리',
                fishDetail: '민물 어종과 인연이 깊습니다',
                time: '새벽 (오전 5~7시)',
                timeDetail: '이른 아침 시간대 추천',
                method: '민물낚시, 루어낚시',
                environment: '강, 계곡, 저수지',
                tip: '나무와 수초가 많은 곳이 유리합니다'
            },
            '火': {
                direction: '남쪽',
                directionDetail: '남쪽 방향 포인트 선택',
                color: '빨간색, 주황색',
                colorDetail: '붉은 계열 루어가 효과적',
                fish: '농어, 감성돔, 참돔',
                fishDetail: '활동적인 어종 노림',
                time: '한낮 (오전 11시~오후 1시)',
                timeDetail: '햇빛이 강한 시간대',
                method: '루어낚시, 플라이낚시',
                environment: '양지, 햇빛 잘 드는 곳',
                tip: '활발한 움직임이 필요한 낚시가 좋습니다'
            },
            '土': {
                direction: '중앙',
                directionDetail: '사방 어디든 무난합니다',
                color: '노란색, 갈색',
                colorDetail: '흙 계열 채비 사용',
                fish: '메기, 미꾸라지, 장어',
                fishDetail: '바닥층 서식 어종',
                time: '오후 (오후 1~3시)',
                timeDetail: '오후 시간대가 안정적',
                method: '생미끼 채비, 바닥낚시',
                environment: '펄 지형, 흙냄새 나는 곳',
                tip: '묵직하고 안정적인 낚시를 즐기세요'
            },
            '金': {
                direction: '서쪽',
                directionDetail: '서쪽 포인트 노려보세요',
                color: '은색, 금색, 흰색',
                colorDetail: '메탈 계열 루어 추천',
                fish: '방어, 부시리, 삼치',
                fishDetail: '회유성 어종과 인연',
                time: '저녁 (오후 5~7시)',
                timeDetail: '해질녘 시간대 유리',
                method: '지깅, 루어낚시',
                environment: '바위 지형, 암초 지대',
                tip: '단단한 바위 주변을 공략하세요'
            },
            '水': {
                direction: '북쪽',
                directionDetail: '북쪽 방향이 가장 좋습니다',
                color: '검정색, 파란색, 남색',
                colorDetail: '어두운 계열 장비 선택',
                fish: '광어, 우럭, 대구',
                fishDetail: '바다 바닥층 어종',
                time: '밤 (오후 9시~새벽 1시)',
                timeDetail: '야간 낚시 추천',
                method: '선상낚시, 깊은 수심 탐사',
                environment: '바다, 깊은 호수',
                tip: '깊은 수심을 집중 공략하세요'
            }
        };
        
        return recommendations[dominant];
    }
    
    // 성명학 추천 행동
    getNameActionTip(name) {
        return `출발 전 "${name}"를 한 번 크게 말하고 가면 이름의 기운이 활성화됩니다`;
    }
}

// 전역 인스턴스 생성
const nameAnalyzer = new NameAnalyzer();
