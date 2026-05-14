// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import CameraScreen from './pages/CameraScreen';
import OcrResultScreen from './pages/OcrResultScreen';
import FridgeMainScreen from './pages/FridgeMainScreen';
import ReceiptAnalyzingScreen from './pages/ReceiptAnalyzingScreen';
import { backendApi } from './api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('fridge');
  const [fridgeData, setFridgeData] = useState([]);
  const [scannedResult, setScannedResult] = useState(null);
  
  // 실제 파일 선택창을 열기 위한 훅
  const fileInputRef = useRef(null);

  // 1. 초기 데이터 로드 (백엔드 GET /ingredients/priority)
  const loadFridgeData = async () => {
    try {
      const data = await backendApi.getPriorityList();
      setFridgeData(data);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  };

  useEffect(() => {
    if (currentScreen === 'fridge') {
      loadFridgeData();
    }
  }, [currentScreen]);

  // 2. 카메라 버튼 누를 때 실제 파일 선택창(갤러리/카메라) 띄우기
  const handleCaptureClick = () => {
    fileInputRef.current.click();
  };

  // 3. 파일이 선택되면 백엔드로 전송 (POST /ingredients/scan)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentScreen('analyzing'); // 스캐닝 로딩 화면 띄우기
    
    try {
      const result = await backendApi.scanReceipt(file); // 실제 파일 전송
      setScannedResult(result); // 응답받은 데이터 { count: n, ingredients: [...] } 저장
      setCurrentScreen('ocr'); // 결과 화면 띄우기
    } catch (error) {
      alert("AI 분석 중 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인해주세요!");
      setCurrentScreen('fridge');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center font-sans">
      {/* 눈에 보이지 않지만, 영수증 이미지를 선택하게 해주는 핵심 input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="w-full max-w-[400px] h-screen bg-white overflow-hidden shadow-2xl relative">
        {currentScreen === 'fridge' && (
          <FridgeMainScreen 
            fridgeItems={fridgeData} 
            onGoToCamera={handleCaptureClick} 
          />
        )}
        
        {currentScreen === 'camera' && (
          <CameraScreen 
            onCapture={handleCaptureClick} 
            onClose={() => setCurrentScreen('fridge')} 
          />
        )}

        {currentScreen === 'analyzing' && (
          <ReceiptAnalyzingScreen />
        )}

        {currentScreen === 'ocr' && (
          <OcrResultScreen 
            recognizedItems={scannedResult?.ingredients} 
            onSave={() => setCurrentScreen('fridge')} 
          />
        )}
      </div>
    </div>
  );
}

export default App;