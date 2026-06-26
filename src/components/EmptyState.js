import { View, Text } from 'react-native';
import { theme } from '../constants';

export default function EmptyState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
      }}>
      <Text
        style={[
          theme.typography.h2,
          { color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
        ]}>
        No subscriptions yet
      </Text>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.textSecondary, textAlign: 'center' },
        ]}>
        Add the first one you're paying for — Netflix, Spotify, your gym,
        anything recurring.
      </Text>
    </View>
  );
}
