'use client';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  fetchRecentlyViewed, 
  mergeRecentlyViewedBackend, 
  loadRecentlyViewedLocal 
} from '@/store/recentlyViewedSlice';
import api from '@/lib/axios';

export default function RecentlyViewedSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const syncInProgress = useRef(false);

  useEffect(() => {
    const syncHistory = async () => {
      if (isAuthenticated) {
        if (syncInProgress.current) return;
        syncInProgress.current = true;
        
        try {
          const localHistoryStr = localStorage.getItem('redsee_recently_viewed');
          if (localHistoryStr) {
            const parsedHistory = JSON.parse(localHistoryStr);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              // Merge local storage history into MongoDB database
              await dispatch(mergeRecentlyViewedBackend(parsedHistory)).unwrap();
              // After successful merge, remove guest tracking item
              localStorage.removeItem('redsee_recently_viewed');
            }
          }
          // Fetch final database records
          dispatch(fetchRecentlyViewed());
        } catch (error) {
          console.error('Failed to merge or fetch recently viewed history:', error);
          // Fetch backend records regardless of merge failure
          dispatch(fetchRecentlyViewed());
        } finally {
          syncInProgress.current = false;
        }
      } else {
        // Guest user logic: Read local IDs and batch query database details
        try {
          const localHistoryStr = localStorage.getItem('redsee_recently_viewed');
          if (localHistoryStr) {
            const parsedHistory = JSON.parse(localHistoryStr);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              const ids = parsedHistory.map((item: any) => item.productId).filter(Boolean);
              if (ids.length > 0) {
                const { data } = await api.post('/api/products/batch', { ids });
                dispatch(loadRecentlyViewedLocal(data));
              } else {
                dispatch(loadRecentlyViewedLocal([]));
              }
            } else {
              dispatch(loadRecentlyViewedLocal([]));
            }
          } else {
            dispatch(loadRecentlyViewedLocal([]));
          }
        } catch (error) {
          console.error('Failed to load guest recently viewed details from database:', error);
          dispatch(loadRecentlyViewedLocal([]));
        }
      }
    };

    syncHistory();
  }, [isAuthenticated, dispatch]);

  return null;
}
