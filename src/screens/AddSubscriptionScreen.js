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
import { addSubscription, selectSubscriptionCount } from '../store';
import { scheduleRenewalReminder } from '../services';
import { selectIsPro } from '../store';

const FREE_TIER_LIMIT = 5;
const CURRENCIES = ['$', '₦', '€', '£'];

export default function AddSubscriptionScreen({ navigation }) {
  const dispatch = useDispatch();
  const subscriptionCount = useSelector(selectSubscriptionCount);

  const isPro = useSelector(selectIsPro);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [category, setCategory] = useState(categories[0].id);
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (subscriptionCount >= FREE_TIER_LIMIT) {
      Alert.alert(
        "You've hit the free limit",
        `Free accounts can track up to ${FREE_TIER_LIMIT} subscriptions. Upgrade to Pro for unlimited tracking.`,
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
        ]
      );
      return;
    }
    if (!name.trim()) {
      Alert.alert('Missing name', 'Give this subscription a name first.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount greater than zero.');
      return;
    }

    const action = dispatch(
      addSubscription({
        name: name.trim(),
        amount: numericAmount,
        currency,
        billingCycle,
        renewalDate: renewalDate.toISOString(),
        category,
      })
    );

    if (isPro) {
      const notificationId = await scheduleRenewalReminder(action.payload);
      dispatch(updateSubscription({ id: action.payload.id, notificationId }));
    }

    navigation.goBack();
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
        placeholder="e.g. Netflix"
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
          placeholder="0.00"
          placeholderTextColor={theme.colors.mist}
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
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setRenewalDate(selectedDate);
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
        }}>
        <Text
          style={[
            theme.typography.bodyBold,
            { color: theme.colors.textPrimary },
          ]}>
          Save subscription
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
