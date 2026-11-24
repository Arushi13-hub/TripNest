export function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return '1 Day';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);
  return diffDays === 1 ? '1 Day' : `${diffDays} Days`;
}

export function getDaysList(startDate, endDate) {
  if (!startDate || !endDate) {
    const today = new Date();
    return [{
      dayNumber: 1,
      dateString: today.toISOString().split('T')[0],
      displayDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      shortDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }];
  }

  const [sY, sM, sD] = startDate.split('-').map(Number);
  const [eY, eM, eD] = endDate.split('-').map(Number);
  const start = new Date(sY, sM - 1, sD);
  const end = new Date(eY, eM - 1, eD);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const days = [];
  for (let i = 0; i < diffDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      dayNumber: i + 1,
      dateString,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      shortDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return days;
}

export function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Dates flexible';
  const [sY, sM, sD] = startDate.split('-').map(Number);
  const start = new Date(sY, sM - 1, sD);
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();

  if (!endDate || startDate === endDate) {
    return `${startMonth} ${startDay}, ${startYear}`;
  }

  const [eY, eM, eD] = endDate.split('-').map(Number);
  const end = new Date(eY, eM - 1, eD);
  const endYear = end.getFullYear();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
}

export function formatCurrency(amount, currency = 'USD') {
  const symbolMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  const sym = symbolMap[currency] || '$';
  return `${sym}${Number(amount || 0).toLocaleString()}`;
}

export function getTripStatus(startDate, endDate) {
  if (!startDate || !endDate) return 'Planned';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [sY, sM, sD] = startDate.split('-').map(Number);
  const start = new Date(sY, sM - 1, sD);

  const [eY, eM, eD] = endDate.split('-').map(Number);
  const end = new Date(eY, eM - 1, eD);
  end.setHours(23, 59, 59, 999);

  if (today < start) {
    const daysUntil = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil === 1 ? 'Starts Tomorrow' : `In ${daysUntil} days`;
  }
  if (today >= start && today <= end) {
    return 'Happening Now';
  }
  return 'Past Adventure';
}
