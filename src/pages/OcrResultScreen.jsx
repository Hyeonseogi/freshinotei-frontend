import React from 'react';

const OcrResultScreen = ({ recognizedItems, onSave }) => {
  const getColorStyles = (color) => {
    switch(color) {
      case 'red': return { border: 'border-l-[#C95252]', badge: 'bg-[#C95252]' };
      case 'orange': return { border: 'border-l-[#E08D45]', badge: 'bg-[#E08D45]' };
      case 'green': return { border: 'border-l-[#5E9B56]', badge: 'bg-[#5E9B56]' };
      default: return { border: 'border-l-gray-400', badge: 'bg-gray-400' };
    }
  };

  // ✅ 안전장치: recognizedItems가 배열이 아닐 경우(데이터가 없을 때) 빈 배열로 처리하여 에러 방지
  const itemsToRender = Array.isArray(recognizedItems) ? recognizedItems : [];

  return (
    <div className="w-full max-w-[400px] h-screen mx-auto bg-[#F8F6F0] relative font-sans flex flex-col">
      {/* 헤더 타이틀 */}
      <header className="px-6 pt-16 pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 leading-snug tracking-tight">
            {/* ✅ 하드코딩된 '4' 대신 인식된 실제 개수로 변경 */}
            총 <span className="text-[#5E9B56]">{itemsToRender.length}</span>개 식재료 등록<br/>완료
          </h1>
          <p className="text-sm text-gray-500 mt-2">단 3.5초 만에 자동 인식했어요</p>
        </div>
        <div className="w-8 h-8 bg-[#5E9B56] rounded-full flex items-center justify-center text-white mt-2 shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
      </header>

      {/* 스크롤 가능한 리스트 영역 */}
      <main className="flex-1 overflow-y-auto px-6 pb-28">
        <div className="flex flex-col gap-4">
          {/* ✅ recognizedItems 대신 안전한 itemsToRender 사용 */}
          {itemsToRender.map((item) => {
            const styles = getColorStyles(item.color);
            return (
              <div key={item.id} className={`bg-white rounded-[16px] shadow-sm p-4 flex items-center justify-between border-l-[6px] ${styles.border}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.qty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-400 font-medium">유통기한</p>
                  <p className="text-base font-semibold text-gray-700">{item.date}</p>
                  <div className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-bold text-white rounded-full ${styles.badge}`}>
                    {item.dDay}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="absolute bottom-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0] to-transparent">
        <button 
            onClick={onSave} 
            className="w-full py-4 bg-[#5E9B56] hover:bg-[#4d8246] transition-colors text-white font-bold text-lg rounded-xl shadow-lg active:scale-[0.98]">
            냉장고에 자동 저장하기
      </button>
      </div>
    </div>
  );
};

export default OcrResultScreen;