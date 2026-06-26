import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';
import { theme } from './src/constants';
import { usePersistSubscriptions, useCloudSync } from './src/utils';
import {
  requestNotificationPermissions,
  initPurchases,
  getCustomerInfo,
  addCustomerInfoListener,
} from './src/services';
import { setProStatus } from './src/store';
import {
  HomeScreen,
  AddSubscriptionScreen,
  SubscriptionDetailScreen,
  AuthScreen,
  PaywallScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();

function AppContent() {
  const dispatch = useDispatch();
  usePersistSubscriptions();
  useCloudSync();

  useEffect(() => {
    requestNotificationPermissions();
    initPurchases();
    getCustomerInfo().then((isPro) => dispatch(setProStatus(isPro)));
    addCustomerInfoListener((isPro) => dispatch(setProStatus(isPro)));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.textPrimary,
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Renewly' }}
        />
        <Stack.Screen
          name="AddSubscription"
          component={AddSubscriptionScreen}
          options={{ title: 'Add Subscription' }}
        />
        <Stack.Screen
          name="SubscriptionDetail"
          component={SubscriptionDetailScreen}
          options={{ title: 'Edit Subscription' }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Sync' }}
        />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ title: 'Renewly Pro', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
