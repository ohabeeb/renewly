import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { theme } from '../constants';
import { supabase } from '../services';
import { setUser } from '../store';

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('email');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter your email to sync across devices.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setLoading(false);
    if (error) {
      Alert.alert('Something went wrong', error.message);
      return;
    }
    setStage('otp');
  };

  const handleVerifyCode = async () => {
    if (!otp.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });
    setLoading(false);
    if (error) {
      Alert.alert('Invalid code', error.message);
      return;
    }
    dispatch(setUser(data.user));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md, justifyContent: 'center' }}>
      <Text style={[theme.typography.h1, { color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }]}>
        Sync your subscriptions
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
        {stage === 'email' ? "We'll email you a one-time code, no password needed." : `Enter the code sent to ${email}`}
      </Text>

      <TextInput
        value={stage === 'email' ? email : otp}
        onChangeText={stage === 'email' ? setEmail : setOtp}
        placeholder={stage === 'email' ? 'you@example.com' : '123456'}
        placeholderTextColor={theme.colors.mist}
        autoCapitalize="none"
        keyboardType={stage === 'email' ? 'email-address' : 'number-pad'}
        style={[theme.typography.body, { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.sm, marginBottom: theme.spacing.md }]}
      />

      <TouchableOpacity
        onPress={stage === 'email' ? handleSendCode : handleVerifyCode}
        disabled={loading}
        style={{ backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' }}
      >
        {loading ? <ActivityIndicator color={theme.colors.textPrimary} /> : (
          <Text style={[theme.typography.bodyBold, { color: theme.colors.textPrimary }]}>
            {stage === 'email' ? 'Send code' : 'Verify & sync'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}