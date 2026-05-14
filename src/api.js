// src/api.js
// 백엔드 팀이 공유해준 실제 Railway 배포 주소로 변경합니다.
const BASE_URL = 'https://freshi-notei-backend-production.up.railway.app';

export const backendApi = {
  // 1. POST /ingredients/scan : 영수증 이미지 전송
  scanReceipt: async (file) => {
    const formData = new FormData();
    formData.append('image', file); // 명세서의 파라미터명 'image' 확인 완료

    try {
      const response = await fetch(`${BASE_URL}/ingredients/scan`, {
        method: 'POST',
        body: formData,
        // CORS 전체 허용이므로 별도 mode 설정 없이 호출 가능합니다.
      });
      if (!response.ok) throw new Error('스캔 실패');
      return await response.json(); 
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
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

  // 3. DELETE /ingredients : 전체 초기화 (데모용)
  resetData: async () => {
    try {
      await fetch(`${BASE_URL}/ingredients`, { method: 'DELETE' });
    } catch (error) {
      console.error("초기화 실패:", error);
    }
  }
};