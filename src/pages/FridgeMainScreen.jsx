import React from 'react';
import { getUrgencyStyles } from '../utils/colorMapper';

// 💡 컴포넌트 외부에 선언하여 렌더링 성능 최적화
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

const getIcon = (name, category) => {
  for (const key in specificIcons) {
    if (name.includes(key)) return specificIcons[key];
  }
  return categoryIcons[category] || "📦";
};

// ✅ onDelete 대신 onDeleteAll 프롭스를 받습니다.
const FridgeMainScreen = ({ fridgeItems, onGoToCamera, onDeleteAll, onGoToNotifications }) => {
  const itemsToRender = Array.isArray(fridgeItems) ? fridgeItems : [];
  
  const expiringCount = itemsToRender.filter(item => 
    ['TODAY', 'URGENT', 'SOON'].includes(item.urgency?.toUpperCase())
  ).length;

  return (
    <div className="w-full max-w-[400px] h-full mx-auto bg-[#F8F6F0] relative font-sans flex flex-col">
      <header className="px-6 pt-12 pb-2 flex justify-between items-center">
        <h1 className="text-xl font-extrabold tracking-tight">내 냉장고</h1>
        <div className="flex gap-4 text-gray-600">
          <button onClick={onGoToCamera} className="hover:text-[#5E9B56] transition-colors">
            {/* 카메라 아이콘 */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          
          {/* 종(알림) 모양 변경 및 클릭 연결 */}
          <button onClick={onGoToNotifications} className="hover:text-[#5E9B56] transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0.5 w-2 h-2 bg-[#C95252] rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="px-6 pt-4 pb-6">
        <h2 className="text-[24px] font-bold text-gray-800 tracking-tight">
          총 <span className="text-[#5E9B56]">{itemsToRender.length}개</span>의 식재료가 있어요
        </h2>
        {expiringCount > 0 && (
          <p className="text-[#C95252] text-sm mt-1 font-medium">{expiringCount}개가 곧 상해요</p>
        )}
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-24">
        
        {/* ✅ 정렬 텍스트와 '전체 비우기' 버튼 나란히 배치 */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">긴급 소비 순으로 정렬</span>
          {itemsToRender.length > 0 && (
            <button 
              onClick={onDeleteAll}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#C95252] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              전체 비우기
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {itemsToRender.map((item) => {
            const { ingredient, daysLeft, urgency } = item;
            const styles = getUrgencyStyles(urgency);

            return (
              <div key={ingredient.id} className={`bg-white rounded-[16px] shadow-sm p-4 flex items-center justify-between border-l-[6px] relative ${styles.border}`}>
                
                {/* ❌ 개별 삭제 X 버튼 제거됨 */}

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">
                    {getIcon(ingredient.name, ingredient.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{ingredient.name}</h3>
                    <p className="text-sm text-gray-500">{ingredient.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-400 font-medium">남은 기한</p>
                  <p className="text-base font-semibold text-gray-700">
                    {daysLeft < 0 ? `D+${Math.abs(daysLeft)}` : `D-${daysLeft}`}
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

      <nav className="absolute bottom-0 w-full h-[72px] bg-white border-t border-gray-100 flex justify-between items-center px-6 pb-2 z-10">
        <div 
          onClick={() => alert('💡 아이디어톤 프로토타입: [홈] 화면은 현재 준비 중입니다.')} 
          className="flex flex-col items-center gap-1 text-gray-400 w-1/4 cursor-pointer hover:text-[#5E9B56] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-medium">홈</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#5E9B56] w-1/4 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          <span className="text-[10px] font-bold">냉장고</span>
        </div>
        <div 
          onClick={() => alert('💡 아이디어톤 프로토타입: AI 맞춤형 [레시피 추천] 기능은 개발 예정입니다.')} 
          className="flex flex-col items-center gap-1 text-gray-400 w-1/4 cursor-pointer hover:text-[#5E9B56] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="text-[10px] font-medium">레시피</span>
        </div>
        <div 
          onClick={() => alert('💡 아이디어톤 프로토타입: [마이페이지] 설정 화면은 준비 중입니다.')} 
          className="flex flex-col items-center gap-1 text-gray-400 w-1/4 cursor-pointer hover:text-[#5E9B56] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-medium">마이</span>
        </div>
      </nav>
    </div>
  );
};

export default FridgeMainScreen;