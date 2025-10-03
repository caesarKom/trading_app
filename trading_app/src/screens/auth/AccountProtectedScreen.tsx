import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { resetAndNavigate } from '../../utils/NavigationUtil';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CenteredLogo from '../../components/global/CenteredLogo';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import Anim from '../../assets/animations/confirm.json';
import Lottie from 'lottie-react-native';

const AccountProtectedScreen = () => {
    
  useEffect(() => {
    setTimeout(() => {
      resetAndNavigate('Stock');
    }, 3000);
  }, []);

  return (
    <CustomSafeAreaView>
      <CenteredLogo />
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Lottie
            source={Anim}
            speed={0.9}
            loop={false}
            style={styles.animation}
            autoPlay
          />
          <CustomText fontFamily={FONTS.Bold}>Account Protected</CustomText>
        </View>
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
    height: 280,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: 120,
  },
});

export default AccountProtectedScreen;
