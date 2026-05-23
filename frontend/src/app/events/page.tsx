'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/api/events');
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ff0033]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bebas text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-widest uppercase mb-4">
            Announcements
          </h1>
          <p className="text-gray-400 font-poppins max-w-2xl mx-auto">
            Stay updated with the latest drops, exclusive sales, and community events from REDSEE.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[#ff0033] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-montserrat tracking-widest text-sm uppercase">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 glassmorphism-dark rounded-2xl border border-white/5">
            <CalendarDays size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bebas text-white tracking-widest mb-2">No Active Events</h2>
            <p className="text-gray-500 font-poppins text-sm">Check back later for new drops and announcements.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div 
                key={event._id}
                variants={itemVariants}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:border-[#ff0033]/50 transition-colors duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-black/50">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                      <CalendarDays size={48} className="mb-2" />
                      <span className="font-bebas tracking-widest text-xl">REDSEE EVENT</span>
                    </div>
                  )}
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-[#ff0033] font-bebas text-xl leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-white font-montserrat text-xs font-bold uppercase tracking-widest mt-1">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bebas text-white tracking-widest uppercase mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 font-poppins text-sm mb-6 flex-1 line-clamp-4">
                    {event.description}
                  </p>

                  {/* Action Link */}
                  {event.link && (
                    <Link href={event.link} className="mt-auto">
                      <button className="w-full bg-white/5 hover:bg-[#ff0033] border border-white/10 hover:border-[#ff0033] text-white py-3 rounded-lg flex items-center justify-center space-x-2 font-montserrat font-bold tracking-widest text-xs uppercase transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                        <span>Explore Event</span>
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
