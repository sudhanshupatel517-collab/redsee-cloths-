'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plus, Search, Trash2, CalendarDays, CheckCircle, XCircle } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
  isActive: boolean;
}

export default function ManageEvents() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create Event State
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    link: ''
  });
  
  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchEvents();
  }, [user, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/events/admin');
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description || !newEvent.date) return;
    
    try {
      await api.post('/api/events', newEvent);
      setNewEvent({ title: '', description: '', imageUrl: '', date: '', link: '' });
      setIsCreating(false);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const deleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/events/${id}`);
        setEvents(events.filter((e) => e._id !== id));
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const toggleEventStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/events/${id}`, { isActive: !currentStatus });
      setEvents(events.map(e => e._id === id ? { ...e, isActive: !currentStatus } : e));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-white tracking-widest uppercase flex items-center">
              <CalendarDays className="mr-3 text-[#ff0033]" /> Event Announcements
            </h1>
            <p className="text-gray-400 font-poppins text-sm mt-1">Broadcast new collections, sales, and drops.</p>
          </div>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)]"
          >
            {isCreating ? <XCircle size={18} /> : <Plus size={18} />}
            <span>{isCreating ? 'Cancel' : 'New Event'}</span>
          </button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <form onSubmit={createEvent} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
            <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6">Create Announcement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Event Title</label>
                <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" placeholder="e.g. Winter Drop 2026" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Event Date & Time</label>
                <input required type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Description</label>
                <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none" placeholder="Details about this event..." />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Image URL (Optional)</label>
                <input type="text" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Target Link (Optional)</label>
                <input type="text" value={newEvent.link} onChange={e => setNewEvent({...newEvent, link: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" placeholder="/category/winter" />
              </div>
            </div>
            <button type="submit" className="bg-white text-black hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-colors">
              Publish Event
            </button>
          </form>
        )}

        {/* Search Bar */}
        <div className="relative w-full mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-white outline-none transition-colors font-poppins text-sm"
          />
        </div>

        {/* Events Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Event</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Date</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Visibility</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center space-x-3 text-gray-400">
                        <div className="w-5 h-5 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-poppins text-sm">Loading events...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 font-poppins text-sm">
                      No events found. Broadcast an announcement to your users!
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-center space-x-3">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title} className="w-12 h-12 object-cover rounded-md" />
                          ) : (
                            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
                              <CalendarDays className="text-gray-500" size={20} />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-bold font-poppins truncate">{event.title}</p>
                            <p className="text-gray-500 text-xs truncate mt-0.5">{event.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm font-poppins">{new Date(event.date).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleEventStatus(event._id, event.isActive)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                            event.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
                          }`}
                        >
                          {event.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          <span>{event.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => deleteEvent(event._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
