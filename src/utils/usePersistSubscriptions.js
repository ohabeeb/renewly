import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hydrate, selectAllSubscriptions, selectIsHydrated } from '../store';
import { loadSubscriptions, saveSubscriptions } from './storage';

export const usePersistSubscriptions = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectAllSubscriptions);
  const isHydrated = useSelector(selectIsHydrated);
  const hasLoaded = useRef(false);

  // Load once on boot
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadSubscriptions().then((stored) => {
        dispatch(hydrate(stored));
      });
    }
  }, [dispatch]);

  // Save any time the list changes, but only after hydration completes
  useEffect(() => {
    if (isHydrated) {
      saveSubscriptions(items);
    }
  }, [items, isHydrated]);

  return isHydrated;
};