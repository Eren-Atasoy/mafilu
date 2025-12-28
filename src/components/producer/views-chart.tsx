"use client";

import { useMemo } from "react";

interface DailyViews {
    date: string;
    views: number;
}

interface ViewsChartProps {
    data: DailyViews[];
}

export function ViewsChart({ data }: ViewsChartProps) {
    // Calculate chart dimensions and scaling
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return { bars: [], maxViews: 0, totalViews: 0 };
        }

        const maxViews = Math.max(...data.map(d => d.views), 1);
        const totalViews = data.reduce((sum, d) => sum + d.views, 0);

        const bars = data.map((d, index) => ({
            ...d,
            height: (d.views / maxViews) * 100,
            index,
        }));

        return { bars, maxViews, totalViews };
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-500">
                Henüz izlenme verisi yok
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                    Son 30 günde toplam: <span className="text-white font-medium">{chartData.totalViews.toLocaleString()}</span> izlenme
                </span>
                <span className="text-slate-500">
                    Günlük ort: {Math.round(chartData.totalViews / 30).toLocaleString()}
                </span>
            </div>

            {/* Chart Container */}
            <div className="relative h-48 w-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-slate-500">
                    <span>{chartData.maxViews}</span>
                    <span>{Math.round(chartData.maxViews / 2)}</span>
                    <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-12 h-full flex items-end gap-[2px] pb-6">
                    {chartData.bars.map((bar) => (
                        <div
                            key={bar.date}
                            className="flex-1 group relative"
                            style={{ height: "100%" }}
                        >
                            {/* Bar */}
                            <div
                                className="absolute bottom-0 left-0 right-0 rounded-t transition-all duration-200 group-hover:opacity-80"
                                style={{
                                    height: `${Math.max(bar.height, 2)}%`,
                                    background: bar.views > 0
                                        ? "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)"
                                        : "rgba(100, 100, 100, 0.3)",
                                }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="font-medium">{bar.views} izlenme</div>
                                <div className="text-slate-400">
                                    {new Date(bar.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-slate-500">
                    <span>30 gün önce</span>
                    <span>Bugün</span>
                </div>
            </div>
        </div>
    );
}
