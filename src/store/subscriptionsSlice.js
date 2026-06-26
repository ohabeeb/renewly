import { createSlice, nanoid } from '@reduxjs/toolkit';

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    items: [],
    hydrated: false,
  },
  reducers: {
    hydrate: (state, action) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    addSubscription: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: ({
        name,
        amount,
        currency,
        billingCycle,
        renewalDate,
        category,
        notes,
      }) => ({
        payload: {
          id: nanoid(),
          name,
          amount,
          currency,
          billingCycle,
          renewalDate,
          category,
          notes: notes || '',
        },
      }),
    },
    updateSubscription: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteSubscription: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  hydrate,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} = subscriptionsSlice.actions;

export const selectAllSubscriptions = (state) => state.subscriptions.items;
export const selectSubscriptionCount = (state) =>
  state.subscriptions.items.length;
export const selectIsHydrated = (state) => state.subscriptions.hydrated;
export const selectSubscriptionsSortedByRenewal = (state) =>
  [...state.subscriptions.items].sort(
    (a, b) => new Date(a.renewalDate) - new Date(b.renewalDate)
  );

export default subscriptionsSlice.reducer;
