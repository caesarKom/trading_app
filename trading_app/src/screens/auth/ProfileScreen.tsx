import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { useAppDispatch } from '../../redux/reduxHook';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { useTheme } from '@react-navigation/native';
import { Logout, refetchUser } from '../../redux/actions/userAction';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import ProfileHeader from '../../components/auth/ProfileHeader';
import UserAvatar from '../../components/dashboard/UserAvatar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
  danger?: boolean;
}

const ProfileScreenItem = ({
  icon,
  title,
  description,
  onPress,
  danger,
}: ProfileProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemCard}>
      <View style={styles.flexRow}>
        {icon}
        <View style={{ flex: 1 }}>
          <CustomText
            fontFamily={FONTS.Medium}
            variant="h7"
            style={danger ? { color: 'red' } : {}}
          >
            {title}
          </CustomText>
          <CustomText
            fontFamily={FONTS.Medium}
            variant="h9"
            style={{ opacity: 0.6, marginTop: 3 }}
          >
            {description}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const { colors } = useTheme();

  useEffect(() => {
    dispatch(refetchUser());
  }, []);
  return (
    <CustomSafeAreaView>
      <ProfileHeader />

      <ScrollView
        contentContainerStyle={{ paddingTop: 25 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <UserAvatar style={styles.avatarLarge} />

          <CustomText
            variant="h5"
            fontFamily={FONTS.Medium}
            style={{ marginTop: 10 }}
          >
            {user?.name}
          </CustomText>
          <CustomText variant="h9" style={{ opacity: 0.6, marginTop: 4 }}>
            Account Details
          </CustomText>
        </View>

        <CustomText variant="h8" style={styles.sectionLabel}>
          Quick Actions
        </CustomText>

        <ProfileScreenItem
          icon={
            <Icon2
              name="gift"
              size={RFValue(20)}
              style={styles.icon}
              color={colors.text}
            />
          }
          title="Refer"
          description="Invite friends to the app"
        />

        <ProfileScreenItem
          icon={
            <Icon
              name="account-balance-wallet"
              size={RFValue(20)}
              style={styles.icon}
              color={colors.text}
            />
          }
          title={`$${user?.balance}`}
          description="Stocks, F&0 Balance"
        />

        <CustomText variant="h8" style={styles.sectionLabel}>
          Account
        </CustomText>

        <ProfileScreenItem
          icon={
            <Icon
              name="receipt"
              size={RFValue(20)}
              style={styles.icon}
              color={colors.text}
            />
          }
          title="All Orders"
          description="Track orders, order details"
        />
        <ProfileScreenItem
          icon={
            <Icon2
              name="bank"
              size={RFValue(20)}
              style={styles.icon}
              color={colors.text}
            />
          }
          title="Bank detail"
          description="Banks & AutoPay mandates"
        />

        <CustomText variant="h8" style={styles.sectionLabel}>
          Danger Zone
        </CustomText>
        <ProfileScreenItem
          icon={
            <Icon
              name="exit-to-app"
              size={RFValue(20)}
              style={styles.icon}
              color={'red'}
            />
          }
          title="Log Out"
          description="Logout from the app"
          danger
          onPress={async () => {
            await dispatch(Logout());
          }}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarLarge: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    opacity: 0.7,
  },
  itemCard: {
    backgroundColor: Colors.background_light,
    padding: 16,
    borderRadius: 10,
    marginBottom: 13,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    opacity: 0.6,
    marginRight: 12,
  },
});

export default ProfileScreen;
