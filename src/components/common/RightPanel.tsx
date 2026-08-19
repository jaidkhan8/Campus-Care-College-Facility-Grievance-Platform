import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { SEED_UPCOMING_EVENTS, UpcomingEvent } from '../../data/seedData';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Wifi,
  Home,
  Monitor,
  Activity,
  ArrowRight
} from 'lucide-react';

interface RightPanelProps {
  onOpenComplaint?: (ticketId: string) => void;
  onOpenNewComplaint?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  onOpenComplaint,
  onOpenNewComplaint
}) => {
  const { complaints, auditLogs } = useComplaints();
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [currentMonthIndex] = useState<number>(7); // August (0-indexed)
  const [events, setEvents] = useState<UpcomingEvent[]>(SEED_UPCOMING_EVENTS);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventLocation, setNewEventLocation] = useState('Block A');
  const [newEventCategory, setNewEventCategory] = useState('Electrical');

  // Days in August 2026: 31 days. August 1, 2026 is a Saturday (index 6)
  const daysInMonth = 31;
  const startDayOfWeek = 6; // Saturday
  const highlightedEventDays = [14, 15, 18, 22];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEvt: UpcomingEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      time: newEventTime,
      location: newEventLocation.trim() || 'Main Campus',
      category: newEventCategory,
      date: `2026-08-${selectedDay.toString().padStart(2, '0')}`,
      type: 'maintenance'
    };
    setEvents(prev => [newEvt, ...prev]);
    setNewEventTitle('');
    setIsAddEventOpen(false);
  };

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electrical':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'internet/wifi':
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-indigo-500" />;
      case 'hostel':
        return <Home className="w-3.5 h-3.5 text-emerald-500" />;
      case 'classroom':
        return <Monitor className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('RESOLVED') || action.includes('CLOSED')) {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (action.includes('ASSIGN') || action.includes('TRANSITION')) {
      return (
        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
      </div>
    );
  };

  const formatActivityTime = (isoString: string) => {
    try {
      const now = new Date('2026-08-14T15:46:00Z').getTime();
      const time = new Date(isoString).getTime();
      const diffMs = Math.max(0, now - time);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <aside className="w-full xl:w-80 shrink-0 space-y-5">
      
      {/* 1. Campus Calendar Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">August 2026</h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            Semester 1
          </span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
            <div key={day} className="text-[10px] font-bold text-slate-400 uppercase py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty offset days */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7 w-7 mx-auto" />
          ))}

          {/* Days 1..31 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected = dayNum === selectedDay;
            const isToday = dayNum === 14;
            const hasEvent = highlightedEventDays.includes(dayNum);

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-7 w-7 mx-auto rounded-lg text-xs flex flex-col items-center justify-center font-medium transition-all relative group ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : isToday
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{dayNum}</span>
                {hasEvent && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-indigo-500 absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Footer Info */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Today (14 Aug)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Maintenance days</span>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Maintenance Schedule Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Upcoming</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {events.length}
            </span>
          </div>
          <button
            onClick={() => setIsAddEventOpen(!isAddEventOpen)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3 h-3" />
            <span>Schedule</span>
          </button>
        </div>

        {/* Schedule add form dropdown */}
        {isAddEventOpen && (
          <form onSubmit={handleAddEvent} className="mb-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                placeholder="e.g. Generator Testing"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Time</label>
                <input
                  type="text"
                  value={newEventTime}
                  onChange={e => setNewEventTime(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={e => setNewEventLocation(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Events List */}
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/40 hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{evt.time}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {evt.category}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 mt-1.5 group-hover:text-indigo-700 transition-colors">
                {evt.title}
              </h4>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{evt.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Live Feed Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Activity Feed Items */}
        <div className="space-y-3.5">
          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 text-xs cursor-pointer group"
              onClick={() => {
                if (typeof log.entityId === 'string' && onOpenComplaint) {
                  onOpenComplaint(log.entityId);
                }
              }}
            >
              {getActivityIcon(log.action)}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 font-medium leading-snug group-hover:text-indigo-600 transition-colors">
                  {log.details}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {formatActivityTime(log.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onOpenNewComplaint}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            <span>Report a campus issue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};
