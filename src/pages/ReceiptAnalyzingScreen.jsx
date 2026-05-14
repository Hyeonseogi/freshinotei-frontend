import React, { useState, useEffect, useRef } from 'react';

// ✅ tempScannedItems: [{ name: "깻잎", qty: "1봉" }, { name: "우유", qty: "1팩" }, ...] 형태의 실제 데이터
const ReceiptAnalyzingScreen = ({ tempScannedItems = [] }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // ✅ 화면에 실시간으로 '나타난' 아이템들만 담는 상태
  const [animatedItems, setAnimatedItems] = useState([]);
  const displayedCount = useRef(0);

  const analyzingSteps = [
    "영수증 텍스트 추출 중...",
    "식재료 항목 분석 중...",
    "카테고리 분류 중...",
    "유통기한 예측 중..."
  ];

  useEffect(() => {
    const totalDuration = 3500; 
    const intervalTime = 100;
    const stepDuration = totalDuration / analyzingSteps.length;

    // 1. 프로그레스 바 및 단계 메시지 타이머
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        const currentElapsedTime = (prev / 100) * totalDuration;
        const currentStep = Math.min(
          Math.floor(currentElapsedTime / stepDuration),
          analyzingSteps.length - 1
        );
        setStepIndex(currentStep);
        return prev + (100 / (totalDuration / intervalTime));
      });
    }, intervalTime);

    // ✅ 2. 실제 데이터(tempScannedItems)를 하나씩 화면에 추가하는 로직
    // 데이터가 들어온 시점부터 0.5초 간격으로 하나씩animatedItems에 추가합니다.
    if (tempScannedItems.length > 0) {
      const itemTimer = setInterval(() => {
        if (displayedCount.current < tempScannedItems.length) {
          const nextItem = tempScannedItems[displayedCount.current];
          // "이름 + 수량" 형태로 변환 (수량이 없으면 이름만)
          const itemText = nextItem.qty ? `${nextItem.name} ${nextItem.qty}` : nextItem.name;
          
          setAnimatedItems(prev => [...prev, itemText]);
          displayedCount.current += 1;
        } else {
          clearInterval(itemTimer);
        }
      }, 500); // 0.5초 간격으로 실제 데이터 출력

      return () => {
        clearInterval(progressTimer);
        clearInterval(itemTimer);
      };
    }

    return () => clearInterval(progressTimer);
  }, [tempScannedItems]); // 실제 인식 데이터가 변경/입력될 때마다 이펙트 실행

  return (
    <div className="w-full max-w-[400px] min-h-full mx-auto bg-[#F8F6F0] relative font-sans shadow-lg overflow-hidden flex flex-col">
      <header className="px-5 pt-10 pb-4 flex justify-between items-center bg-[#F8F6F0] z-10">
        <div className="text-xl font-extrabold tracking-tight">
          <span className="text-[#4CAF50]">Freshi</span>
          <span className="text-[#FF9800]">Notei</span>
        </div>
      </header>

      <main className="flex-1 px-6 pt-10 flex flex-col items-center">
        {/* 스캐닝 애니메이션 원형 영역 */}
        <div className="relative w-44 h-44 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[5px] border-[#5E9B56] opacity-90 shadow-[0_0_25px_rgba(94,155,86,0.3)] animate-pulse"></div>
          <div className="relative w-16 h-20 bg-white rounded flex flex-col shadow-sm border border-gray-100 p-2 overflow-hidden">
            <div className="w-full h-1 bg-[#5E9B56] mb-3 opacity-80 rounded-full"></div>
            <div className="w-3/4 h-1 bg-[#FF9800] mb-2 opacity-80 rounded-full"></div>
            <div className="w-full h-1 bg-[#5E9B56] mb-2 opacity-80 rounded-full"></div>
            <div className="w-1/2 h-1 bg-gray-300 mb-2 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-[#5E9B56] shadow-[0_0_8px_#5E9B56] animate-scan-line"></div>
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-gray-800 mb-3 text-center tracking-tight">
          AI가 영수증을 분석하고 있어요
        </h1>
        <p className="text-[#6B7280] text-[15px] font-medium mb-12 h-6">
          {analyzingSteps[stepIndex]}
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full mb-8">
          <div className="h-3 w-full bg-[#E5E0D8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5E9B56] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-500 font-medium">분석 중</span>
            <span className="text-[#5E9B56] font-bold">{Math.min(Math.round(progress), 100)}%</span>
          </div>
        </div>

        {/* ✅ 실제 인식된 항목 카드 (실제 데이터 실시간 출력) */}
        <div className="w-full bg-white rounded-[20px] p-5 mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[140px]">
          <p className="text-[13px] text-gray-500 font-medium mb-3">현재까지 인식된 항목</p>
          <div className="flex flex-wrap gap-2.5">
            {animatedItems.length > 0 ? (
              animatedItems.map((item, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-[#FAF8F3] text-gray-700 text-sm rounded-full font-medium animate-pop-in"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-300 italic">항목을 추출하고 있습니다...</span>
            )}
          </div>
        </div>

        {/* 하단 인포 카드 */}
        <div className="w-full bg-[#F3F8F3] rounded-[20px] p-4 flex items-start gap-3 border border-[#E8F3E8]">
          <div className="text-[#5E9B56] mt-0.5 shrink-0">💡</div>
          <p className="text-[12px] text-gray-500 leading-relaxed tracking-tight break-keep">
            인식된 식재료는 내 냉장고에 카테고리별로 자동 분류되어 저장됩니다.
          </p>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
        .animate-scan-line { animation: scan-line 1.5s linear infinite; }
      `}} />
    </div>
  );
};

export default ReceiptAnalyzingScreen;