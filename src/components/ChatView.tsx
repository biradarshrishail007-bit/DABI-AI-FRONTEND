import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Database,
  BarChart3,
  TrendingUp,
  Table as TableIcon,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Dataset, ChatMessage } from '../types';
import { AnalyticsEngine } from '../services/analyticsEngine';
import { getThemeTokens } from '../theme';
import { getActiveDatasetData } from '../services/api';

interface ChatViewProps {
  activeDataset: Dataset;
  isDark: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({ activeDataset, isDark }) => {
  const theme = getThemeTokens(isDark);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      timestamp: 'Just now',
      content: `Hello! I am **DABI AI**, your autonomous data analyst.\n\nI have loaded **${activeDataset.name}** with **${activeDataset.rowCount.toLocaleString()} rows** and **${activeDataset.colCount} attributes**. What business insights, KPI trends, or predictive patterns would you like to explore today?`,
      suggestions: [
        'Which product has the highest sales?',
        'Show monthly revenue.',
        'Which region performed best?',
        'Find unusual values.',
        "Compare this year's sales with last year.",
        'Give me the top 10 customers.'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await AnalyticsEngine.queryData(text, activeDataset, messages);

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.content,
        tableData: response.tableData,
        chartData: response.chartData,
        stats: response.stats,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `I encountered an issue processing your query: ${err.message || 'Unknown error'}. Please try rephrasing or asking for one of the pre-computed metrics.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderChart = (chart: ChatMessage['chartData']) => {
    if (!chart || !chart.data || chart.data.length === 0) return null;

    return (
      <div className="mt-4 p-4 rounded-xl border border-theme-border bg-theme-card shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-theme-primary" />
            <h4 className="text-xs font-bold text-theme-heading">{chart.title}</h4>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-theme-accent text-theme-primary font-semibold border border-theme-border">
            {chart.type} chart
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === 'area' ? (
              <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primary} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={theme.primaryBright} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey={chart.xKey} tick={{ fontSize: 11, fill: theme.muted }} />
                <YAxis tick={{ fontSize: 11, fill: theme.muted }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, borderRadius: 8, fontSize: 12, color: theme.chartTooltipText }} />
                <Area type="monotone" dataKey={chart.yKey} stroke={theme.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            ) : chart.type === 'line' ? (
              <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey={chart.xKey} tick={{ fontSize: 11, fill: theme.muted }} />
                <YAxis tick={{ fontSize: 11, fill: theme.muted }} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, borderRadius: 8, fontSize: 12, color: theme.chartTooltipText }} />
                <Line type="monotone" dataKey={chart.yKey} stroke={theme.primary} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            ) : chart.type === 'pie' ? (
              <PieChart>
                <Pie data={chart.data} dataKey={chart.yKey} nameKey={chart.xKey} cx="50%" cy="50%" outerRadius={75} label>
                  {chart.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={theme.pieColors[index % theme.pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, borderRadius: 8, fontSize: 12, color: theme.chartTooltipText }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            ) : (
              <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey={chart.xKey} tick={{ fontSize: 10, fill: theme.muted }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: theme.muted }} tickFormatter={(v) => typeof v === 'number' && v > 999 ? `$${(v/1000).toFixed(0)}k` : v} />
                <Tooltip contentStyle={{ backgroundColor: theme.chartTooltipBg, borderColor: theme.chartTooltipBorder, borderRadius: 8, fontSize: 12, color: theme.chartTooltipText }} />
                <Bar dataKey={chart.yKey} fill={theme.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-61px)] max-w-5xl mx-auto w-full transition-colors">
      {/* Top Dataset Context Bar */}
      <div className="px-6 py-3 border-b border-theme-border bg-theme-card flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-theme-heading">
            <Database className="w-4 h-4 text-theme-primary" />
            <span>Dataset: <span className="font-mono text-theme-primary">{activeDataset.name}</span></span>
          </div>
          <span className="text-theme-muted">•</span>
          <span className="text-theme-muted font-mono">Rows: {activeDataset.rowCount.toLocaleString()}</span>
          <span className="text-theme-muted">•</span>
          <span className="text-theme-muted font-mono">Columns: {activeDataset.colCount}</span>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                timestamp: 'Just now',
                content: `Chat history cleared. I am ready to analyze **${activeDataset.name}**.`,
                suggestions: [
                  'Which product has the highest sales?',
                  'Show monthly revenue.',
                  'Which region performed best?',
                  'Find unusual values.'
                ]
              }
            ]);
          }}
          className="text-[11px] font-semibold text-theme-muted hover:text-theme-heading transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#1EA7F2] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#1EA7F2]/20">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-3xl space-y-3 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-4 md:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'btn-primary-gradient text-white rounded-tr-none shadow-xs'
                    : 'bg-theme-card border border-theme-border text-theme-foreground rounded-tl-none shadow-xs'
                }`}
              >
                {/* Message Body with markdown support */}
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Stat Badges */}
                {msg.stats && msg.stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5">
                    {msg.stats.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-theme-border bg-theme-secondary"
                      >
                        <p className="text-[10px] text-theme-muted">{s.label}</p>
                        <p className="text-sm font-extrabold font-mono text-theme-heading mt-0.5">
                          {s.value}
                        </p>
                        {s.change && (
                          <span className="text-[10px] text-[#20B981] font-semibold">
                            {s.change}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Chart */}
                {msg.chartData && renderChart(msg.chartData)}

                {/* Inline Table */}
                {msg.tableData && (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-theme-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-theme-secondary text-theme-heading border-b border-theme-border">
                        <tr>
                          {msg.tableData.headers.map((h, i) => (
                            <th key={i} className="py-2 px-3 font-semibold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-border">
                        {msg.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-theme-hover/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 whitespace-nowrap font-mono text-theme-foreground">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Action Bar for Assistant Message */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-theme-border text-[11px] text-theme-muted">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-theme-primary transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-[#20B981]" /> : <Copy className="w-3 h-3 text-theme-muted" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Suggestions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-xs px-2.5 py-1 rounded-full border border-theme-border bg-theme-card text-theme-heading hover:border-theme-primary hover:text-theme-primary hover:bg-theme-hover shadow-xs transition-all"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-theme-card border border-theme-border text-theme-primary flex items-center justify-center flex-shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#1EA7F2] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none border border-theme-border bg-theme-card text-theme-foreground text-xs flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-theme-primary" />
              <span>DABI AI is querying dataset and formulating analytical synthesis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Buttons (quick prompt strip) */}
      <div className="px-4 py-2 border-t border-theme-border bg-theme-secondary flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-theme-muted font-semibold uppercase flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-500" /> Prompts:
        </span>
        {[
          'What is the total revenue?',
          'Which product has the highest sales?',
          'Show monthly revenue.',
          'Which region performed best?',
          'Find missing values.',
          'Find unusual values.',
          'Give me the top 10 products.',
          'Compare sales between two periods.',
          'Give me the most important insights.'
        ].map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card text-theme-heading hover:border-theme-primary hover:text-theme-primary hover:bg-theme-hover transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-theme-border bg-theme-card transition-colors">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="relative flex items-center"
        >
          <input
            id="chat-input-field"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask DABI anything about your data..."
            disabled={isThinking}
            className="w-full pl-4 pr-12 py-3 text-xs sm:text-sm rounded-xl border border-theme-border bg-theme-secondary text-theme-heading placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-theme-card transition-all"
          />

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="btn-primary-gradient absolute right-2 p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-theme-muted mt-2">
          DABI AI computes rigorous mathematical aggregates and cross-validates schema dimensions.
        </p>
      </div>
    </div>
  );
};
