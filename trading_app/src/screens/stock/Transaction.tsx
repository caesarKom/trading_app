import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/reduxHook';
import {
  ParamListBase,
  RouteProp,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { selectHoldings } from '../../redux/reducers/stockSlice';
import { useWS } from '../../utils/WSProvider';
import { refetchUser } from '../../redux/actions/userAction';
import {
  buyStock,
  getAllHoldings,
  sellStock,
} from '../../redux/actions/stockAction';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import TransactionHeader from '../../components/stocks/TransactionHeader';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { formatPaisaWithCommas, hexToRGBA } from '../../utils/NumberUtils';
import CustomButton from '../../components/global/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import { Colors } from '../../constants/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

type Stock = {
  __v: number;
  _id: string;
  companyName: string;
  currentPrice: number;
  iconUrl: string;
  lastDayTradedPrice: number;
  symbol: string;
  dayTimeSeries: Array<TimeSeries>;
  tenMinTimeSeries: Array<TimeSeries>;
};

type TimeSeries = {
  _internal_originalTime: number;
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  timestamp: string;
};

interface ParamsType {
  stock?: any;
  type?: string;
}

const Transaction = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<ParamListBase>>();
  const stockData = (route.params as ParamsType)?.stock || null;
  const transaction_type = (route.params as ParamsType)?.type || null;
  const user = useSelector(selectUser);
  const holdings = useSelector(selectHoldings);
  const socketService = useWS();
  const { colors } = useTheme();

  const [stockSocketData, setStockSocketData] = useState<Stock | any>(null);

  useEffect(() => {
    if (socketService && stockData.symbol) {
      socketService.emit('subscribeToStocks', stockData.symbol);

      socketService.on(stockData.symbol, data => {
        setStockSocketData(data);
      });
      return () => {};
    }
  }, [socketService]);

  const [formState, setFormState] = useState({
    quantity: 0,
    loading: false,
    disabled: true,
    error: false,
  });

  useEffect(() => {
    dispatch(refetchUser());
    dispatch(getAllHoldings());
  }, []);

  const handleQuantityChange = (text: string) => {
    const parsedQuantity = parseInt(text, 10);
    if (!isNaN(parsedQuantity)) {
      setFormState({
        ...formState,
        quantity: parsedQuantity,
        disabled: parsedQuantity < 0 || parsedQuantity > 1000,
      });
    } else {
      setFormState({
        ...formState,
        quantity: 0,
        disabled: true,
      });
    }
  };

  const buyTransaction = async () => {
    if (formState.quantity !== 0) {
      await dispatch(
        buyStock({
          stock_id: stockData?._id,
          quantity: formState.quantity,
          amount: formState?.quantity * stockSocketData?.currentPrice,
          companyName: stockData?.companyName,
        }),
      );
    } else {
      Alert.alert('Quantity should be more than 0');
    }
  };

  const sellTransaction = async () => {
    // if you have multiple holdings of same stock then first found one will be executed.
    const holding = holdings.find(
      (h: any) => h.stock.symbol === stockData?.symbol,
    ) as any;
    if (
      holding &&
      formState.quantity !== 0 &&
      formState?.quantity <= holding?.quantity
    ) {
      await dispatch(
        sellStock({
          holdingId: holding._id,
          quantity: formState.quantity,
          amount: formState?.quantity * stockSocketData?.currentPrice,
          companyName: stockData?.companyName,
        }),
      );
    } else {
      Alert.alert('Enter limited holding quantity');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={10}
      behavior="padding"
    >
      <CustomSafeAreaView style={{ paddingHorizontal: 0 }}>
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <TransactionHeader stock={stockSocketData} />

          <ScrollView>
            <View style={styles.flexRowBetween}>
                <View style={styles.flexRow}>
                    <CustomText fontFamily={FONTS.Regular}>Qty </CustomText>
                    <CustomText fontFamily={FONTS.Medium}>RSE </CustomText>
                </View>

                <CustomInput
                    containerStyle={{
                        width: "60%",
                        alignSelf: "flex-end",
                        backgroundColor: hexToRGBA(colors.primary, 0.3),
                        borderRadius: 8,
                        borderBottomWidth: 0,
                        height:36,
                        paddingEnd:0
                    }}
                    keyboardType='numeric'
                    value={formState?.quantity?.toString()}
                    onChangeText={(text) => {
                        const parsedQuantity = parseInt(text, 10)
                        if (!isNaN(parsedQuantity)) {
                            handleQuantityChange(parsedQuantity.toString())
                        } else {
                            handleQuantityChange("")
                        }
                    }}
                    textInputStyle={{
                        color: Colors.profit,
                        fontFamily: FONTS.Bold,
                        textAlign:"right",
                        width: "90%",
                        fontSize:RFValue(14)
                    }}
                    cursorColor={colors.primary}
                />
            </View>

            <View style={styles.flexRowBetween}>
                <View style={styles.flexRow}>
                    <CustomText fontFamily={FONTS.Regular}>Price </CustomText>
                    <CustomText fontFamily={FONTS.Medium}>Limit </CustomText>
                </View>

                <CustomInput
                    containerStyle={{
                        width: "60%",
                        alignSelf: "flex-end",
                        backgroundColor: hexToRGBA(colors.primary, 0.3),
                        borderRadius: 5,
                        borderBottomWidth: 0,
                        height:32,
                        paddingEnd:0
                    }}
                    pointerEvents='none'
                    keyboardType='numeric'
                    value={stockSocketData?.currentPrice?.toString()}
                    textInputStyle={{
                        color: Colors.profit,
                        fontFamily: FONTS.Bold,
                        textAlign:"right",
                        width: "90%",
                        fontSize:RFValue(14)
                    }}
                    cursorColor={colors.primary}
                />
            </View>
          </ScrollView>
        </View>

        <View style={styles.btnContainer}>
          {formState.error && (
            <View style={styles.errorContainer}>
              <CustomText variant="h7" fontFamily={FONTS.Medium}>
                Enter Valid limit price
              </CustomText>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              opacity: 0.6,
            }}
          >
            <CustomText variant="h9">
              Balance: {`$${user?.balance}` || '------'}{' '}
            </CustomText>

            <CustomText variant="h9">
              {transaction_type === 'BUY' ? 'Required' : 'Sell Amount'}:{' '}
              {formatPaisaWithCommas(
                (formState?.quantity || 0) * stockSocketData?.currentPrice,
              )}
            </CustomText>
          </View>

          <CustomButton
            text={transaction_type || ''}
            onPress={async () => {
              if (transaction_type === 'SELL') {
                await sellTransaction();
              } else {
                await buyTransaction();
              }
            }}
            loading={formState.loading}
            disabled={formState.disabled}
          />
        </View>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    justifyContent: 'flex-end',
    flex: 0.2,
    padding: 12,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.2)',
    padding: 12,
    justifyContent: 'center',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
});

export default Transaction;
