import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useAppDispatch, useAppSeletor } from '../../redux/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { useTheme } from '@react-navigation/native';
import { SendOtp, VerifyOtp } from '../../redux/actions/userAction';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import OtpTimer from '../../components/auth/OtpTimer';
import CustomButton from '../../components/global/CustomButton';
import CustomText from '../../components/global/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetOTPVerification = ({ pin }: { pin: string }) => {
  const dispatch = useAppDispatch();
  const user = useAppSeletor(selectUser);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const { colors } = useTheme();

  async function handleVerification() {
    setLoading(true);
    if (!otp) {
      setLoading(false);
      setOtpError('Enter OTP');
      return;
    }
    await dispatch(
      VerifyOtp({
        email: user.email || '',
        data: pin,
        otp: otp,
        otp_type: 'reset_pin',
      }),
    );

    setLoading(false);
  }

  function handleChange(text: string) {
    setOtp(text);
    setOtpError(null);
  }

  async function resendOtp() {
    await dispatch(SendOtp({ email: user.email || '', otp_type: 'reset_pin' }));
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={10}
      behavior="padding"
      style={styles.keyboardContainer}
    >
      <CustomSafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
          <Icon color={Colors.profit} name="lock" size={RFValue(22)} />

          <CustomText variant="h6" fontFamily={FONTS.Bold} style={styles.title}>
            Verify Identity
          </CustomText>

          <CustomText style={styles.subText}>
            Enter OTP sent to registered mail.
          </CustomText>

          <TextInput
            value={otp}
            maxLength={6}
            onChangeText={handleChange}
            autoFocus
            keyboardType="number-pad"
            style={[styles.input, { color: colors.text }]}
            caretHidden
          />

          {otpError && <Text style={styles.errorText}>{otpError}</Text>}

          <OtpTimer
            onPress={() => resendOtp()}
            type="otp"
            style={styles.timer}
          />
        </ScrollView>

        <View style={styles.btnContainer}>
          <CustomButton
            text="VERIFY"
            onPress={handleVerification}
            loading={loading}
            disabled={false}
          />
        </View>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: RFValue(10),
  },
  errorText: {
    color: Colors.errorColor,
    fontSize: RFValue(11),
    fontFamily: FONTS.Regular,
    marginTop: 20,
  },
  btnContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 15,
  },
  subText: {
    fontSize: RFValue(10),
    marginTop: 15,
  },
  keyboardContainer: { flex: 1 },
  title: { marginTop: 20 },
  input: {
    marginTop: 80,
    fontSize: RFValue(18),
    borderBottomColor: Colors.border,
    width: '30%',
    textAlign: 'center',
  },
  timer: {
    fontSize: RFValue(10),
    marginTop: 60,
  },
  logoutText: {
    fontSize: RFValue(10),
  },
});

export default ResetOTPVerification;
