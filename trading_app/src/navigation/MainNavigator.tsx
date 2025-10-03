import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mergedStacks } from './ScreenCollections';
import { WSProvider } from '../utils/WSProvider';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <WSProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SplashScreen"
      >
        {mergedStacks.map((screen, index) => {
          return (
            <Stack.Screen
              key={index}
              name={screen.name}
              component={screen.component}
            />
          );
        })}
      </Stack.Navigator>
    </WSProvider>
  );
};

export default MainNavigator;
