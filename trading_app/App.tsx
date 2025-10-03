import { Provider } from 'react-redux';
import Navigation from './src/navigation/Navigation';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/ToastConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from './src/config/env';
import { StatusBar } from 'react-native';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId: WEB_CLIENT_ID,
});

const App = () => {
  return (
   <>
   <StatusBar backgroundColor="#0F172A" barStyle="light-content"  />
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>

      <Toast
        visibilityTime={3000}
        config={toastConfig}
        bottomOffset={0}
        swipeable={false}
        position="bottom"
      />
    </GestureHandlerRootView>
   </>
  );
};

export default App;
