import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import Anim from '../../assets/animations/confirm.json';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import CustomButton from '../../components/global/CustomButton';
import { resetAndNavigate } from '../../utils/NavigationUtil';

interface ParamsType {
  msg?: string;
}

const TransactionSuccess = () => {
  const route = useRoute<RouteProp<ParamListBase>>();
  const msg = (route.params as ParamsType)?.msg || null;
  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Lottie
            source={Anim}
            speed={0.9}
            loop={false}
            style={styles.animation}
            autoPlay
          />
          <CustomText variant="h4" fontFamily={FONTS.Bold}>
            Order Successfull
          </CustomText>
          <CustomText
            variant="h8"
            fontFamily={FONTS.Regular}
            style={{ marginTop: 24, textAlign: 'center' }}
          >
            {msg}
          </CustomText>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <CustomButton
          text="Done"
          onPress={() => resetAndNavigate('Stock')}
          loading={false}
          disabled={false}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animationContainer: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: 130,
  },
  btnContainer: {
    justifyContent: 'flex-end',
    flex: 0.2,
    padding: 12,
  },
});

export default TransactionSuccess;
