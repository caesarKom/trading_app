import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CenteredLogo from '../../components/global/CenteredLogo';
import { goBack, navigate } from '../../utils/NavigationUtil';
import CustomInput from '../../components/inputs/CustomInput';
import { useAppDispatch } from '../../redux/reduxHook';
import { validatePasswordLength } from '../../utils/ValidationUtils';
import TouchableText from '../../components/auth/TouchableText';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '../../components/global/CustomButton';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { EmailLogin } from '../../redux/actions/userAction';

const EmailPasswordScreen = ({ route }: any) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useAppDispatch();

  const validate = () => {
    if (!password) {
      setPasswordError('Please enter a valid password');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validate()) {
      await dispatch(
        EmailLogin({ email: route.params.email, password: password }),
      );
    }
    setLoading(false);
  };

  return (
    <CustomSafeAreaView>
      <ScrollView>
        <CenteredLogo />

        <TouchableOpacity onPress={() => goBack()}>
          <View pointerEvents="none">
            <CustomInput label="EMAIL ADDRESS" value={route.params.email} />
          </View>
        </TouchableOpacity>

        <CustomInput
          label="ENTER PASSWORD"
          returnKeyType="done"
          placeholder="6-20 Characters"
          value={password}
          error={passwordError}
          onChangeText={text => {
            setPassword(text);
            setPasswordError('');
          }}
          onSubmitEditing={handleSubmit}
          password
        />

        <TouchableText
          onPress={() =>
            navigate('ForgotPassword', { email: route.params.email })
          }
          firstText="Forgot Password?"
          style={styles.forgotText}
        />
      </ScrollView>

      <View style={GlobalStyles.bottomBtn}>
        <CustomButton
          text="ENTER"
          loading={loading}
          disabled={loading}
          onPress={() => handleSubmit()}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotText: {
    fontSize: RFValue(10),
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default EmailPasswordScreen;
