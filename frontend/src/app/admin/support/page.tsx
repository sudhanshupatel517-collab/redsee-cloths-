'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/axios';
import { 
  Headphones, 
  Search, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Send, 
  Camera, 
  Loader2, 
  UserPlus, 
  AlertTriangle,
  FolderOpen,
  ArrowLeft,
  XCircle,
  FileText,
  User,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  ShieldAlert
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

interface InternalNote {
  note: string;
  adminName: string;
  createdAt: string;
  _id?: string;
}

interface Ticket {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  orderId?: string;
  subject: string;
  category: string;
  description: string;
  attachments?: string[];
  status: 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedAdmin?: {
    _id: string;
    name: string;
    avatar?: string;
  } | null;
  messages: Message[];
  internalNotes: InternalNote[];
  createdAt: string;
  updatedAt: string;
}

export default function CustomerSupport() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  // Order search/CRM integration state
  const [orderSearchId, setOrderSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const fetchOrderDetails = async (id: string) => {
    if (!id || id.trim().length !== 8) {
      setOrderError('Please enter a valid 8-digit Order ID');
      setSearchedOrder(null);
      return;
    }
    setOrderLoading(true);
    setOrderError('');
    try {
      const { data } = await api.get(`/api/orders/${id}`);
      setSearchedOrder(data);
    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      setOrderError(err.response?.data?.message || 'Order not found');
      setSearchedOrder(null);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTicket && selectedTicket.orderId) {
      fetchOrderDetails(selectedTicket.orderId);
      setOrderSearchId(selectedTicket.orderId);
    } else {
      setSearchedOrder(null);
      setOrderSearchId('');
      setOrderError('');
    }
  }, [selectedTicket?._id, selectedTicket?.orderId]);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Chat/Messaging State
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Internal Notes State
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Sidebar / Chat view divider (for responsive mobile flow)
  const [activeChatPanel, setActiveChatPanel] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let query = `?search=${search}`;
      if (statusTab !== 'All') query += `&status=${statusTab}`;
      if (priorityFilter) query += `&priority=${priorityFilter}`;

      const { data } = await api.get(`/api/tickets/admin/all${query}`);
      setTickets(data || []);
      
      // If a ticket is currently selected, refresh its details from the list
      if (selectedTicket) {
        const refreshed = data.find((t: Ticket) => t._id === selectedTicket._id);
        if (refreshed) setSelectedTicket(refreshed);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusTab, priorityFilter]);

  // Real-time synchronization
  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.emit('join_room', 'admin_tickets');

    socket.on('ticket_created', (newTicket: Ticket) => {
      setTickets(prev => {
        if (prev.some(t => t._id === newTicket._id)) return prev;
        return [newTicket, ...prev];
      });
    });

    socket.on('ticket_updated', (updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
      if (selectedTicket && selectedTicket._id === updatedTicket._id) {
        setSelectedTicket(updatedTicket);
        scrollToBottom();
      }
    });

    return () => {
      socket.emit('leave_room', 'admin_tickets');
      socket.off('ticket_created');
      socket.off('ticket_updated');
    };
  }, [selectedTicket?._id]);

  // Room connection for active ticket chat
  useEffect(() => {
    if (!selectedTicket) return;

    const socket = getSocket();
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

    scrollToBottom();

    return () => {
      socket.emit('leave_room', `ticket_${selectedTicket._id}`);
      socket.off('new_message');
      socket.off('ticket_closed');
    };
  }, [selectedTicket?._id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  // Upload attachments
  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAttachments(prev => [...prev, data.url]);
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingFile(false);
    }
  };

  // Reply message
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && attachments.length === 0) return;
    if (!selectedTicket) return;

    setSendingReply(true);
    try {
      await api.post(`/api/tickets/${selectedTicket._id}/messages`, {
        messageText: replyText,
        attachments
      });
      setReplyText('');
      setAttachments([]);
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedTicket) return;

    setSubmittingNote(true);
    try {
      const { data } = await api.post(`/api/tickets/admin/${selectedTicket._id}/notes`, {
        note: noteText
      });
      setSelectedTicket(data);
      setNoteText('');
    } catch (err) {
      console.error('Failed to add internal note:', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Assign to Me
  const handleAssignToMe = async () => {
    if (!selectedTicket || !user) return;
    try {
      const { data } = await api.put(`/api/tickets/admin/${selectedTicket._id}`, {
        assignedAdmin: user._id
      });
      setSelectedTicket(data);
    } catch (err) {
      console.error('Assignment failed:', err);
    }
  };

  // Change status or priority
  const handleUpdateTicketMeta = async (fields: { status?: Ticket['status'], priority?: Ticket['priority'] }) => {
    if (!selectedTicket) return;
    try {
      const { data } = await api.put(`/api/tickets/admin/${selectedTicket._id}`, fields);
      setSelectedTicket(data);
    } catch (err) {
      console.error('Meta update failed:', err);
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-green-500/10 text-green-400 border-green-500/25';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Closed': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/25';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-zinc-500';
    }
  };

  return (
    <div className="w-full py-4 text-zinc-900 dark:text-zinc-150 font-poppins h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bebas tracking-widest text-[#ff0033] uppercase">Support Center</h1>
        <p className="text-zinc-550 dark:text-gray-400 text-sm mt-1">Manage customer queries, handle returns, review internal notes, and chat in real time.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden bg-zinc-550/5 dark:bg-white/[0.005] h-[72vh]">
        
        {/* ================== SIDEBAR: TICKETS LIST (4/12 cols) ================== */}
        <div className={`lg:col-span-4 border-r border-zinc-200 dark:border-white/5 flex flex-col h-full ${
          activeChatPanel ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/20">
            <div className="bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 flex items-center">
              <Search size={14} className="text-zinc-550 mr-2" />
              <input 
                type="text" 
                placeholder="Search subject, ID, order..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-black dark:text-white"
              />
            </div>
          </form>

          {/* Status Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/10 overflow-x-auto no-scrollbar text-[10px] font-montserrat font-bold">
            {['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-4 py-3 border-b-2 uppercase tracking-wider whitespace-nowrap transition-colors ${
                  statusTab === tab 
                    ? 'border-[#ff0033] text-[#ff0033]' 
                    : 'border-transparent text-zinc-550 hover:text-black dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tickets Scroll list */}
          <div className="flex-grow overflow-y-auto no-scrollbar bg-white/50 dark:bg-black/10">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-[#ff0033]" size={24} />
              </div>
            ) : tickets.length > 0 ? (
              <div className="divide-y divide-zinc-200 dark:divide-white/5">
                {tickets.map(ticket => {
                  const isSelected = selectedTicket?._id === ticket._id;
                  return (
                    <button
                      key={ticket._id}
                      onClick={() => { setSelectedTicket(ticket); setActiveChatPanel(true); }}
                      className={`w-full p-4 text-left block transition-colors ${
                        isSelected 
                          ? 'bg-[#ff0033]/10 dark:bg-[#ff0033]/5 border-l-4 border-[#ff0033]' 
                          : 'hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono text-zinc-500">#{ticket._id.substring(0, 10)}</span>
                        <span className={`text-[8px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="font-montserrat font-bold text-xs text-black dark:text-white truncate">{ticket.subject}</h4>
                      <p className="text-[10px] text-zinc-550 dark:text-zinc-500 font-poppins truncate mt-1">{ticket.description}</p>
                      
                      <div className="flex items-center justify-between mt-3 text-[9px] font-montserrat text-zinc-500 font-bold uppercase">
                        <span>User: {ticket.userId?.name || 'Customer'}</span>
                        <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-zinc-500">
                <FolderOpen size={24} className="mb-2" />
                <p className="text-xs font-poppins">No tickets matching the filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* ================== MAIN VIEW: SUPPORT CHAT & DETAILS (8/12 cols) ================== */}
        <div className={`lg:col-span-8 flex flex-col h-full bg-white dark:bg-white/[0.002] ${
          !activeChatPanel ? 'hidden lg:flex' : 'flex'
        }`}>
          {selectedTicket ? (
            <div className="flex flex-col h-full relative">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/30 flex items-center justify-between flex-shrink-0 flex-wrap gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <button 
                    onClick={() => setActiveChatPanel(false)}
                    className="lg:hidden text-zinc-500 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-zinc-150 dark:hover:bg-white/5"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] text-zinc-400 font-mono">#{selectedTicket._id}</span>
                      <span className={`text-[8px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <h3 className="font-montserrat font-bold text-xs text-black dark:text-white truncate">{selectedTicket.subject}</h3>
                  </div>
                </div>

                {/* Meta Controls (Priority, Assignee) */}
                <div className="flex items-center space-x-3 text-xs font-montserrat font-bold">
                  {/* Assigned Agent */}
                  {selectedTicket.assignedAdmin ? (
                    <div className="flex items-center space-x-1 text-zinc-650 bg-zinc-150 dark:bg-white/5 border border-zinc-200 dark:border-white/5 px-2.5 py-1.5 rounded-xl">
                      <User size={12} className="text-[#ff0033]" />
                      <span>{selectedTicket.assignedAdmin.name}</span>
                    </div>
                  ) : (
                    <button 
                      onClick={handleAssignToMe}
                      className="bg-[#ff0033]/15 hover:bg-[#ff0033]/25 border border-[#ff0033]/30 text-[#ff0033] px-2.5 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer"
                    >
                      <UserPlus size={12} />
                      <span>Assign to Me</span>
                    </button>
                  )}

                  {/* Priority Select */}
                  <select 
                    value={selectedTicket.priority}
                    onChange={(e) => handleUpdateTicketMeta({ priority: e.target.value as any })}
                    className="bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-gray-300 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                  {/* Status Select */}
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateTicketMeta({ status: e.target.value as any })}
                    className="bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-gray-300 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Central Panel Layout: Messages (left/middle) & CRM Details (right sidebar) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden h-full">
                
                {/* Chat feed (2 cols on large screen) */}
                <div className="md:col-span-2 flex flex-col h-full border-r border-zinc-200 dark:border-white/5 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-zinc-50/50 dark:bg-black/15">
                    {/* User ticket description block */}
                    <div className="p-4 bg-zinc-100/60 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-xl space-y-2 text-xs">
                      <span className="font-montserrat font-bold text-[9px] text-[#ff0033] uppercase tracking-wider">Ticket Description</span>
                      <p className="text-zinc-650 dark:text-zinc-300 font-poppins">{selectedTicket.description}</p>
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                        <div className="flex gap-2 flex-wrap pt-1">
                          {selectedTicket.attachments.map((img, i) => (
                            <div key={i} className="w-12 h-14 bg-zinc-200 rounded border border-zinc-300 dark:border-white/5 overflow-hidden">
                              <img src={optimizeImageUrl(img, 100)} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chat Messages */}
                    {selectedTicket.messages && selectedTicket.messages.map((msg, i) => {
                      const isStaff = msg.senderRole === 'admin' || msg.senderRole === 'coadmin';
                      return (
                        <div 
                          key={i}
                          className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl p-4 space-y-1.5 ${
                            isStaff 
                              ? 'bg-[#ff0033] text-white rounded-tr-none shadow-[0_4px_12px_rgba(255,0,51,0.15)]' 
                              : 'bg-zinc-150 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200 dark:border-white/5'
                          }`}>
                            <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-montserrat font-bold opacity-60">
                              <span>{msg.senderName} ({msg.senderRole})</span>
                              <span className="ml-4 font-normal text-[8px]">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs font-poppins leading-relaxed font-medium whitespace-pre-wrap">{msg.messageText}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex gap-2 flex-wrap pt-1">
                                {msg.attachments.map((img, idx) => (
                                  <div key={idx} className="w-16 h-16 bg-black/10 rounded-lg overflow-hidden border border-white/10">
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

                  {/* Messaging Inputs Footer */}
                  {selectedTicket.status !== 'Closed' ? (
                    <form onSubmit={handleSendReply} className="p-3 bg-zinc-50 dark:bg-[#070707] border-t border-zinc-200 dark:border-white/5 flex items-end space-x-2 flex-shrink-0">
                      <div className="flex-shrink-0">
                        <label className="w-10 h-10 border border-zinc-300 dark:border-white/10 hover:border-[#ff0033]/50 rounded-xl flex items-center justify-center cursor-pointer bg-white dark:bg-white/5 transition-colors">
                          {uploadingFile ? (
                            <Loader2 className="animate-spin text-[#ff0033]" size={16} />
                          ) : (
                            <Camera size={18} className="text-zinc-500" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleUploadAttachment} 
                            disabled={uploadingFile} 
                            className="hidden" 
                          />
                        </label>
                      </div>

                      <div className="flex-1 relative">
                        {attachments.length > 0 && (
                          <div className="absolute bottom-[44px] left-0 right-0 p-2 bg-zinc-100 dark:bg-zinc-950/95 border border-zinc-200 dark:border-white/5 rounded-t-xl flex gap-2">
                            {attachments.map((img, i) => (
                              <div key={i} className="w-10 h-10 bg-zinc-200 rounded relative">
                                <img src={img} alt="" className="w-full h-full object-cover rounded" />
                                <button 
                                  type="button"
                                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
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
                          placeholder="Type customer response..."
                          className={`w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] px-4 py-2.5 text-xs text-black dark:text-white outline-none resize-none no-scrollbar ${
                            attachments.length > 0 ? 'rounded-b-xl border-t-transparent' : 'rounded-xl'
                          }`}
                          style={{ maxHeight: '100px' }}
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={sendingReply || uploadingFile}
                        className="w-10 h-10 rounded-xl bg-[#ff0033] hover:bg-[#cc0029] text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-md shadow-[#ff0033]/15"
                      >
                        {sendingReply ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-zinc-100 dark:bg-white/5 border-t border-zinc-200 dark:border-white/5 flex items-center justify-center text-xs text-zinc-550 font-poppins space-x-2 flex-shrink-0">
                      <span>Closed Ticket. Adjust status dropdown to re-open chat.</span>
                    </div>
                  )}
                </div>

                {/* CRM Details Sidebar (1 col on large screen, hidden on mobile) */}
                <div className="hidden md:flex md:flex-col h-full overflow-y-auto no-scrollbar p-4 space-y-6 bg-zinc-50 dark:bg-zinc-950/20">
                  
                  {/* User Profile Info */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-zinc-500">Customer Info</h4>
                    <div className="bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-[#ff0033]">
                        {selectedTicket.userId?.avatar ? (
                          <img src={selectedTicket.userId.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-montserrat font-bold text-black dark:text-white truncate">{selectedTicket.userId?.name || 'Customer'}</p>
                        <p className="text-[10px] text-zinc-500 font-poppins truncate">{selectedTicket.userId?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Search / Associated Order details */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-zinc-500">Associated Order Lookup</h4>
                    
                    {/* Search Input */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 flex items-center">
                        <Search size={14} className="text-zinc-500 mr-2 flex-shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Search 8-digit Order ID..." 
                          value={orderSearchId}
                          onChange={(e) => setOrderSearchId(e.target.value)}
                          maxLength={8}
                          className="bg-transparent border-none outline-none text-xs w-full text-black dark:text-white font-mono"
                        />
                      </div>
                      <button 
                        onClick={() => fetchOrderDetails(orderSearchId)}
                        disabled={orderLoading || orderSearchId.trim().length !== 8}
                        className="bg-[#ff0033] hover:bg-[#cc0029] disabled:opacity-50 text-white text-[10px] font-montserrat font-bold px-3 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center uppercase tracking-wider cursor-pointer"
                      >
                        {orderLoading ? <Loader2 className="animate-spin" size={14} /> : 'Find'}
                      </button>
                    </div>

                    {orderError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] flex items-center space-x-1.5 font-poppins animate-pulse">
                        <ShieldAlert size={14} className="flex-shrink-0" />
                        <span>{orderError}</span>
                      </div>
                    )}

                    {/* Order Details Render */}
                    {searchedOrder ? (
                      <div className="bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl space-y-4 text-xs font-poppins">
                        
                        {/* Order Header info */}
                        <div className="border-b border-zinc-200 dark:border-white/5 pb-3.5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-xs text-black dark:text-white">ID: #{searchedOrder._id}</span>
                            <span className={`text-[8px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${
                              searchedOrder.orderStatus === 'Delivered' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : searchedOrder.orderStatus === 'Cancelled'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {searchedOrder.orderStatus}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-zinc-555 dark:text-zinc-400">
                            <span className="flex items-center"><Calendar size={10} className="mr-1" /> {new Date(searchedOrder.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center font-bold text-black dark:text-white text-xs">₹{searchedOrder.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Payment & Shipping Summary */}
                        <div className="space-y-2.5 text-[10px] border-b border-zinc-200 dark:border-white/5 pb-3.5 text-zinc-650 dark:text-zinc-300">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center"><CreditCard size={11} className="mr-1" /> Payment: {searchedOrder.paymentMethod}</span>
                            <span className={`font-bold uppercase ${
                              searchedOrder.paymentStatus === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                            }`}>{searchedOrder.paymentStatus}</span>
                          </div>

                          {searchedOrder.shippingAddress && (
                            <div className="space-y-1 bg-zinc-50 dark:bg-black/20 p-2.5 rounded-xl border border-zinc-200/50 dark:border-white/[0.03]">
                              <p className="font-bold flex items-center text-black dark:text-white"><MapPin size={11} className="mr-1 text-[#ff0033]" /> {searchedOrder.shippingAddress.name}</p>
                              <p className="text-[9px] pl-4">{searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.zipCode}</p>
                              {searchedOrder.shippingAddress.phone && (
                                <p className="text-[9px] pl-4 flex items-center mt-1"><Phone size={10} className="mr-1 text-zinc-400" /> {searchedOrder.shippingAddress.phone}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Products List in Order */}
                        <div className="space-y-3.5">
                          <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold flex items-center"><Package size={11} className="mr-1" /> Items ({searchedOrder.products?.length || 0})</p>
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                            {searchedOrder.products?.map((item: any, i: number) => {
                              const prod = item.product;
                              return (
                                <div key={i} className="flex space-x-2.5 items-center bg-zinc-50/50 dark:bg-black/10 p-2 rounded-xl border border-zinc-200/30 dark:border-white/[0.02]">
                                  <div className="w-10 h-11 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded overflow-hidden flex-shrink-0">
                                    {prod?.images?.[0] ? (
                                      <img src={optimizeImageUrl(prod.images[0], 100)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-400">?</div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1 text-[10px] space-y-0.5">
                                    <p className="font-montserrat font-bold text-black dark:text-white truncate">{prod?.name || 'Unknown Product'}</p>
                                    <p className="text-[9px] text-zinc-500">
                                      Qty: {item.quantity} | Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                                    </p>
                                    <p className="font-bold text-black dark:text-white">₹{item.price?.toFixed(2)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    ) : (
                      selectedTicket.orderId ? (
                        <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-[10px] text-zinc-500 bg-white/40 dark:bg-black/10">
                          <Loader2 size={16} className="animate-spin text-[#ff0033] mx-auto mb-1.5" />
                          <span>Fetching associated order #{selectedTicket.orderId}...</span>
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-[10px] text-zinc-500 bg-white/40 dark:bg-black/10">
                          No order associated with this ticket. Enter an ID above to search manually.
                        </div>
                      )
                    )}
                  </div>

                  {/* Internal Notes */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    <h4 className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-zinc-500">Internal CRM Notes</h4>
                    
                    {/* Notes List */}
                    <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar max-h-[180px]">
                      {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 ? (
                        selectedTicket.internalNotes.map((note) => (
                          <div 
                            key={note._id} 
                            className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl space-y-1 text-[11px]"
                          >
                            <div className="flex justify-between items-center text-[9px] font-montserrat font-bold text-yellow-600">
                              <span>{note.adminName}</span>
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="font-poppins text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {note.note}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-white/10 rounded-xl text-[10px] text-zinc-500">
                          No internal notes.
                        </div>
                      )}
                    </div>

                    {/* Add note form */}
                    <form onSubmit={handleAddNote} className="pt-2 flex gap-1.5 flex-shrink-0">
                      <input 
                        type="text" 
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add internal log..."
                        className="flex-1 bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none text-black dark:text-white focus:border-yellow-500"
                        required
                      />
                      <button 
                        type="submit"
                        disabled={submittingNote}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-montserrat font-bold px-3 rounded-lg text-[9px] uppercase tracking-wider"
                      >
                        {submittingNote ? '...' : 'Add'}
                      </button>
                    </form>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-zinc-500">
              <Headphones size={48} className="text-zinc-500 mb-3" />
              <h3 className="text-lg font-bebas tracking-widest text-black dark:text-white uppercase mb-1">Select A Support Ticket</h3>
              <p className="text-xs font-poppins max-w-sm">Select a customer query from the left list sidebar to begin resolving disputes and checking logs.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
