// src/store/index.js — full replace
import { configureStore } from '@reduxjs/toolkit';
import subscriptionsReducer from './subscriptionsSlice';
import proStatusReducer from './proStatusSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    subscriptions: subscriptionsReducer,
    proStatus: proStatusReducer,
    auth: authReducer,
  },
});

export * from './subscriptionsSlice';
export * from './proStatusSlice';
export * from './authSlice';
