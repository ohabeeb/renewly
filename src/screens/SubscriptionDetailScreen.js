import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { theme, categories } from '../constants';
import { CategoryPill } from '../components';
import { rescheduleRenewalReminder, cancelRenewalReminder } from '../services';
import {
  updateSubscription,
  deleteSubscription,
  selectAllSubscriptions,
  selectIsPro,
} from '../store';

const CURRENCIES = ['$', '₦', '€', '£'];

export default function SubscriptionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const subscription = useSelector(selectAllSubscriptions).find(
    (s) => s.id === id
  );
  const isPro = useSelector(selectIsPro);
  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(String(subscription.amount));
  const [currency, setCurrency] = useState(subscription.currency);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
  const [category, setCategory] = useState(subscription.category);
  const [renewalDate, setRenewalDate] = useState(
    new Date(subscription.renewalDate)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!name.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        'Check your details',
        'Name and a valid amount are required.'
      );
      return;
    }
    dispatch(
      updateSubscription({
        id,
        name: name.trim(),
        amount: numericAmount,
        currency,
        billingCycle,
        category,
        renewalDate: renewalDate.toISOString(),
      })
    );
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete subscription?',
      `This removes ${subscription.name} permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (subscription.notificationId) {
              await cancelRenewalReminder(subscription.notificationId);
            }
            dispatch(deleteSubscription(id));
            navigation.goBack();
          },
        },
      ]
    );
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.md }}>
      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.mist, marginBottom: theme.spacing.xs },
        ]}>
        Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.mist}
        style={[
          theme.typography.body,
          {
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.md,
          },
        ]}
      />

      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.mist, marginBottom: theme.spacing.xs },
        ]}>
        Amount
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
        {CURRENCIES.map((symbol) => (
          <TouchableOpacity
            key={symbol}
            onPress={() => setCurrency(symbol)}
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.radius.md,
              backgroundColor:
                currency === symbol
                  ? theme.colors.primary
                  : theme.colors.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.xs,
            }}>
            <Text
              style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>
              {symbol}
            </Text>
          </TouchableOpacity>
        ))}
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={[
            theme.typography.body,
            {
              flex: 1,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: theme.spacing.sm,
            },
          ]}
        />
      </View>

      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.mist, marginBottom: theme.spacing.xs },
        ]}>
        Billing cycle
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
        {['monthly', 'yearly'].map((cycle) => (
          <TouchableOpacity
            key={cycle}
            onPress={() => setBillingCycle(cycle)}
            style={{
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.full,
              backgroundColor:
                billingCycle === cycle
                  ? theme.colors.primary
                  : theme.colors.surfaceElevated,
              marginRight: theme.spacing.xs,
            }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '600',
                textTransform: 'capitalize',
              }}>
              {cycle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.mist, marginBottom: theme.spacing.xs },
        ]}>
        Category
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: theme.spacing.md,
        }}>
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            category={c}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </View>

      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.mist, marginBottom: theme.spacing.xs },
        ]}>
        Renewal date
      </Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.sm,
          marginBottom: theme.spacing.lg,
        }}>
        <Text
          style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
          {renewalDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={renewalDate}
          mode="date"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setRenewalDate(d);
          }}
        />
      )}

      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          alignItems: 'center',
          marginBottom: theme.spacing.sm,
        }}>
        <Text
          style={[
            theme.typography.bodyBold,
            { color: theme.colors.textPrimary },
          ]}>
          Save changes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDelete}
        style={{ padding: theme.spacing.md, alignItems: 'center' }}>
        <Text
          style={[theme.typography.bodyBold, { color: theme.colors.danger }]}>
          Delete subscription
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
