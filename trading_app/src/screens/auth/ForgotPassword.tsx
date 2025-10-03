import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/reduxHook';
import { SendOtp, VerifyOtp } from '../../redux/actions/userAction';
import { validatePasswordEntry } from '../../utils/ValidationUtils';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import BackButton from '../../components/global/BackButton';
import CustomInput from '../../components/inputs/CustomInput';
import OtpTimer from '../../components/auth/OtpTimer';
import { RFValue } from 'react-native-responsive-fontsize';
import GuidelineText from '../../components/global/GuidelineText';
import CustomButton from '../../components/global/CustomButton';
import { GlobalStyles } from '../../styles/GlobalStyles';
import CustomText from '../../components/global/CustomText';

interface PasswordProps {
  password: string;
  confirmPassword: string;
  otp: string;
}

const ForgotPassword = ({ route }: any) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [otpSend, setOtpSend] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<PasswordProps>({
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const handleOnChange = (text: string, fieldName: string) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [fieldName]: text,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const verifyOtp = async () => {
    setLoading(true);
    await dispatch(
      VerifyOtp({
        email: route.params.email || '',
        otp_type: 'reset_password',
        data: inputs.confirmPassword,
        otp: inputs.otp,
      }),
    );
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    if (!inputs.password.trim()) {
      newErrors.password = 'Enter new password';
    }
    if (!inputs.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Enter confirm password';
    }
    if (
      !validatePasswordEntry(inputs.password, 'test', route?.params?.email)
        .result
    ) {
      newErrors.password =
        'Set a stronger password, kindly refer to guidelines below.';
    }
    if (inputs?.confirmPassword !== inputs?.password) {
      newErrors.confirmPassword = 'Confirm Password not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (validateForm()) {
      setLoading(true);
      await dispatch(
        SendOtp({
          email: route.params.email || '',
          otp_type: 'reset_password',
        }),
      );
      setOtpSend(true);
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <BackButton />

      <CustomInput
        label="NEW PASSWORD"
        placeholder="8-20 Characters"
        value={inputs?.password}
        error={errors?.password}
        onChangeText={text => handleOnChange(text, 'password')}
        password
      />

      <CustomInput
        label="CONFIRM NEW PASSWORD"
        placeholder="8-20 Characters"
        value={inputs?.confirmPassword}
        error={errors?.confirmPassword}
        onChangeText={text => handleOnChange(text, 'confirmPassword')}
        password
      />

      {otpSend && (
        <CustomInput
          error={errors?.otp}
          value={inputs.otp}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={verifyOtp}
          rightIcon={
            <OtpTimer
              style={{
                color: colors.text,
                opacity: 0.8,
                fontSize: RFValue(10),
                right: 20,
              }}
              type="email"
              onPress={() => handleUpdatePassword()}
            />
          }
          maxLength={6}
          onChangeText={text => handleOnChange(text, 'otp')}
        />
      )}

      <View style={GlobalStyles.bottomBtn}>
        {errors?.otp && (
          <View style={styles.errorContainer}>
            <CustomText variant='h7'>
              Wrong OTP, 2 attempts remaining
            </CustomText>
            </View>
        )}
      

      <GuidelineText
        text={[
          "Password must have at least one uppercase and lowercase letter.",
          "Must contain at least one number and one special character.",
          "Must not contain user's first/last name and email id",
          "Must be different from previous password."
        ]}
      />

      <CustomButton
        disabled={loading}
        loading={loading}
        text={otpSend ? "UPDATE PASSWORD":"SEND OTP"}
        onPress={otpSend ? verifyOtp:handleUpdatePassword}
      />

      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default ForgotPassword;
