import { View, StyleSheet, Image } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSeletor } from '../../redux/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { useWS } from '../../utils/WSProvider';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import Logo from '../../assets/images/logo.png';
import TouchableText from '../../components/auth/TouchableText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Logout, VerifyPin } from '../../redux/actions/userAction';
import { resetAndNavigate } from '../../utils/NavigationUtil';
import { loginWithBiometrics } from '../../utils/BiometricUtils';
import CustomNumberPad from '../../components/inputs/CustomNumberPad';
import DiamondOTPInput from '../../components/inputs/DiamondOTPInput';

interface BiometricProps {
  onForgotPin: () => void;
}

const initialState = ['', '', '', ''];

const BiometricVerification = ({ onForgotPin }:BiometricProps) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setloading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const user = useAppSeletor(selectUser);
  const dispatch = useAppDispatch();
  const { updateAccessToken } = useWS();

  function handlePressNumber(number: number | string) {
    if (focusedIndex < otpValues.length) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex] = number.toString();
      setOtpError(null);
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex + 1);
    }
  }

  function handlePressBackspace() {
    if (focusedIndex > 0) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex - 1] = '';
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex - 1);
    }
  }

  async function handleBiometricVerification() {
    const { msg, result } = await dispatch(
      loginWithBiometrics(user.userId || ''),
    );
    if (!result) {
      setOtpError(msg);
      return;
    }
    if (result) {
      setOtpValues(['B', 'I', 'O', 'P']);
      resetAndNavigate('Stock');
    }
  }

  async function handlePressCheckMark() {
    let valid = false;
    if (otpValues.join('') === 'BIOP') {
      return;
    }

    otpValues.forEach(i => {
      if (i === '') {
        valid = true;
        setOtpError('Enter PIN');
        setOtpValues(initialState);
        setFocusedIndex(0);
      }
    });

    if (!valid) {
      setloading(true);
      const { result, msg } = await dispatch(
        VerifyPin({ login_pin: otpValues.join('') }, updateAccessToken),
      );
      if (!result) {
        setOtpError(msg);
      } else {
        resetAndNavigate('Stock');
      }

      setOtpValues(initialState);
      setFocusedIndex(0);
      setloading(false);
    }
  }

  useEffect(() => {
    const allFilled = otpValues.every(value => value !== '');
    if (allFilled) {
      handlePressCheckMark();
    }
  }, [otpValues]);

  useEffect(() => {
    handleBiometricVerification();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />
        <CustomText variant="h1" fontFamily={FONTS.Medium}>
          Enter App PIN
        </CustomText>

        <View style={styles.emailContainer}>
          <CustomText style={styles.subText}>{user?.email}</CustomText>
          <TouchableText
            firstText="Logout"
            style={styles.logoutText}
            onPress={() => dispatch(Logout())}
          />
        </View>
      </View>

      <DiamondOTPInput
        onForgotPin={onForgotPin}
        loading={loading}
        otpValues={otpValues}
        error={otpError}
      />

      <CustomNumberPad
        customFont
        onPressBiometric={handleBiometricVerification}
        isBiometric={true}
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
    marginTop: RFValue(30),
    marginBottom: RFValue(12),
  },
  logo: {
    height: RFValue(28),
    width: RFValue(28),
    alignSelf: 'center',
    marginBottom: 10,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  subText: {
    fontSize: RFValue(11),
  },
  logoutText: {
    fontFamily: FONTS.Regular,
    fontSize: RFValue(11),
  },
});

export default BiometricVerification;
