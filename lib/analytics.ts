export interface PageView {
  path: string;
  timestamp: number;
  referrer: string;
  userAgent: string;
  screen: string;
  language: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  viewsByDay: { date: string; count: number }[];
  viewsByHour: { hour: number; count: number }[];
  deviceBreakdown: { type: string; count: number }[];
  uniqueVisitors: number;
}

const STORAGE_KEY = "menhely_analytics";
const VISITOR_KEY = "menhely_visitor_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getAllViews(): PageView[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveViews(views: PageView[]) {
  if (typeof window === "undefined") return;
  // Keep last 10000 entries max
  const trimmed = views.slice(-10000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/** Track a page view */
export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;

  const view: PageView = {
    path,
    timestamp: Date.now(),
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language || "hu",
  };

  const views = getAllViews();
  views.push(view);
  saveViews(views);
}

/** Get device type from user agent */
function getDeviceType(ua: string): string {
  if (/mobile|android|iphone|ipad/i.test(ua)) return "Mobil";
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  return "Asztali";
}

/** Get analytics summary */
export function getAnalyticsSummary(): AnalyticsSummary {
  const views = getAllViews();
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  const todayViews = views.filter((v) => v.timestamp >= todayStart.getTime()).length;
  const weekViews = views.filter((v) => v.timestamp >= weekAgo).length;
  const monthViews = views.filter((v) => v.timestamp >= monthAgo).length;

  // Top pages
  const pageCount: Record<string, number> = {};
  views.forEach((v) => {
    pageCount[v.path] = (pageCount[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCount)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Top referrers
  const refCount: Record<string, number> = {};
  views.forEach((v) => {
    const ref = v.referrer === "direct" ? "Közvetlen" : new URL(v.referrer).hostname;
    refCount[ref] = (refCount[ref] || 0) + 1;
  });
  const topReferrers = Object.entries(refCount)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Views by day (last 30 days)
  const dayCount: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    dayCount[key] = 0;
  }
  views.forEach((v) => {
    if (v.timestamp >= monthAgo) {
      const d = new Date(v.timestamp);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dayCount[key] = (dayCount[key] || 0) + 1;
    }
  });
  const viewsByDay = Object.entries(dayCount).map(([date, count]) => ({ date, count }));

  // Views by hour
  const hourCount: number[] = new Array(24).fill(0);
  views.forEach((v) => {
    if (v.timestamp >= weekAgo) {
      const h = new Date(v.timestamp).getHours();
      hourCount[h]++;
    }
  });
  const viewsByHour = hourCount.map((count, hour) => ({ hour, count }));

  // Device breakdown
  const deviceCount: Record<string, number> = {};
  views.forEach((v) => {
    const device = getDeviceType(v.userAgent);
    deviceCount[device] = (deviceCount[device] || 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCount)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Unique visitors (by visitor ID stored in each view — approximated)
  const uniquePaths = new Set(views.map((v) => v.path + v.userAgent.slice(0, 50)));

  return {
    totalViews: views.length,
    todayViews,
    weekViews,
    monthViews,
    topPages,
    topReferrers,
    viewsByDay,
    viewsByHour,
    deviceBreakdown,
    uniqueVisitors: uniquePaths.size,
  };
}

/** Export analytics as CSV */
export function exportAnalyticsCSV(): string {
  const views = getAllViews();
  const header = "Útvonal,IDőpont,Időző,Referrer,Eszköz\n";
  const rows = views.map((v) => {
    const date = new Date(v.timestamp).toLocaleString("hu-HU");
    const device = getDeviceType(v.userAgent);
    return `"${v.path}","${date}","${v.screen}","${v.referrer}","${device}"`;
  }).join("\n");
  return header + rows;
}

/** Clear all analytics data */
export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
