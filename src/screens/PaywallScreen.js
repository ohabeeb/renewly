import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { theme } from '../constants';
import { getOfferings, purchasePackage, restorePurchases } from '../services';
import { setProStatus } from '../store';

const FEATURES = [
  'Unlimited subscriptions tracked',
  'Renewal push reminders',
  'Cloud sync across devices',
  'Spend analytics & insights',
];

export default function PaywallScreen({ navigation }) {
  const dispatch = useDispatch();
  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    getOfferings().then((current) => {
      setOffering(current);
      setLoading(false);
    });
  }, []);

  const handlePurchase = async (pkg) => {
    setPurchasing(true);
    try {
      const isPro = await purchasePackage(pkg);
      dispatch(setProStatus(isPro));
      if (isPro) navigation.goBack();
    } catch (e) {
      if (!e.userCancelled) Alert.alert('Purchase failed', e.message || 'Something went wrong.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const isPro = await restorePurchases();
      dispatch(setProStatus(isPro));
      if (isPro) navigation.goBack();
      else Alert.alert('Nothing to restore', "No active Pro subscription found for this account.");
    } catch (e) {
      Alert.alert('Restore failed', e.message || 'Something went wrong.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={[theme.typography.h1, { color: theme.colors.accent, marginBottom: theme.spacing.xs }]}>Renewly Pro</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
        Never lose track of what you're paying for.
      </Text>

      <View style={{ marginBottom: theme.spacing.xl }}>
        {FEATURES.map((feature) => (
          <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Text style={{ color: theme.colors.accent, marginRight: theme.spacing.xs, fontSize: 16 }}>✓</Text>
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>{feature}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : offering?.availablePackages?.length ? (
        offering.availablePackages.map((pkg) => (
          <TouchableOpacity
            key={pkg.identifier}
            onPress={() => handlePurchase(pkg)}
            disabled={purchasing}
            style={{ backgroundColor: theme.colors.surfaceElevated, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.accent, padding: theme.spacing.md, marginBottom: theme.spacing.sm }}
          >
            <Text style={[theme.typography.bodyBold, { color: theme.colors.textPrimary }]}>{pkg.product.title}</Text>
            <Text style={[theme.typography.body, { color: theme.colors.mist }]}>{pkg.product.priceString}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>No plans available right now — check back shortly.</Text>
      )}

      <TouchableOpacity onPress={handleRestore} disabled={purchasing} style={{ alignItems: 'center', padding: theme.spacing.md }}>
        <Text style={[theme.typography.caption, { color: theme.colors.mist }]}>Restore purchases</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}