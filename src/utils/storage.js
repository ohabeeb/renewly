import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@renewly/subscriptions';

export const saveSubscriptions = async (items) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save subscriptions', e);
  }
};

export const loadSubscriptions = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load subscriptions', e);
    return [];
  }
};
