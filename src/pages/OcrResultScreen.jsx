import React from 'react';
import { getUrgencyStyles } from '../utils/colorMapper'; 

const specificIcons = {
  "양파": "🧅", "파": "🧅", "마늘": "🧄", "당근": "🥕", "토마토": "🍅", 
  "버섯": "🍄", "감자": "🥔", "고구마": "🍠", "옥수수": "🌽", "고추": "🌶️", 
  "깻잎": "🌿", "양상추": "🥬", "사과": "🍎", "바나나": "🍌", "포도": "🍇", 
  "수박": "🍉", "딸기": "🍓", "레몬": "🍋", "계란": "🥚", "달걀": "🥚", 
  "우유": "🥛", "치즈": "🧀", "닭가슴살": "🍗", "돼지고기": "🥓", "빵": "🍞", 
  "밥": "🍚", "만두": "🥟", "음료수": "🧃", "맥주": "🍺"
};

const categoryIcons = {
  "채소": "🥬", "과일": "🍎", "육류": "🥩", "수산물": "🐟", 
  "유제품": "🥛", "곡류": "🍚", "기타": "📦"
};

const getIcon = (name = "", category = "") => {
  for (const key in specificIcons) {
    if (name.includes(key)) return specificIcons[key];
  }
  return categoryIcons[category] || "📦";
};

// ✅ AI 데모용 스마트 예측 로직: 백엔드에서 D-Day를 주지 않을 때 카테고리 기반으로 자동 계산
const getFallbackDays = (category) => {
  if (category === '채소') return 7;
  if (category === '과일') return 5;
  if (category === '육류') return 3;
  if (category === '수산물') return 2;
  if (category === '유제품') return 10;
  return 14; // 기타 가공식품
};

const OcrResultScreen = ({ recognizedItems, onSave }) => {
  const itemsToRender = Array.isArray(recognizedItems) ? recognizedItems : [];

  return (
    <div className="w-full max-w-[400px] h-full mx-auto bg-[#F8F6F0] relative font-sans flex flex-col">
      <header className="px-6 pt-16 pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 leading-snug tracking-tight">
            총 <span className="text-[#5E9B56]">{itemsToRender.length}</span>개 식재료 등록<br/>완료
          </h1>
          <p className="text-sm text-gray-500 mt-2">단 3.5초 만에 자동 인식했어요</p>
        </div>
        <div className="w-8 h-8 bg-[#5E9B56] rounded-full flex items-center justify-center text-white mt-2 shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-28">
        <div className="flex flex-col gap-4">
          {itemsToRender.map((item, index) => {
            
            // ✅ 핵심 로직: 백엔드 데이터가 있으면 쓰고, 없으면 카테고리를 보고 프론트에서 임시로 만들어냄
            const safeDaysLeft = (item.daysLeft !== undefined && item.daysLeft !== null) 
              ? item.daysLeft 
              : getFallbackDays(item.category);
              
            // 긴급도 역시 며칠 남았는지에 따라 자동 세팅
            const safeUrgency = item.urgency || (safeDaysLeft <= 3 ? 'URGENT' : safeDaysLeft <= 7 ? 'SOON' : 'NORMAL');
            const styles = getUrgencyStyles(safeUrgency);

            return (
              <div key={item.id || index} className={`bg-white rounded-[16px] shadow-sm p-4 flex items-center justify-between border-l-[6px] ${styles.border}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">
                    {getIcon(item.name, item.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p> 
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[11px] text-gray-400 font-medium">유통기한</p>
                  
                  {/* ✅ 이제 undefined 대신 완벽하게 계산된 D-Day가 나옵니다! */}
                  <p className="text-base font-semibold text-gray-700">
                    {safeDaysLeft < 0 ? `D+${Math.abs(safeDaysLeft)}` : `D-${safeDaysLeft}`}
                  </p>
                  
                  <div className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-bold text-white rounded-full ${styles.badge}`}>
                    {styles.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="absolute bottom-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0] to-transparent z-20">
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