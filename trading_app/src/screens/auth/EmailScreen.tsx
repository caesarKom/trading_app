import { ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import BackButton from '../../components/global/BackButton';
import CenteredLogo from '../../components/global/CenteredLogo';
import { useAppDispatch } from '../../redux/reduxHook';
import CustomInput from '../../components/inputs/CustomInput';
import { validateEmail } from '../../utils/ValidationUtils';
import { CheckEmail } from '../../redux/actions/userAction';
import CustomButton from '../../components/global/CustomButton';
import { GlobalStyles } from '../../styles/GlobalStyles';

const EmailScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const dispatch = useAppDispatch();

  const validate = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validate()) {
      await dispatch(CheckEmail({ email: email.toLowerCase() }));
    }
    setLoading(false);
  };

  return (
    <CustomSafeAreaView>
      <BackButton path="LoginScreen" />
      <ScrollView>
        <CenteredLogo />

        <CustomInput
          label="EMAIL ADDRESS"
          returnKeyType="done"
          value={email}
          inputMode="email"
          focusable={true}
          autoFocus={true}
          error={emailError}
          onEndEditing={() => validate()}
          onChangeText={text => {
            setEmail(text);
            setEmailError('');
          }}
          placeholder="Eg: me@mail.com"
          onSubmitEditing={handleSubmit}
        />
      </ScrollView>

      <View style={GlobalStyles.bottomBtn}>
        <CustomButton
          text="NEXT"
          loading={loading}
          disabled={!validateEmail(email) || loading}
          onPress={handleSubmit}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default EmailScreen;
