// src/api.js
// 백엔드 주소는 바뀔 수 있으니 코드에 적지 않고 환경변수(VITE_API_URL)로만 받습니다.
// 로컬: .env.local 파일에, 배포: Vercel 환경변수에 넣으세요.
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

if (!BASE_URL) {
  console.error('VITE_API_URL이 설정되지 않았습니다. .env.local 또는 Vercel 환경변수를 확인하세요.');
}

// 백엔드 에러 응답 { timestamp, status, error, message, path }에서 message를 꺼내 Error로 만듭니다.
async function toError(response, fallbackMessage) {
  let message = fallbackMessage;
  try {
    const body = await response.json();
    if (body?.message) message = body.message;
  } catch {
    // 본문이 없거나 JSON이 아니면 기본 문구를 씁니다.
  }
  const error = new Error(message);
  error.status = response.status;
  return error;
}

export const backendApi = {
  // 1. POST /ingredients/scan : 영수증 이미지 전송 (AI 호출이라 10초 안팎 걸림)
  scanReceipt: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/ingredients/scan`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw await toError(response, '영수증 분석에 실패했어요.');
    return response.json();
  },

  // 2. GET /ingredients/priority : 소비 우선순위 조회
  getPriorityList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients/priority`);
      if (!response.ok) throw new Error('조회 실패');
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // 3. DELETE /ingredients/{id} : 재료 하나 삭제 (성공 204, 없는 id면 404)
  deleteIngredient: async (id) => {
    const response = await fetch(`${BASE_URL}/ingredients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    // 404는 이미 지워진 재료라서, 목록을 다시 불러오면 되므로 성공처럼 처리합니다.
    if (!response.ok && response.status !== 404) {
      throw await toError(response, '재료를 삭제하지 못했어요.');
    }
  },

  // 4. DELETE /ingredients : 전체 초기화 (데모용)
  resetData: async () => {
    const response = await fetch(`${BASE_URL}/ingredients`, { method: 'DELETE' });
    if (!response.ok) throw await toError(response, '냉장고를 비우지 못했어요.');
  },

  // 5. POST /recipes/recommend : 유통기한 임박 재료로 레시피 3개 추천 (AI 호출이라 10초 안팎 걸림)
  recommendRecipes: async () => {
    const response = await fetch(`${BASE_URL}/recipes/recommend`, { method: 'POST' });
    if (!response.ok) throw await toError(response, '레시피를 추천받지 못했어요.');
    const data = await response.json();
    return Array.isArray(data?.recipes) ? data.recipes : [];
  },
};
