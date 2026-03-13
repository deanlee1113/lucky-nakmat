// 🔮 사주팔자 계산 엔진
// 만세력 기반 사주 계산 및 오행 분석

class SajuCalculator {
    constructor() {
        // 십간(天干)
        this.HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.STEM_NAMES = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        
        // 십이지(地支)
        this.EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        this.BRANCH_NAMES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        this.BRANCH_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
        
        // 오행 매핑
        this.STEM_ELEMENTS = {
            '甲': '木', '乙': '木',
            '丙': '火', '丁': '火',
            '戊': '土', '己': '土',
            '庚': '金', '辛': '金',
            '壬': '水', '癸': '水'
        };
        
        this.BRANCH_ELEMENTS = {
            '子': '水', '亥': '水',
            '寅': '木', '卯': '木',
            '巳': '火', '午': '火',
            '申': '金', '酉': '金',
            '丑': '土', '辰': '土', '未': '土', '戌': '土'
        };
        
        // 지지 시간 매핑
        this.TIME_TO_BRANCH = [
            { start: 23, end: 1, branch: '子', index: 0 },
            { start: 1, end: 3, branch: '丑', index: 1 },
            { start: 3, end: 5, branch: '寅', index: 2 },
            { start: 5, end: 7, branch: '卯', index: 3 },
            { start: 7, end: 9, branch: '辰', index: 4 },
            { start: 9, end: 11, branch: '巳', index: 5 },
            { start: 11, end: 13, branch: '午', index: 6 },
            { start: 13, end: 15, branch: '未', index: 7 },
            { start: 15, end: 17, branch: '申', index: 8 },
            { start: 17, end: 19, branch: '酉', index: 9 },
            { start: 19, end: 21, branch: '戌', index: 10 },
            { start: 21, end: 23, branch: '亥', index: 11 }
        ];
        
        // 월간 계산표 (오호송)
        this.MONTH_GAN_MAP = {
            '甲': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
            '乙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
            '丙': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
            '丁': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            '戊': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
            '己': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
            '庚': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
            '辛': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
            '壬': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            '癸': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙']
        };
        
        // 시간 계산표
        this.HOUR_GAN_MAP = {
            '甲': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
            '乙': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
            '丙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
            '丁': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
            '戊': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            '己': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
            '庚': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
            '辛': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
            '壬': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
            '癸': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        };
    }
    
    // 년주 계산
    calculateYearPillar(year) {
        const ganIndex = (year - 4) % 10;
        const jiIndex = (year - 4) % 12;
        
        const gan = this.HEAVENLY_STEMS[ganIndex];
        const ji = this.EARTHLY_BRANCHES[jiIndex];
        
        return {
            gan,
            ji,
            ganName: this.STEM_NAMES[ganIndex],
            jiName: this.BRANCH_NAMES[jiIndex],
            animal: this.BRANCH_ANIMALS[jiIndex],
            ganElement: this.STEM_ELEMENTS[gan],
            jiElement: this.BRANCH_ELEMENTS[ji],
            display: `${gan}${ji}(${this.STEM_NAMES[ganIndex]}${this.BRANCH_NAMES[jiIndex]})`
        };
    }
    
    // 월주 계산 (간단 버전 - 입춘 미고려)
    calculateMonthPillar(year, month) {
        const yearPillar = this.calculateYearPillar(year);
        const yearGan = yearPillar.gan;
        
        // 월은 인월(寅月)부터 시작 (1월 = 인월)
        const monthIndex = (month + 1) % 12; // 1월 → 2(寅), 2월 → 3(卯)...
        
        const ganList = this.MONTH_GAN_MAP[yearGan];
        const gan = ganList[month - 1]; // 배열은 0부터 시작
        const ji = this.EARTHLY_BRANCHES[monthIndex];
        const jiIndex = monthIndex;
        
        return {
            gan,
            ji,
            ganName: this.STEM_NAMES[this.HEAVENLY_STEMS.indexOf(gan)],
            jiName: this.BRANCH_NAMES[jiIndex],
            ganElement: this.STEM_ELEMENTS[gan],
            jiElement: this.BRANCH_ELEMENTS[ji],
            display: `${gan}${ji}(${this.STEM_NAMES[this.HEAVENLY_STEMS.indexOf(gan)]}${this.BRANCH_NAMES[jiIndex]})`
        };
    }
    
    // 일주 계산 (근사 계산법)
    calculateDayPillar(year, month, day) {
        // 기준일: 1900년 1월 1일 = 갑자일(甲子日)
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        const ganIndex = (diffDays + 0) % 10;
        const jiIndex = (diffDays + 0) % 12;
        
        const gan = this.HEAVENLY_STEMS[ganIndex];
        const ji = this.EARTHLY_BRANCHES[jiIndex];
        
        return {
            gan,
            ji,
            ganName: this.STEM_NAMES[ganIndex],
            jiName: this.BRANCH_NAMES[jiIndex],
            ganElement: this.STEM_ELEMENTS[gan],
            jiElement: this.BRANCH_ELEMENTS[ji],
            display: `${gan}${ji}(${this.STEM_NAMES[ganIndex]}${this.BRANCH_NAMES[jiIndex]})`
        };
    }
    
    // 시주 계산
    calculateHourPillar(dayGan, hour) {
        if (hour === null || hour === undefined) {
            return null; // 시간 모름
        }
        
        // 시간 → 지지 찾기
        let jiIndex = 0;
        for (let timeSlot of this.TIME_TO_BRANCH) {
            if (hour >= timeSlot.start && hour < timeSlot.end) {
                jiIndex = timeSlot.index;
                break;
            }
            // 23시 예외 처리
            if (hour >= 23) {
                jiIndex = 0; // 자시
                break;
            }
        }
        
        const ji = this.EARTHLY_BRANCHES[jiIndex];
        const ganList = this.HOUR_GAN_MAP[dayGan];
        const gan = ganList[jiIndex];
        
        return {
            gan,
            ji,
            ganName: this.STEM_NAMES[this.HEAVENLY_STEMS.indexOf(gan)],
            jiName: this.BRANCH_NAMES[jiIndex],
            ganElement: this.STEM_ELEMENTS[gan],
            jiElement: this.BRANCH_ELEMENTS[ji],
            display: `${gan}${ji}(${this.STEM_NAMES[this.HEAVENLY_STEMS.indexOf(gan)]}${this.BRANCH_NAMES[jiIndex]})`
        };
    }
    
    // 전체 사주 계산
    calculate(birthYear, birthMonth, birthDay, birthHour = null) {
        const year = this.calculateYearPillar(birthYear);
        const month = this.calculateMonthPillar(birthYear, birthMonth);
        const day = this.calculateDayPillar(birthYear, birthMonth, birthDay);
        const hour = birthHour !== null ? this.calculateHourPillar(day.gan, birthHour) : null;
        
        // 오행 분석
        const elements = this.analyzeElements(year, month, day, hour);
        
        return {
            year,
            month,
            day,
            hour,
            elements,
            display: this.formatDisplay(year, month, day, hour)
        };
    }
    
    // 오행 분석
    analyzeElements(year, month, day, hour) {
        const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
        
        // 년/월/일주 천간, 지지
        for (let pillar of [year, month, day]) {
            elements[pillar.ganElement]++;
            elements[pillar.jiElement]++;
        }
        
        // 시주 (있는 경우만)
        if (hour) {
            elements[hour.ganElement]++;
            elements[hour.jiElement]++;
        }
        
        // 강약 분석
        const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
        
        return {
            counts: elements,
            strongest: sorted[0][0],
            strongestCount: sorted[0][1],
            weakest: sorted[sorted.length - 1][0],
            weakestCount: sorted[sorted.length - 1][1],
            balance: sorted[0][1] - sorted[sorted.length - 1][1]
        };
    }
    
    // 출력 포맷
    formatDisplay(year, month, day, hour) {
        let result = `년주: ${year.display}\n`;
        result += `월주: ${month.display}\n`;
        result += `일주: ${day.display}\n`;
        if (hour) {
            result += `시주: ${hour.display}`;
        } else {
            result += `시주: 미상`;
        }
        return result;
    }
    
    // 신살 계산
    calculateSpirits(saju) {
        const spirits = {
            lucky: [],  // 길신
            unlucky: [] // 흉신
        };
        
        // 천을귀인 체크
        if (this.hasTianYi(saju.day.gan, [saju.year.ji, saju.month.ji, saju.day.ji])) {
            spirits.lucky.push({
                name: '천을귀인',
                level: 5,
                description: '최고의 행운! 대어 확률 상승'
            });
        }
        
        // 역마살 체크
        if (this.hasYeokMa(saju.year.ji, [saju.month.ji, saju.day.ji])) {
            spirits.lucky.push({
                name: '역마살',
                level: 4,
                description: '먼 거리 출조가 유리합니다'
            });
        }
        
        // 백호살 체크
        if (this.hasBaekHo(saju.year.ji, [saju.month.ji, saju.day.ji])) {
            spirits.unlucky.push({
                name: '백호살',
                level: 5,
                description: '사고, 부상 위험 - 안전 주의!'
            });
        }
        
        return spirits;
    }
    
    // 천을귀인 체크
    hasTianYi(dayGan, branches) {
        const tianYiMap = {
            '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
            '乙': ['子', '申'], '己': ['子', '申'],
            '丙': ['亥', '酉'], '丁': ['亥', '酉'],
            '壬': ['巳', '卯'], '癸': ['巳', '卯'],
            '辛': ['寅', '午']
        };
        
        const nobles = tianYiMap[dayGan] || [];
        return branches.some(ji => nobles.includes(ji));
    }
    
    // 역마살 체크
    hasYeokMa(yearJi, branches) {
        const yeokMaMap = {
            '寅': '申', '午': '申', '戌': '申',
            '申': '寅', '子': '寅', '辰': '寅',
            '巳': '亥', '酉': '亥', '丑': '亥',
            '亥': '巳', '卯': '巳', '未': '巳'
        };
        
        const yeokMa = yeokMaMap[yearJi];
        return branches.includes(yeokMa);
    }
    
    // 백호살 체크
    hasBaekHo(yearJi, branches) {
        const baekHoMap = {
            '寅': '申', '卯': '申',
            '申': '寅', '酉': '寅',
            '巳': '亥', '午': '亥',
            '亥': '巳', '子': '巳'
        };
        
        const baekHo = baekHoMap[yearJi];
        return branches.includes(baekHo);
    }
}

// 전역 인스턴스 생성
const sajuCalculator = new SajuCalculator();
