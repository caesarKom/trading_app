import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/reduxHook';
import { UpdateProfile } from '../../redux/actions/userAction';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import BackButton from '../../components/global/BackButton';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import CustomButton from '../../components/global/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import CustomDateInput from '../../components/inputs/CustomDateInput';
import CustomRadioInput from '../../components/inputs/CustomRadioInput';

interface InputProps {
  name: string;
  date_of_birth: string;
  gender: string;
}

const PersonalDetailScreen = () => {
  const [inputs, setInputs] = useState<InputProps>({
    name: '',
    date_of_birth: '',
    gender: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [loading, setloading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useAppDispatch();

  const handleOnChange = (text: string, fieldName: string) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [fieldName]: text,
    }));
    // Clear the error when the user starts typing again
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    if (!inputs.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!inputs.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    if (!inputs.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setloading(true);
      await dispatch(UpdateProfile(inputs));
      setloading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <BackButton />
      <CustomText variant="h4" fontFamily={FONTS.Bold} style={styles.headText}>
        Personal Details
      </CustomText>

      <ScrollView style={styles.content}>
        <CustomInput
          label="NAME (AS PER YOUR PAN CARD)"
          returnKeyType="done"
          value={inputs.name}
          error={errors?.name}
          onChangeText={text => handleOnChange(text, 'name')}
        />

        <CustomDateInput
          label="DATE OF BIRTH"
          error={errors?.date_of_birth}
          onDateChange={text => {
            handleOnChange(text, 'date_of_birth');
          }}
        />

        <CustomRadioInput
          label="GENDER"
          error={errors?.gender}
          options={['male', 'female', 'other']}
          onSelect={(text: string) => {
            return handleOnChange(text, 'gender');
          }}
          selected={inputs?.gender}
        />
      </ScrollView>

      <View style={GlobalStyles.bottomBtn}>
        <CustomButton
          text="NEXT"
          loading={loading}
          disabled={false}
          onPress={handleSubmit}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    gap: 20,
  },
  headText: { marginVertical: 10 },
});

export default PersonalDetailScreen;
