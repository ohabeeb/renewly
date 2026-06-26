import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../services';
import {
  selectUser,
  selectIsPro,
  selectAllSubscriptions,
  hydrate,
} from '../store';

const mapLocalToRow = (item, userId) => ({
  id: item.id,
  user_id: userId,
  name: item.name,
  amount: item.amount,
  currency: item.currency,
  billing_cycle: item.billingCycle,
  renewal_date: item.renewalDate,
  category: item.category,
  notification_id: item.notificationId || null,
});

const mapRowToLocal = (row) => ({
  id: row.id,
  name: row.name,
  amount: row.amount,
  currency: row.currency,
  billingCycle: row.billing_cycle,
  renewalDate: row.renewal_date,
  category: row.category,
  notificationId: row.notification_id,
});

export const useCloudSync = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isPro = useSelector(selectIsPro);
  const items = useSelector(selectAllSubscriptions);
  const hasPulled = useRef(false);

  useEffect(() => {
    if (user && isPro && !hasPulled.current) {
      hasPulled.current = true;
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (error) return console.warn('Cloud pull failed', error);
          if (data?.length) dispatch(hydrate(data.map(mapRowToLocal)));
        });
    }
    if (!user) hasPulled.current = false;
  }, [user, isPro, dispatch]);

  useEffect(() => {
    if (!user || !isPro || items.length === 0) return;
    const rows = items.map((item) => mapLocalToRow(item, user.id));
    supabase
      .from('subscriptions')
      .upsert(rows)
      .then(({ error }) => {
        if (error) console.warn('Cloud push failed', error);
      });
  }, [items, user, isPro]);
};
