import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Send,
  Code2,
  Database,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  roleRequired: string;
  defaultBody?: any;
}

export const ApiExplorer: React.FC = () => {
  const { complaints, categories, stats } = useComplaints();
  const { currentUser } = useAuth();

  const endpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/api/complaints',
      description: 'Retrieve all campus complaints with student and assignment relationships',
      roleRequired: 'ANY (Authenticated)'
    },
    {
      method: 'POST',
      path: '/api/complaints',
      description: 'Submit a new student grievance with auto-generated ticket ID',
      roleRequired: 'STUDENT',
      defaultBody: {
        title: 'Projector HDMI port broken',
        description: 'Classroom 302 projector HDMI cable damaged and gives no signal.',
        category_id: 3,
        location: 'Block A, Room 302',
        priority: 'HIGH'
      }
    },
    {
      method: 'GET',
      path: '/api/categories',
      description: 'List all operational maintenance categories and SLA hours',
      roleRequired: 'PUBLIC'
    },
    {
      method: 'POST',
      path: '/api/complaints/1/assign',
      description: 'Assign a field technician to a complaint and update status to ASSIGNED',
      roleRequired: 'ADMIN',
      defaultBody: {
        technician_id: 2,
        notes: 'Priority dispatch. Please check circuit breaker and replace socket.'
      }
    },
    {
      method: 'PATCH',
      path: '/api/complaints/1/status',
      description: 'Update complaint status and record audit trail with technician remarks',
      roleRequired: 'TECHNICIAN / ADMIN',
      defaultBody: {
        status: 'RESOLVED',
        remarks: 'Replaced damaged internal contact pins. Tested with laptop and verified crisp 1080p display output.'
      }
    },
    {
      method: 'GET',
      path: '/api/analytics/summary',
      description: 'Fetch aggregate triage statistics, category distribution, and resolution rates',
      roleRequired: 'ADMIN'
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0]);
  const [requestBody, setRequestBody] = useState<string>(
    endpoints[0].defaultBody ? JSON.stringify(endpoints[0].defaultBody, null, 2) : ''
  );
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [responseBody, setResponseBody] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleSelectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseStatus(null);
    setResponseBody(null);
  };

  const handleSendRequest = () => {
    const startTime = performance.now();

    // Simulate API execution
    setTimeout(() => {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime + 12));

      setResponseHeaders({
        'content-type': 'application/json',
        'server': 'uvicorn',
        'x-process-time': '0.014s',
        'access-control-allow-origin': '*'
      });

      if (selectedEndpoint.path === '/api/complaints' && selectedEndpoint.method === 'GET') {
        setResponseStatus(200);
        setResponseBody(complaints.slice(0, 4));
      } else if (selectedEndpoint.path === '/api/complaints' && selectedEndpoint.method === 'POST') {
        setResponseStatus(201);
        setResponseBody({
          id: complaints.length + 1,
          ticket_id: 'CLASS-94812',
          title: 'Projector HDMI port broken',
          status: 'PENDING',
          student_id: currentUser?.id || 1,
          created_at: new Date().toISOString(),
          message: 'Grievance ticket created successfully in MySQL'
        });
      } else if (selectedEndpoint.path === '/api/categories') {
        setResponseStatus(200);
        setResponseBody(categories);
      } else if (selectedEndpoint.path.includes('/assign')) {
        setResponseStatus(200);
        setResponseBody({
          success: true,
          complaint_id: 1,
          status: 'ASSIGNED',
          technician: 'Rajesh Kumar',
          assigned_at: new Date().toISOString(),
          audit_log: 'Dispatched to technician'
        });
      } else if (selectedEndpoint.path.includes('/status')) {
        setResponseStatus(200);
        setResponseBody({
          success: true,
          complaint_id: 1,
          status: 'RESOLVED',
          resolved_at: new Date().toISOString(),
          audit_log_id: 42
        });
      } else if (selectedEndpoint.path === '/api/analytics/summary') {
        setResponseStatus(200);
        setResponseBody(stats);
      }
    }, 120);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(responseBody, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">POST</span>;
      case 'PATCH':
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px]">PATCH</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">{m}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive FastAPI REST Client</h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate live HTTP requests, test Pydantic serialization, and inspect authentic JSON responses.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-slate-200 px-3 py-1.5 rounded-xl font-mono text-xs shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FastAPI: http://localhost:8000/docs</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
            Available Endpoints
          </div>

          <div className="space-y-1.5">
            {endpoints.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all space-y-1 ${
                  selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                    ? 'bg-indigo-50 border border-indigo-200 shadow-xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMethodBadge(ep.method)}
                    <span className="font-mono font-bold text-slate-900">{ep.path}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{ep.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Request & Response Workbench (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Request Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {getMethodBadge(selectedEndpoint.method)}
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl w-full sm:w-auto truncate">
                  {selectedEndpoint.path}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Role: {selectedEndpoint.roleRequired}
                </span>

                <button
                  id="api-send-request-btn"
                  onClick={handleSendRequest}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Request Body Editor (if POST/PATCH) */}
            {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PATCH') && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Request JSON Payload (Pydantic Schema)
                </label>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Response Console */}
          <div className="bg-slate-900 rounded-2xl p-5 text-slate-200 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">HTTP Response</span>
                {responseStatus && (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    responseStatus < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {responseStatus} OK
                  </span>
                )}
                {responseTime && (
                  <span className="text-slate-500 text-[11px]">({responseTime}ms)</span>
                )}
              </div>

              {responseBody && (
                <button
                  onClick={handleCopyResponse}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              )}
            </div>

            {responseBody ? (
              <pre className="font-mono text-xs text-emerald-400 max-h-80 overflow-y-auto leading-relaxed">
                {JSON.stringify(responseBody, null, 2)}
              </pre>
            ) : (
              <div className="py-10 text-center text-slate-500 text-xs font-mono">
                Click <strong>"Send"</strong> to execute this FastAPI route and inspect JSON output.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
