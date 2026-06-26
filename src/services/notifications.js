import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('renewals', {
      name: 'Renewal Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleRenewalReminder = async (subscription) => {
  const reminderDate = new Date(subscription.renewalDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(9, 0, 0, 0);

  if (reminderDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Subscription renewing tomorrow',
      body: `${subscription.name} renews for ${subscription.currency}${subscription.amount} tomorrow.`,
    },
    trigger: reminderDate,
  });
};

export const cancelRenewalReminder = async (notificationId) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    console.warn('Failed to cancel notification', e);
  }
};

export const rescheduleRenewalReminder = async (
  oldNotificationId,
  subscription
) => {
  await cancelRenewalReminder(oldNotificationId);
  return scheduleRenewalReminder(subscription);
};
