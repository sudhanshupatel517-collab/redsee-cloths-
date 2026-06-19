'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/axios';
import { 
  HeadphonesIcon, 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Plus, 
  ArrowLeft, 
  Send, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Star,
  Lock
} from 'lucide-react';
import { optimizeImageUrl } from '@/lib/image';

interface Message {
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin' | 'coadmin';
  messageText?: string;
  attachments?: string[];
  createdAt: string;
}

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  description: string;
  attachments?: string[];
  status: 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  orderId?: string;
}

export default function SupportPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Views: 'list' | 'create' | 'chat'
  const [view, setView] = useState<'list' | 'create' | 'chat'>('list');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  // Create Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Order Issue');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formError, setFormError] = useState('');

  // Chat State
  const [replyText, setReplyText] = useState('');
  const [chatAttachments, setChatAttachments] = useState<string[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [uploadingChatFile, setUploadingChatFile] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Rating State
  const [showRating, setShowRating] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch all tickets on mount
  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/api/tickets');
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Socket connection for selected ticket
  useEffect(() => {
    if (view !== 'chat' || !selectedTicket) return;

    const socket = getSocket();
    socket.connect();
    socket.emit('join_room', `ticket_${selectedTicket._id}`);

    socket.on('new_message', (data: { ticket: Ticket, message: Message }) => {
      setSelectedTicket(data.ticket);
      setTickets(prev => prev.map(t => t._id === data.ticket._id ? data.ticket : t));
      scrollToBottom();
    });

    socket.on('ticket_closed', (updatedTicket: Ticket) => {
      setSelectedTicket(updatedTicket);
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
    });

    socket.on('ticket_updated', (updatedTicket: Ticket) => {
      if (updatedTicket._id === selectedTicket._id) {
        setSelectedTicket(updatedTicket);
      }
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
    });

    scrollToBottom();

    return () => {
      socket.emit('leave_room', `ticket_${selectedTicket._id}`);
      socket.off('new_message');
      socket.off('ticket_closed');
      socket.off('ticket_updated');
    };
  }, [view, selectedTicket?._id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isChat = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (isChat) setUploadingChatFile(true);
    else setUploadingFile(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (isChat) {
        setChatAttachments(prev => [...prev, data.url]);
      } else {
        setAttachments(prev => [...prev, data.url]);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      if (isChat) setUploadingChatFile(false);
      else setUploadingFile(false);
    }
  };

  // Submit Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      setFormError('Please fill in both subject and description.');
      return;
    }
    
    setSubmittingTicket(true);
    setFormError('');

    try {
      const { data } = await api.post('/api/tickets', {
        subject,
        category,
        description,
        orderId,
        attachments,
        priority
      });

      setTickets(prev => [data, ...prev]);
      setSubject('');
      setDescription('');
      setOrderId('');
      setAttachments([]);
      setPriority('Low');
      
      // Auto-open chat for the newly created ticket
      setSelectedTicket(data);
      setView('chat');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Send Reply in Chat
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && chatAttachments.length === 0) return;
    if (!selectedTicket) return;

    setSendingReply(true);
    try {
      await api.post(`/api/tickets/${selectedTicket._id}/messages`, {
        messageText: replyText,
        attachments: chatAttachments
      });
      setReplyText('');
      setChatAttachments([]);
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Close Ticket
  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      const { data } = await api.put(`/api/tickets/${selectedTicket._id}/close`);
      setSelectedTicket(data);
      setTickets(prev => prev.map(t => t._id === data._id ? data : t));
      setShowRating(true); // Ask for feedback
    } catch (err) {
      console.error('Failed to close ticket:', err);
    }
  };

  // Submit Rating Feedback
  const handleSubmitRating = async () => {
    if (!selectedTicket) return;
    setSubmittingRating(true);
    try {
      const { data } = await api.put(`/api/tickets/${selectedTicket._id}/rate`, {
        rating: ratingVal,
        feedback: ratingFeedback
      });
      setSelectedTicket(data);
      setShowRating(false);
      setRatingVal(5);
      setRatingFeedback('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Closed': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-500 font-bold';
      case 'Medium': return 'text-yellow-500 font-semibold';
      case 'Low': return 'text-zinc-500';
    }
  };

  return (
    <div className="w-full pb-24 md:pb-0 text-zinc-800 dark:text-zinc-150">
      
      {/* ================== LIST VIEW ================== */}
      {view === 'list' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase mb-1">Customer Care Center</h1>
              <p className="text-zinc-650 dark:text-gray-400 font-poppins text-xs">Need help? Raise a ticket or chat with support agents.</p>
            </div>
            <button 
              onClick={() => setView('create')}
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 text-xs font-montserrat font-bold uppercase tracking-wider rounded transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Raise Ticket</span>
            </button>
          </div>

          {/* Quick Support Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setView('create')}
              className="flex items-center p-5 bg-zinc-550/5 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-all group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#ff0033]/20 transition-colors">
                <FileText className="text-[#ff0033]" size={18} />
              </div>
              <div>
                <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold text-xs">File Ticket</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-poppins">Report order issues</p>
              </div>
            </button>

            <Link 
              href="/faq"
              className="flex items-center p-5 bg-zinc-550/5 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-all group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-150 dark:bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
                <HelpCircle className="text-zinc-500" size={18} />
              </div>
              <div>
                <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold text-xs">FAQs</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-poppins">Browse quick guides</p>
              </div>
            </Link>

            <Link 
              href="/contact"
              className="flex items-center p-5 bg-zinc-550/5 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-all group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-150 dark:bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
                <HeadphonesIcon className="text-zinc-500" size={18} />
              </div>
              <div>
                <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold text-xs">Support Lines</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-poppins">Get support email & phone</p>
              </div>
            </Link>
          </div>

          {/* Tickets List */}
          <div className="pt-6 border-t border-zinc-200 dark:border-white/5">
            <h2 className="text-lg font-bebas text-zinc-900 dark:text-white tracking-widest uppercase mb-4">Your Support Tickets</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tickets.length > 0 ? (
              <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                {tickets.map((ticket, idx) => (
                  <button 
                    key={ticket._id}
                    onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors ${
                      idx !== tickets.length - 1 ? 'border-b border-zinc-200 dark:border-[#1a1a1a]' : ''
                    }`}
                  >
                    <div className="space-y-1 truncate pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-zinc-400 font-mono">#{ticket._id.substring(0, 10)}</span>
                        <span className="text-[10px] uppercase font-montserrat font-bold text-[#ff0033] tracking-wider">{ticket.category}</span>
                      </div>
                      <h4 className="font-montserrat font-bold text-xs text-black dark:text-white truncate">{ticket.subject}</h4>
                      <p className="text-[10px] text-zinc-500 font-poppins truncate max-w-md">{ticket.description}</p>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className="text-right space-y-1 hidden sm:block">
                        <span className={`text-[8px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <p className="text-[9px] font-montserrat text-zinc-500 uppercase">Priority: {getPriorityBadge(ticket.priority)}</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-200 dark:border-white/5 font-poppins">
                <FileText className="text-zinc-400 mb-3" size={28} />
                <p className="text-zinc-500 dark:text-gray-500 text-xs">You have no active support tickets.</p>
                <button 
                  onClick={() => setView('create')}
                  className="mt-4 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-5 py-2 rounded-lg text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all"
                >
                  Create Your First Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== CREATE TICKET VIEW ================== */}
      {view === 'create' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/5">
            <button 
              onClick={() => { setView('list'); setFormError(''); }}
              className="flex items-center space-x-1.5 text-zinc-500 hover:text-black dark:hover:text-white font-montserrat text-xs tracking-wider uppercase font-bold"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <h2 className="text-lg font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">Raise Support Ticket</h2>
          </div>

          <form onSubmit={handleCreateTicket} className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 space-y-5 font-poppins">
            {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">{formError}</div>}

            <div className="space-y-1">
              <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly state the issue"
                className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm animate-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm"
                >
                  <option value="Order Issue">Order Issue</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Order ID (Optional)</label>
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 64b8a1c9ef28..."
                className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Details Description</label>
              <textarea 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail. If it's about an order, please specify size/color errors."
                className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm resize-none"
                required
              ></textarea>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Attach Screenshots</label>
              <div className="flex flex-wrap gap-3 items-center">
                {attachments.map((img, i) => (
                  <div key={i} className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden relative">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0 right-0 bg-black/85 text-white p-0.5 hover:text-[#ff0033] rounded-bl text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {attachments.length < 3 && (
                  <label className="w-16 h-16 border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-[#ff0033]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors">
                    {uploadingFile ? (
                      <Loader2 className="animate-spin text-[#ff0033]" size={16} />
                    ) : (
                      <>
                        <Camera size={18} className="text-zinc-500" />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Upload</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, false)} 
                      disabled={uploadingFile} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={submittingTicket}
                className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-3 rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-[#ff0033]/15"
              >
                {submittingTicket && <Loader2 className="animate-spin mr-2" size={14} />}
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================== CHAT / MESSAGE VIEW ================== */}
      {view === 'chat' && selectedTicket && (
        <div className="flex flex-col h-[70vh] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.005] shadow-lg relative">
          
          {/* Header */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 truncate">
              <button 
                onClick={() => { setView('list'); setSelectedTicket(null); fetchTickets(); }}
                className="text-zinc-500 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-zinc-150 dark:hover:bg-white/5"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] text-zinc-400 font-mono">#{selectedTicket._id.substring(0, 10)}</span>
                  <span className={`text-[8px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h4 className="font-montserrat font-bold text-xs text-black dark:text-white truncate">{selectedTicket.subject}</h4>
              </div>
            </div>
            
            {selectedTicket.status !== 'Closed' && (
              <button 
                onClick={handleCloseTicket}
                className="text-zinc-500 hover:text-[#ff0033] border border-zinc-200 dark:border-white/10 hover:border-[#ff0033]/20 px-3 py-1.5 rounded-lg text-[9px] font-montserrat font-bold uppercase tracking-wider transition-all"
              >
                Close Ticket
              </button>
            )}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-zinc-50/50 dark:bg-black/10">
            
            {/* Initial description card */}
            <div className="p-4 bg-zinc-100/50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-xl space-y-2 text-xs">
              <span className="font-montserrat font-bold text-[9px] text-[#ff0033] uppercase tracking-wider">Ticket Details</span>
              <p className="text-zinc-800 dark:text-zinc-300 font-poppins">{selectedTicket.description}</p>
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div className="flex gap-2 pt-1 flex-wrap">
                  {selectedTicket.attachments.map((img, i) => (
                    <div key={i} className="w-12 h-12 rounded border border-zinc-200 dark:border-white/5 overflow-hidden">
                      <img src={optimizeImageUrl(img, 100)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Thread */}
            {selectedTicket.messages && selectedTicket.messages.map((msg, i) => {
              const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'coadmin';
              return (
                <div 
                  key={i}
                  className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4.5 space-y-1.5 ${
                    isAdmin 
                      ? 'bg-zinc-150 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 rounded-tl-none' 
                      : 'bg-[#ff0033] text-white rounded-tr-none shadow-[0_4px_12px_rgba(255,0,51,0.15)]'
                  }`}>
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-montserrat font-bold opacity-60">
                      <span>{msg.senderName} ({msg.senderRole})</span>
                      <span className="ml-4 font-normal text-[8px]">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-xs font-poppins leading-relaxed font-medium whitespace-pre-wrap">{msg.messageText}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-1.5">
                        {msg.attachments.map((img, idx) => (
                          <div key={idx} className="w-20 h-20 bg-black/10 rounded-lg overflow-hidden border border-white/10">
                            <img src={optimizeImageUrl(img, 200)} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Form / Inputs Footer */}
          {selectedTicket.status !== 'Closed' ? (
            <form onSubmit={handleSendReply} className="p-3 bg-zinc-50 dark:bg-[#070707] border-t border-zinc-200 dark:border-white/5 flex items-end space-x-2 flex-shrink-0">
              
              {/* Image attachment button */}
              <div className="flex-shrink-0">
                <label className="w-10 h-10 border border-zinc-300 dark:border-white/10 hover:border-[#ff0033]/50 rounded-xl flex items-center justify-center cursor-pointer transition-colors bg-white dark:bg-white/5">
                  {uploadingChatFile ? (
                    <Loader2 className="animate-spin text-[#ff0033]" size={16} />
                  ) : (
                    <Camera size={18} className="text-zinc-500" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, true)} 
                    disabled={uploadingChatFile} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Chat Input */}
              <div className="flex-1 relative">
                {chatAttachments.length > 0 && (
                  <div className="absolute bottom-[44px] left-0 right-0 p-2 bg-zinc-100 dark:bg-zinc-950/90 border border-zinc-200 dark:border-white/5 rounded-t-xl flex gap-2">
                    {chatAttachments.map((img, i) => (
                      <div key={i} className="w-10 h-10 bg-zinc-200 rounded relative">
                        <img src={img} alt="" className="w-full h-full object-cover rounded" />
                        <button 
                          type="button"
                          onClick={() => setChatAttachments(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  rows={1}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message..."
                  className={`w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] px-4 py-2.5 text-xs text-black dark:text-white outline-none resize-none no-scrollbar ${
                    chatAttachments.length > 0 ? 'rounded-b-xl border-t-transparent' : 'rounded-xl'
                  }`}
                  style={{ maxHeight: '100px' }}
                />
              </div>

              {/* Send Button */}
              <button 
                type="submit"
                disabled={sendingReply || uploadingChatFile}
                className="w-10 h-10 rounded-xl bg-[#ff0033] hover:bg-[#cc0029] text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-md shadow-[#ff0033]/10"
              >
                {sendingReply ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-zinc-100 dark:bg-white/5 border-t border-zinc-200 dark:border-white/5 flex items-center justify-center text-xs text-zinc-500 font-poppins space-x-2 flex-shrink-0">
              <Lock size={14} />
              <span>This ticket is closed. Submit a new ticket if you still need assistance.</span>
            </div>
          )}

          {/* Support Rating Overlay (if closed and not yet rated) */}
          {showRating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-5 text-center font-poppins">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center rounded-full mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bebas text-black dark:text-white tracking-widest uppercase">Support Experience</h3>
                  <p className="text-zinc-550 dark:text-gray-400 text-xs mt-1">Please rate your support session to help us improve.</p>
                </div>

                {/* Stars */}
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setRatingVal(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star size={28} className={star <= ratingVal ? "fill-[#ff0033] text-[#ff0033]" : "text-gray-500"} />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="Feedback comments..."
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg p-3 text-xs outline-none text-black dark:text-white resize-none"
                />

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={() => setShowRating(false)}
                    className="flex-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-200 dark:border-white/10 py-2.5 rounded-lg text-xs font-montserrat font-bold uppercase text-zinc-550 dark:text-gray-400"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleSubmitRating}
                    disabled={submittingRating}
                    className="flex-1 bg-[#ff0033] hover:bg-[#cc0029] text-white py-2.5 rounded-lg text-xs font-montserrat font-bold uppercase tracking-wider flex justify-center items-center shadow-lg"
                  >
                    {submittingRating && <Loader2 className="animate-spin mr-1" size={12} />}
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
