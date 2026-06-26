// src/screens/HomeScreen.js — full replace
import { View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '../constants';
import { SubscriptionCard, EmptyState } from '../components';
import {
  selectSubscriptionsSortedByRenewal,
  selectIsPro,
  selectUser,
} from '../store';

export default function HomeScreen({ navigation }) {
  const subscriptions = useSelector(selectSubscriptionsSortedByRenewal);
  const isPro = useSelector(selectIsPro);
  const user = useSelector(selectUser);

  const handleSyncPress = () => {
    if (!isPro) {
      navigation.navigate('Paywall');
      return;
    }
    navigation.navigate('Auth');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.md,
      }}>
      <TouchableOpacity
        onPress={handleSyncPress}
        style={{ alignSelf: 'flex-end', paddingVertical: theme.spacing.sm }}>
        <Text
          style={[
            theme.typography.caption,
            { color: user ? theme.colors.success : theme.colors.mist },
          ]}>
          {user ? 'Synced' : 'Sync'}
        </Text>
      </TouchableOpacity>

      {subscriptions.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.xl,
          }}
          renderItem={({ item }) => (
            <SubscriptionCard
              subscription={item}
              onPress={() =>
                navigation.navigate('SubscriptionDetail', { id: item.id })
              }
            />
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('AddSubscription')}
        style={{
          position: 'absolute',
          bottom: theme.spacing.lg * 4,
          right: theme.spacing.lg,
          width: 56,
          height: 56,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
        }}>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
