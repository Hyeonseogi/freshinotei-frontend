import React, { useState, useEffect } from 'react';

// ✅ 부모(App.jsx)로부터 임시 스캔 데이터를 받을 수 있도록 props 추가
const ReceiptAnalyzingScreen = ({ tempScannedItems = [] }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const analyzingSteps = [
    "영수증 텍스트 추출 중...",
    "식재료 항목 분석 중...",
    "카테고리 분류 중...",
    "유통기한 예측 중..."
  ];

  // ✅ 부모로부터 데이터가 오면 그것을 보여주고, 없으면 시각적 효과를 위해 기본 임시 데이터 표시
  const displayItems = tempScannedItems.length > 0 
    ? tempScannedItems.map(item => `${item.name} ${item.qty}`) 
    : ["목록 추출 중...", "분석 준비..."];

  useEffect(() => {
    // App.jsx에서 setTimeout을 3500(3.5초)으로 설정했으므로, 
    // 프로그레스 바도 그 시간에 맞춰 100%가 되도록 duration을 3500으로 맞춥니다.
    const totalDuration = 3500; 
    const intervalTime = 100;
    const stepDuration = totalDuration / analyzingSteps.length;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
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

    return () => clearInterval(timer);
  }, [analyzingSteps.length]);

  return (
    <div className="w-full max-w-[400px] min-h-full mx-auto bg-[#F8F6F0] relative font-sans shadow-lg overflow-hidden flex flex-col">
      {/* 상단 헤더 */}
      <header className="px-5 pt-10 pb-4 flex justify-between items-center bg-[#F8F6F0] z-10">
        <div className="text-xl font-extrabold tracking-tight">
          <span className="text-[#4CAF50]">Freshi</span>
          <span className="text-[#FF9800]">Notei</span>
        </div>
        <div className="flex items-center gap-3 text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 px-6 pt-10 flex flex-col items-center">
        {/* 스캐닝 애니메이션 원형 영역 */}
        <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[5px] border-[#5E9B56] opacity-90 shadow-[0_0_25px_rgba(94,155,86,0.3)] animate-pulse"></div>
          {/* 영수증 아이콘 */}
          <div className="relative w-16 h-20 bg-white rounded flex flex-col shadow-sm border border-gray-100 p-2">
            <div className="w-full h-1 bg-[#5E9B56] mb-3 opacity-80 rounded-full"></div>
            <div className="w-3/4 h-1 bg-[#FF9800] mb-2 opacity-80 rounded-full"></div>
            <div className="w-full h-1 bg-[#5E9B56] mb-2 opacity-80 rounded-full"></div>
            <div className="w-1/2 h-1 bg-gray-300 mb-2 rounded-full"></div>
            <div className="absolute -bottom-2 left-0 w-full h-2 flex justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white"></div>
              ))}
            </div>
          </div>
          {/* 스캐닝 레이저 효과 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#84cc7a] shadow-[0_0_12px_#84cc7a] animate-[bounce_1.5s_infinite]"></div>
        </div>

        {/* 안내 텍스트 */}
        <h1 className="text-[22px] font-bold text-gray-800 mb-3 text-center tracking-tight">
          AI가 영수증을 분석하고 있어요
        </h1>
        <p className="text-[#6B7280] text-[15px] font-medium mb-12 h-6 transition-all duration-300">
          {analyzingSteps[stepIndex]}
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full mb-8">
          <div className="h-3 w-full bg-[#E5E0D8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5E9B56] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-500 font-medium">분석 중</span>
            <span className="text-[#5E9B56] font-bold">{Math.min(Math.round(progress), 100)}%</span>
          </div>
        </div>

        {/* 현재까지 인식된 항목 카드 */}
        <div className="w-full bg-white rounded-[20px] p-5 mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-gray-500 font-medium mb-3">현재까지 인식된 항목</p>
          <div className="flex flex-wrap gap-2.5">
            {displayItems.map((item, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-[#FAF8F3] text-gray-700 text-sm rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 하단 AI 자동 분석 인포 카드 */}
        <div className="w-full bg-[#F3F8F3] rounded-[20px] p-4 flex items-start gap-3 border border-[#E8F3E8]">
          <div className="text-[#5E9B56] mt-0.5 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-800 mb-1">AI 자동 분석</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed tracking-tight break-keep">
              유통기한이 없는 식재료는 AI가 평균 소비기한을 예측해드려요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptAnalyzingScreen;