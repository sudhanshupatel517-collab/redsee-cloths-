'use client';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  fetchWishlist, 
  mergeWishlistBackend, 
  loadWishlistLocal 
} from '@/store/wishlistSlice';
import api from '@/lib/axios';

export default function WishlistSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const syncInProgress = useRef(false);

  useEffect(() => {
    const syncWishlist = async () => {
      if (isAuthenticated) {
        if (syncInProgress.current) return;
        syncInProgress.current = true;
        
        try {
          const localWishlistStr = localStorage.getItem('redsee_wishlist');
          if (localWishlistStr) {
            const parsedWishlist = JSON.parse(localWishlistStr);
            if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
              // Merge local storage wishlist into MongoDB database
              await dispatch(mergeWishlistBackend(parsedWishlist)).unwrap();
              // After successful merge, remove guest tracking item
              localStorage.removeItem('redsee_wishlist');
            }
          }
          // Fetch final database records
          dispatch(fetchWishlist());
        } catch (error) {
          console.error('Failed to merge or fetch wishlist:', error);
          // Fetch backend records regardless of merge failure
          dispatch(fetchWishlist());
        } finally {
          syncInProgress.current = false;
        }
      } else {
        // Guest user logic: Read local IDs and batch query database details
        try {
          const localWishlistStr = localStorage.getItem('redsee_wishlist');
          if (localWishlistStr) {
            const parsedWishlist = JSON.parse(localWishlistStr);
            if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
              const ids = parsedWishlist.filter(Boolean);
              if (ids.length > 0) {
                const { data } = await api.post('/api/products/batch', { ids });
                dispatch(loadWishlistLocal(data));
              } else {
                dispatch(loadWishlistLocal([]));
              }
            } else {
              dispatch(loadWishlistLocal([]));
            }
          } else {
            dispatch(loadWishlistLocal([]));
          }
        } catch (error) {
          console.error('Failed to load guest wishlist details from database:', error);
          dispatch(loadWishlistLocal([]));
        }
      }
    };

    syncWishlist();
  }, [isAuthenticated, dispatch]);

  return null;
}
