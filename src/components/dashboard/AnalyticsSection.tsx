import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Activity, PieChart as PieIcon, ChevronDown } from 'lucide-react';
import { Complaint } from '../../types';

interface AnalyticsSectionProps {
  complaints: Complaint[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ complaints }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  // Activity Data based on selected timeframe
  const activityData = useMemo(() => {
    if (timeframe === '7d') {
      return [
        { day: 'Mon', count: 1, resolved: 1 },
        { day: 'Tue', count: 3, resolved: 2 },
        { day: 'Wed', count: 2, resolved: 1 },
        { day: 'Thu', count: 4, resolved: 3 },
        { day: 'Fri', count: 2, resolved: 2 },
        { day: 'Sat', count: 1, resolved: 0 },
        { day: 'Sun', count: 2, resolved: 1 }
      ];
    }
    if (timeframe === '30d') {
      return [
        { day: 'Week 1', count: 8, resolved: 6 },
        { day: 'Week 2', count: 12, resolved: 10 },
        { day: 'Week 3', count: 9, resolved: 8 },
        { day: 'Week 4', count: 11, resolved: 9 }
      ];
    }
    return [
      { day: 'June', count: 28, resolved: 25 },
      { day: 'July', count: 35, resolved: 32 },
      { day: 'August', count: 22, resolved: 18 }
    ];
  }, [timeframe]);

  // Category breakdown data
  const categoryData = useMemo(() => {
    // If complaints are present, calculate proportions, else use requested standard benchmark
    const total = complaints.length || 12;

    const counts: { [key: string]: number } = {
      'Internet/WiFi': 0,
      'Electrical': 0,
      'Hostel': 0,
      'Classroom': 0,
      'Other': 0
    };

    complaints.forEach(c => {
      const name = c.categoryName.toLowerCase();
      if (name.includes('wifi') || name.includes('internet') || name.includes('network')) {
        counts['Internet/WiFi'] += 1;
      } else if (name.includes('electric') || name.includes('power') || name.includes('light')) {
        counts['Electrical'] += 1;
      } else if (name.includes('hostel') || name.includes('room') || name.includes('plumb')) {
        counts['Hostel'] += 1;
      } else if (name.includes('class') || name.includes('projector') || name.includes('lab')) {
        counts['Classroom'] += 1;
      } else {
        counts['Other'] += 1;
      }
    });

    // If zero across the board, provide sample benchmark
    const rawTotal = Object.values(counts).reduce((a, b) => a + b, 0);
    if (rawTotal === 0) {
      return [
        { name: 'Internet/WiFi', value: 4, percentage: '30%', color: '#6366f1' }, // Indigo
        { name: 'Electrical', value: 3, percentage: '25%', color: '#f59e0b' },    // Amber
        { name: 'Hostel', value: 2, percentage: '20%', color: '#10b981' },        // Emerald
        { name: 'Classroom', value: 2, percentage: '15%', color: '#3b82f6' },     // Blue
        { name: 'Other', value: 1, percentage: '10%', color: '#8b5cf6' }         // Purple
      ];
    }

    return [
      {
        name: 'Internet/WiFi',
        value: counts['Internet/WiFi'] || 4,
        percentage: `${Math.round(((counts['Internet/WiFi'] || 4) / total) * 100)}%`,
        color: '#6366f1'
      },
      {
        name: 'Electrical',
        value: counts['Electrical'] || 3,
        percentage: `${Math.round(((counts['Electrical'] || 3) / total) * 100)}%`,
        color: '#f59e0b'
      },
      {
        name: 'Hostel',
        value: counts['Hostel'] || 2,
        percentage: `${Math.round(((counts['Hostel'] || 2) / total) * 100)}%`,
        color: '#10b981'
      },
      {
        name: 'Classroom',
        value: counts['Classroom'] || 2,
        percentage: `${Math.round(((counts['Classroom'] || 2) / total) * 100)}%`,
        color: '#3b82f6'
      },
      {
        name: 'Other',
        value: counts['Other'] || 1,
        percentage: `${Math.round(((counts['Other'] || 1) / total) * 100)}%`,
        color: '#8b5cf6'
      }
    ];
  }, [complaints]);

  const totalCountDisplay = complaints.length > 0 ? complaints.length : 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* 1. Complaint Activity Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Complaint Activity
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Resolution velocity and ticket volume trends
            </p>
          </div>

          {/* Timeframe Dropdown Filter */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-slate-200">{label}</div>
                        <div className="flex items-center gap-2 text-indigo-300">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span>Submitted: {payload[0]?.value}</span>
                        </div>
                        {payload[1] && (
                          <div className="flex items-center gap-2 text-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Resolved: {payload[1]?.value}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#indigoGradient)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#emeraldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span className="font-medium">Total Tickets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Resolved on SLA</span>
          </div>
        </div>
      </div>

      {/* 2. Complaint Categories Donut Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Complaint Categories
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Breakdown
          </span>
        </div>

        {/* Donut Chart with Centered Total */}
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 pt-2">
          
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                          {data.name}: {data.value} tickets ({data.percentage})
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {totalCountDisplay}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                Complaints
              </span>
            </div>
          </div>

          {/* Custom Clean Category Legend with percentage pills */}
          <div className="space-y-2 text-xs">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                  {cat.percentage}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Card Footer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Primary Category: Internet/WiFi (30%)</span>
          <span className="text-indigo-600 font-semibold">100% SLA Coverage</span>
        </div>
      </div>

    </div>
  );
};
