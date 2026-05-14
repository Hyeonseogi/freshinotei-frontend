export const getUrgencyStyles = (urgency) => {
  switch (urgency) {
    case 'EXPIRED': return { border: 'border-l-gray-400', badge: 'bg-gray-400', text: '소비 불가' };
    case 'TODAY':
    case 'URGENT': return { border: 'border-l-red-500', badge: 'bg-red-500', text: '긴급' };
    case 'SOON': return { border: 'border-l-orange-500', badge: 'bg-orange-500', text: '주의' };
    case 'WATCH': return { border: 'border-l-yellow-500', badge: 'bg-yellow-500', text: '보통' };
    case 'FRESH': return { border: 'border-l-green-500', badge: 'bg-green-500', text: '신선' };
    default: return { border: 'border-l-gray-300', badge: 'bg-gray-300', text: '-' };
  }
};