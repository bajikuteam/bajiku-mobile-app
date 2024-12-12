// export const formatCount = (count: number): string => {
//   if (count >= 1000000) {
//     return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
//   } else if (count >= 1000) {
//     return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
//   }
//   return count.toString();
// };

export const formatCount = (count: string | number | string[]): string => {
  let numericCount: number;

  if (Array.isArray(count)) {
    numericCount = parseFloat(count[0]) || 0; 
  } else if (typeof count === 'string') {
    numericCount = parseFloat(count) || 0;
  } else {
    numericCount = count;
  }

  if (numericCount >= 1000000) {
    return (numericCount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (numericCount >= 1000) {
    return (numericCount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }

  return numericCount.toString();
};



export const formatTime = (lastMessageTime: string) => {
  const messageDate = new Date(lastMessageTime);
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(Math.max(diffInMs, 0) / (1000 * 60)); 
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  } else {
    return messageDate.toLocaleString(); 
  }
};

export const formatCurrency = (num:any) => {
  return `₦${new Intl.NumberFormat('en-US').format(num)}`;
};

 export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return '#28a745'; // Green
    case 'pending':
      return '#ffc107'; // Yellow
    case 'rejected':
      return '#dc3545'; // Red
    default:
      return '#000'; // Default color (black)
  }
};
