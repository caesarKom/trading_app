import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSeletor } from '../../redux/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { SendOtp, VerifyOtp } from '../../redux/actions/userAction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import OtpTimer from '../../components/auth/OtpTimer';
import CustomButton from '../../components/global/CustomButton';
import BackButton from '../../components/global/BackButton';

const PhoneScreen = () => {
  const { colors } = useTheme();
  const user = useAppSeletor(selectUser);
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    await dispatch(SendOtp({ email: user.email || '', otp_type: 'phone' }));
    setOtpSend(true);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError('Enter OTP');
      return;
    }
    setLoading(true);
    await dispatch(
      VerifyOtp({
        email: user.email || '',
        otp_type: 'phone',
        data: phoneNumber,
        otp: otp,
      }),
    );
    setLoading(false);
  };

  const handlePress = async () => {
    if (otpSend) {
      handleVerifyOtp();
      return;
    }
    handleSendOTP();
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={10}
      behavior="padding"
      style={styles.keyboardContainer}
    >
      <CustomSafeAreaView>
        <BackButton path="LoginScreen" />
        <CustomText
          variant="h4"
          fontFamily={FONTS.Medium}
          style={styles.mainContainer}
        >
          {otpSend ? 'Verify your mobile number' : 'Enter mobile number'}
        </CustomText>

        {otpSend ? (
          <View style={styles.numberContainer}>
            <CustomText variant="h8" style={{ color: '#fff' }}>
              Enter the OTP sent to +32 {phoneNumber}
            </CustomText>
            <Icon
              color={Colors.profit}
              name="pencil"
              size={RFValue(12)}
              onPress={() => setOtpSend(false)}
            />
          </View>
        ) : (
          <CustomText variant="h8">
            Mobile number is required to invest in Belgium.
          </CustomText>
        )}

        {otpSend ? (
          <View style={styles.phoneContainer}>

            <TextInput
              focusable={true}
              autoFocus={true}
              keyboardType="phone-pad"
              placeholder="OTP Code"
              maxLength={6}
              style={[
                { backgroundColor: colors.card, color: '#fff', padding: 10 },
                styles.otpInput,
              ]}
              value={otp}
              onChangeText={text => setOtp(text)}
            />
          </View>
        ) : (
          <>
            <View style={styles.phoneContainer}>
              <CustomText
              variant="h5"
              fontFamily={FONTS.NumberSemiBold}
              style={{ fontWeight: 'bold' }}
            >
              +32
            </CustomText>
              <TextInput
                focusable={true}
                autoFocus={true}
                keyboardType="phone-pad"
                placeholder="458887133"
                maxLength={9}
                style={[{ color: colors.text }, styles.textInput]}
                value={phoneNumber}
                onChangeText={text => {
                  setPhoneNumber(text);
                  setOtpError('');
                }}
              />
            </View>

            <View style={styles.otpTimerContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.card,
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                <OtpTimer
                  style={{
                    fontSize: RFValue(10),
                    color: colors.text,
                    opacity: 0.8,
                    fontFamily: FONTS.Regular,
                  }}
                  type="OTP"
                  onPress={() => handleSendOTP()}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.card,
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                <CustomText
                  style={{
                    color: colors.text,
                    fontSize: RFValue(10),
                    opacity: 0.8,
                    fontFamily: FONTS.Regular,
                  }}
                >
                  Get OTP via call
                </CustomText>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.btnContainer}>
          {otpError && (
            <View style={styles.errorContainer}>
              <CustomText variant="h7" fontFamily={FONTS.Medium}>
                Wrong OTP, 2 attempts remaining.
              </CustomText>
            </View>
          )}
          <CustomButton
            text={otpSend ? 'VERIFY' : 'SEND OTP'}
            onPress={handlePress}
            loading={loading}
            disabled={loading}
          />
        </View>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 20,
  },
  mainContainer: { marginVertical: 10 },
  keyboardContainer: { flex: 1 },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
    paddingLeft: 3,
  },
  textInput: {
    width: '90%',
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  otpInput: {
    width: '90%',
    fontWeight: 'bold',
    fontSize: RFValue(15),
    borderRadius: 5,
  },
  otpTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginTop: 50,
  },
});
export default PhoneScreen;
