import { View, Text, TouchableOpacity } from 'react-native';
import { theme, categories } from '../constants';

const getDaysUntil = (renewalDate) => {
  const today = new Date();
  const target = new Date(renewalDate);
  const diffMs = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export default function SubscriptionCard({ subscription, onPress }) {
  const category = categories.find((c) => c.id === subscription.category) || categories[4];
  const daysUntil = getDaysUntil(subscription.renewalDate);
  const dueSoon = daysUntil <= 3;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        theme.radius && { borderRadius: theme.radius.lg },
        {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: theme.radius.full,
              backgroundColor: category.color,
              marginRight: theme.spacing.xs,
            }}
          />
          <Text style={[theme.typography.eyebrow, { color: theme.colors.mist }]}>
            {category.label}
          </Text>
        </View>
        <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>
          {subscription.name}
        </Text>
        <Text style={[theme.typography.caption, { color: dueSoon ? theme.colors.danger : theme.colors.textSecondary, marginTop: 2 }]}>
          {daysUntil < 0 ? 'Overdue' : daysUntil === 0 ? 'Due today' : `Renews in ${daysUntil}d`}
        </Text>
      </View>
      <Text style={[theme.typography.bodyBold, { color: theme.colors.textPrimary }]}>
        {subscription.currency}{subscription.amount}
      </Text>
    </TouchableOpacity>
  );
}