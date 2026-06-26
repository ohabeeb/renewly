import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  android: 'goog_KBQdZsiymngkbGCPYxFFFcjozeG',
  testStore: 'test_hqVHDqyljjjeJDgWLinxEjKQCGk',
};

const ENTITLEMENT_ID = 'Renewly Pro';

export const initPurchases = () => {
  Purchases.configure({
    apiKey: API_KEYS.testStore,
  });
};

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    console.warn('Failed to fetch offerings', e);
    return null;
  }
};

const checkEntitlement = (customerInfo) =>
  typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';

export const purchasePackage = async (pkg) => {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return checkEntitlement(customerInfo);
};

export const restorePurchases = async () => {
  const customerInfo = await Purchases.restorePurchases();
  return checkEntitlement(customerInfo);
};

export const getCustomerInfo = async () => {
  const customerInfo = await Purchases.getCustomerInfo();
  return checkEntitlement(customerInfo);
};

export const addCustomerInfoListener = (callback) => {
  Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    callback(checkEntitlement(customerInfo));
  });
};
