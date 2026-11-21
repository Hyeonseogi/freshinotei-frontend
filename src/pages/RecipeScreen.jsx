// src/pages/RecipeScreen.jsx
// 레시피 추천 화면: 로딩 → 결과 카드(또는 빈 냉장고 / 오류) 순서로 보여줍니다.
// 요청은 App.jsx가 보내고, 이 화면은 상태(status)에 맞춰 그리기만 합니다.
import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  '유통기한이 임박한 재료를 고르는 중...',
  '재료에 어울리는 요리를 찾는 중...',
  '조리 순서를 정리하는 중...',
];

const RecipeLoading = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => (i + 1) % LOADING_STEPS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-16">
      <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[5px] border-[#5E9B56] opacity-90 shadow-[0_0_25px_rgba(94,155,86,0.3)] animate-pulse"></div>
        <span className="text-6xl animate-bounce">🍳</span>
      </div>
      <h2 className="text-[22px] font-bold text-gray-800 mb-3 text-center tracking-tight">
        AI가 레시피를 고르고 있어요
      </h2>
      <p className="text-[#6B7280] text-[15px] font-medium h-6 text-center">{LOADING_STEPS[stepIndex]}</p>
      <div className="w-full mt-12 bg-[#F3F8F3] rounded-[20px] p-4 flex items-start gap-3 border border-[#E8F3E8]">
        <div className="text-[#5E9B56] mt-0.5 shrink-0">💡</div>
        <p className="text-[12px] text-gray-500 leading-relaxed tracking-tight break-keep">
          보통 10초 안팎 걸려요. 곧 상하는 재료를 먼저 쓰는 요리 3개를 추천해 드려요.
        </p>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe, index }) => {
  const used = Array.isArray(recipe.usedIngredients) ? recipe.usedIngredients : [];
  const extra = Array.isArray(recipe.extraIngredients) ? recipe.extraIngredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <article className="bg-white rounded-[16px] shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-[#5E9B56]">추천 {index + 1}</p>
          <h3 className="text-lg font-bold text-gray-800 leading-snug mt-0.5 break-keep">{recipe.title}</h3>
        </div>
        {typeof recipe.cookTimeMinutes === 'number' && (
          <span className="shrink-0 mt-1 px-2.5 py-1 bg-[#FAF8F3] text-gray-600 text-xs font-bold rounded-full">
            ⏱ {recipe.cookTimeMinutes}분
          </span>
        )}
      </div>

      {recipe.reason && (
        <p className="mt-2 text-sm font-medium text-[#C95252] break-keep">{recipe.reason}</p>
      )}

      {used.length > 0 && (
        <div className="mt-4">
          <p className="text-[12px] text-gray-500 font-medium mb-1.5">냉장고 재료</p>
          <div className="flex flex-wrap gap-1.5">
            {used.map((name) => (
              <span key={name} className="px-3 py-1 bg-[#EEF6ED] text-[#3F7A38] text-sm rounded-full font-medium">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {extra.length > 0 && (
        <div className="mt-3">
          <p className="text-[12px] text-gray-500 font-medium mb-1.5">추가로 필요한 재료</p>
          <div className="flex flex-wrap gap-1.5">
            {extra.map((name) => (
              <span key={name} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer list-none text-sm font-bold text-gray-700 flex items-center gap-1">
            조리 순서 {steps.length}단계
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <ol className="mt-2 flex flex-col gap-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed break-keep">
                <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#5E9B56] text-white text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </details>
      )}
    </article>
  );
};

const RecipeScreen = ({ status, recipes = [], errorMessage, onRetry, onClose, onGoToCamera }) => {
  return (
    <div className="w-full max-w-[400px] h-full mx-auto bg-[#F8F6F0] relative font-sans flex flex-col">
      <header className="px-6 pt-12 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={onClose} aria-label="뒤로가기" className="p-2 -ml-2 text-gray-800 hover:text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">레시피 추천</h1>
        </div>
        {status === 'done' && recipes.length > 0 && (
          <button onClick={onRetry} className="text-[14px] text-gray-400 font-medium hover:text-gray-600 transition-colors">
            다시 추천
          </button>
        )}
      </header>

      {status === 'loading' && <RecipeLoading />}

      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-5xl mb-4">😥</span>
          <p className="text-base font-bold text-gray-800">레시피를 가져오지 못했어요</p>
          <p className="text-sm text-gray-500 mt-1.5 break-keep">{errorMessage}</p>
          <button onClick={onRetry} className="mt-6 px-6 py-3 bg-[#5E9B56] hover:bg-[#4d8246] text-white font-bold rounded-xl">
            다시 시도
          </button>
        </div>
      )}

      {status === 'done' && recipes.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-5xl mb-4">🧊</span>
          <p className="text-base font-bold text-gray-800">냉장고가 비어 있어요</p>
          <p className="text-sm text-gray-500 mt-1.5 break-keep">영수증을 스캔해서 재료를 먼저 등록하면 레시피를 추천해 드려요.</p>
          <button onClick={onGoToCamera} className="mt-6 px-6 py-3 bg-[#5E9B56] hover:bg-[#4d8246] text-white font-bold rounded-xl">
            영수증 스캔하기
          </button>
        </div>
      )}

      {status === 'done' && recipes.length > 0 && (
        <main className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">곧 상하는 재료를 먼저 쓰는 요리예요</p>
          <div className="flex flex-col gap-4">
            {recipes.map((recipe, index) => (
              <RecipeCard key={`${recipe.title}-${index}`} recipe={recipe} index={index} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default RecipeScreen;
