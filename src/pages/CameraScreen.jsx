import React from 'react';

const CameraScreen = ({ onCapture, onClose }) => {
  return (
    <div className="w-full max-w-[400px] h-full mx-auto bg-[#1C1C1E] relative font-sans flex flex-col text-white">
      {/* 상단 헤더 */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        {/* ✅ 뒤로가기(닫기) 버튼 연동 */}
        <button onClick={onClose} className="p-2 -ml-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h1 className="text-lg font-bold">영수증 촬영</h1>
        <button className="p-2 -mr-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </header>

      {/* 카메라 스캔 영역 */}
      <main className="flex-1 flex flex-col items-center px-6 mt-8">
        {/* 스캔 프레임 */}
        <div className="relative w-full aspect-square bg-[#2C2C2E] rounded-2xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center mb-8">
          {/* 모서리 가이드 (초록색) */}
          <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-4 border-l-4 border-[#5E9B56] rounded-tl-2xl"></div>
          <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-4 border-r-4 border-[#5E9B56] rounded-tr-2xl"></div>
          <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-4 border-l-4 border-[#5E9B56] rounded-bl-2xl"></div>
          <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-4 border-r-4 border-[#5E9B56] rounded-br-2xl"></div>
          
          {/* 중앙 아이콘 및 텍스트 */}
          <svg className="w-12 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-300 text-sm text-center leading-relaxed font-medium">
            영수증을 프레임 안에 맞춰<br/>주세요
          </p>
        </div>

        {/* 팁 박스 */}
        <div className="w-full bg-[#2C2C2E] rounded-xl p-4 flex items-center gap-3">
          <div className="bg-[#3A3A3C] p-2 rounded-full flex-shrink-0">
            <span className="text-yellow-400 text-lg">💡</span>
          </div>
          <p className="text-sm text-gray-300">
            <span className="text-[#5E9B56] font-bold">Tip</span> 밝은 곳에서 촬영하면 AI 인식률이 높아져요
          </p>
        </div>
      </main>

      {/* 하단 컨트롤러 */}
      <footer className="pb-12 pt-6 flex flex-col items-center gap-6 relative">
        <div className="flex items-center justify-between w-full px-12 relative">
          
          {/* ✅ 갤러리 버튼에도 onCapture 연결 (파일 창 열기) */}
          <button 
            onClick={onCapture} 
            className="w-12 h-12 bg-[#2C2C2E] rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#3C3C3E] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          
          {/* ✅ 촬영 셔터 버튼 (파일 창 열기) */}
          <button 
            onClick={onCapture} 
            className="w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-[68px] h-[68px] bg-white rounded-full shadow-inner"></div>
          </button>

          {/* 중앙 정렬을 맞추기 위한 투명 더미 박스 */}
          <div className="w-12 h-12"></div>
        </div>
        
        <p className="text-xs text-gray-500 font-medium">
          영수증 · 식재료 라벨 · 유통기한 모두 인식 가능
        </p>
      </footer>
    </div>
  );
};

export default CameraScreen;