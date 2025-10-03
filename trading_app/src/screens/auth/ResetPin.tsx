import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import { Colors } from '../../constants/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import DotLoading from '../../components/global/DotLoading';
import OTPInputCentered from '../../components/inputs/OTPInputCentered';
import CustomNumberPad from '../../components/inputs/CustomNumberPad';
import ResetOTPVerification from './ResetOTPVerification';
import { SendOtp } from '../../redux/actions/userAction';
import { useAppDispatch, useAppSeletor } from '../../redux/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';

const initialState = ['', '', '', ''];

const ResetPin = () => {
  const dispatch = useAppDispatch();
  const user = useAppSeletor(selectUser);
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(initialState);
  const [otpVerification, setOtpVerification] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handlePressNumber = (number: number | string) => {
    if (focusedIndex < otpValues.length) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex] = number.toString();
      setOtpError(null);
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const handlePressBackspace = () => {
    if (focusedIndex > 0) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex - 1] = '';
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex - 1);
    }
  };

  const handlePressCheckMark = async () => {
    let valid = false;
    otpValues.forEach(i => {
      if (i === '') {
        valid = true;
        setOtpError('Enter 4 Digit PIN');
        // setOtpError('Wrong PIN Limit Reached. Try after 30 minutes.');
        setOtpValues(initialState);
        setFocusedIndex(0);
      }
    });
    if (!valid) {
      setLoading(true);
      await dispatch(
        SendOtp({ email: user.email || '', otp_type: 'reset_pin' }),
      );
      setLoading(false);
      // setOtpValues(initialState)
      setFocusedIndex(0);
      setOtpVerification(true);
    }
  };

  if (otpVerification) {
    return <ResetOTPVerification pin={otpValues.join('')} />;
  }

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Icon color={Colors.themeColor} name="lock" size={RFValue(24)} />
        <CustomText variant="h1" fontFamily={FONTS.Medium}>
          Reset App PIN
        </CustomText>

        <CustomText style={styles.subTex}>
          Set a new PIN to keep your investments safe & secure.
        </CustomText>

        {loading ? (
          <View style={styles.dotContainer}>
            <DotLoading />
          </View>
        ) : (
          <OTPInputCentered
            error={otpError}
            focusedIndex={focusedIndex}
            otpValues={otpValues}
          />
        )}
      </View>

      <CustomNumberPad
        customFont
        themeColor
        onPressNumber={handlePressNumber}
        onPressBackspace={handlePressBackspace}
        onPressCheckmark={handlePressCheckMark}
      />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RFValue(12),
  },
  logo: {
    height: RFValue(28),
    width: RFValue(28),
    alignSelf: 'center',
    marginBottom: 10,
  },
  subTex: {
    fontSize: RFValue(11),
    marginTop: 18,
    opacity: 0.7,
  },
  dotContainer: { marginTop: 60 },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 15,
  },
  logoutText: {
    fontFamily: FONTS.Regular,
    fontSize: RFValue(11),
  },
});

export default ResetPin;
