import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import DrawerContainer from './screens/DrawerContainer/DrawerContainer';
import Login from './screens/Authentication/Login';
import HomeScreen from './screens/Home/HomeScreen';

const MainNavigator = createStackNavigator(
    {
      Home: HomeScreen
    },
    {
      initialRouteName: 'Home',
      defaulfNavigationOptions: ({ navigation }) => ({
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        }
      })
    }
  ); 
  
  const DrawerStack = createDrawerNavigator(
    {
      Main: MainNavigator
    },
    {
      drawerPosition: 'left',
      initialRouteName: 'Main',
      drawerWidth: 250,
      contentComponent: DrawerContainer
    }
  );
  
  const AuthNavigation = createSwitchNavigator({
    Auth: Login,
    Main: DrawerStack
  });
   
  const AppContainer = createAppContainer(AuthNavigation);
  
  export default AppContainer;
  
  console.disableYellowBox = true;