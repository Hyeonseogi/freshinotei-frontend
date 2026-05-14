// src/pages/NotificationScreen.jsx
import React, { useState } from 'react';

const NotificationScreen = ({ fridgeItems = [], onClose }) => {
  // 1. 유통기한이 오늘이거나 이미 지난(음수) 식재료만 필터링하여 알림 생성
  const [alerts, setAlerts] = useState(() => {
    return fridgeItems
      .filter(item => item.daysLeft <= 0)
      .map(item => ({
        id: item.ingredient.id,
        name: item.ingredient.name,
        daysLeft: item.daysLeft,
        isRead: false
      }));
  });

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans">
      {/* 상단 헤더 */}
      <header className="px-6 pt-14 pb-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* 뒤로가기 버튼 */}
          <button onClick={onClose} className="p-2 -ml-2 text-gray-800 hover:text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">알림</h1>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-[14px] text-gray-400 font-medium hover:text-gray-600 transition-colors"
        >
          모두 읽음
        </button>
      </header>

      {/* 알림 리스트 영역 */}
      <main className="flex-1 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div 
              key={alert.id} 
              className={`p-5 border-b border-gray-100 flex items-start gap-4 transition-colors ${alert.isRead ? 'opacity-50' : 'bg-white'}`}
            >
              {/* 종 모양 아이콘 (선) */}
              <div className="text-gray-400 mt-0.5 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] text-gray-800 leading-snug break-keep">
                  <span className="font-bold">{alert.name}</span>의 유통기한이 {
                    alert.daysLeft === 0 ? '오늘까지입니다.' : `${Math.abs(alert.daysLeft)}일 지났습니다.`
                  }
                </p>
                {/* 시간은 프로토타입 시연을 위해 더미로 넣음 */}
                <p className="text-[12px] text-gray-400 mt-1.5 font-medium">
                  {index === 0 ? '1시간 전' : `${index}일 전`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <p>새로운 알림이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationScreen;