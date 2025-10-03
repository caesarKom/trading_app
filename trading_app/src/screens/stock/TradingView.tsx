import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { token_storage } from '../../redux/storage';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import { Colors } from '../../constants/Colors';
import CustomButton from '../../components/global/CustomButton';
import { navigate } from '../../utils/NavigationUtil';
import WebView from "react-native-webview";
import { TRADINGVIEW_WEB_URL } from '../../redux/API';
import TradingViewHeader from '../../components/stocks/TradingViewHeader';

interface ParamsType {
  stock?: any;
}

const TradingView = () => {
  const route = useRoute<RouteProp<ParamListBase>>();
  const stockData = (route.params as ParamsType)?.stock || null;
  const socketToken = token_storage.getString('socket_access_token');
  const [loading, setloading] = useState(true);

  return (
    <CustomSafeAreaView style={styles.container}>

        <TradingViewHeader />

    <WebView style={{flex:1,backgroundColor:Colors.background,right:-1}} 
    // For having demo of advenced trading view hart
    // source={{ uri: "https://charting-library.tradingview-widget.com " }}

     source={{
         uri: `${TRADINGVIEW_WEB_URL}?theme=dark&stock=${stockData?.symbol}&access_token=${socketToken}`
     }}
    allowFileAccessFromFileURLs={true}
    domStorageEnabled={true}
    onLoadEnd={() => {
        setTimeout(() => {
            setloading(false)
        }, 500)
    }}
    bounces={false}
    allowFileAccess={true}
    allowUniversalAccessFromFileURLs={true}
    originWhitelist={["*"]}
    onShouldStartLoadWithRequest={() => true}
    />

      <View style={styles.flexRow}>
        <CustomButton
          text="SELL"
          onPress={() =>
            navigate('Transaction', { type: 'SELL', stock: stockData })
          }
          loading={false}
          disabled={false}
          style={{
            backgroundColor: Colors.loss,
            width: '48%',
            borderRadius: 12,
          }}
        />
        <CustomButton
          text="BUY"
          onPress={() =>
            navigate('Transaction', { type: 'BUY', stock: stockData })
          }
          loading={false}
          disabled={false}
          style={{
            backgroundColor: Colors.profit,
            width: '48%',
            borderRadius: 12,
          }}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.active_tab} />
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingHorizontal: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: 10,
  },
  loadingContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    backgroundColor: Colors.background,
  },
});

export default TradingView;
