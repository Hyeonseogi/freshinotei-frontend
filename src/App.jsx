// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import CameraScreen from './pages/CameraScreen';
import OcrResultScreen from './pages/OcrResultScreen';
import FridgeMainScreen from './pages/FridgeMainScreen';
import ReceiptAnalyzingScreen from './pages/ReceiptAnalyzingScreen';
import NotificationScreen from './pages/NotificationScreen'; 
import { backendApi } from './api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('fridge');
  const [fridgeData, setFridgeData] = useState([]);
  const [scannedResult, setScannedResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const loadFridgeData = async () => {
    try {
      const data = await backendApi.getPriorityList();
      setFridgeData(data);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  };

  useEffect(() => {
    loadFridgeData();
  }, []);

  // ✅ 전체 비우기 기능: 백엔드 전체 삭제 API 연동 및 화면 비우기
  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("냉장고를 완전히 비우시겠습니까?");
    if (!confirmDelete) return;

    try {
      await backendApi.resetData(); // 백엔드 서버의 데이터 초기화
      setFridgeData([]); // 프론트엔드 화면 즉시 비우기
      alert("냉장고를 깨끗하게 비웠습니다!");
    } catch (error) {
      alert("냉장고 비우기에 실패했습니다.");
    }
  };

  const handleGoToCameraScreen = () => {
    setCurrentScreen('camera');
  };

  const handleGoToNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentScreen('analyzing');
    
    try {
      const result = await backendApi.scanReceipt(file);
      setScannedResult(result);
      setCurrentScreen('ocr');
    } catch (error) {
      alert("AI 분석 중 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인해주세요!");
      setCurrentScreen('fridge');
    }
  };

  return (
    <div className="bg-gray-800 min-h-[100dvh] flex items-center justify-center font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="w-full max-w-[400px] h-[100dvh] bg-white overflow-hidden shadow-2xl relative">
        {currentScreen === 'fridge' && (
          <FridgeMainScreen 
            fridgeItems={fridgeData} 
            onGoToCamera={handleGoToCameraScreen} 
            onDeleteAll={handleDeleteAll} // ✅ 삭제 프롭스 이름과 연결 함수 변경
            onGoToNotifications={handleGoToNotifications}
          />
        )}
        
        {currentScreen === 'notifications' && (
          <NotificationScreen 
            fridgeItems={fridgeData} 
            onClose={() => setCurrentScreen('fridge')} 
          />
        )}

        {currentScreen === 'camera' && (
          <CameraScreen 
            onCapture={handleTriggerFileInput} 
            onClose={() => setCurrentScreen('fridge')} 
          />
        )}

        {currentScreen === 'analyzing' && (
          <ReceiptAnalyzingScreen />
        )}

        {currentScreen === 'ocr' && (
          <OcrResultScreen 
            recognizedItems={scannedResult?.ingredients} 
            onSave={() => {
              setCurrentScreen('fridge');
              loadFridgeData(); 
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default App;