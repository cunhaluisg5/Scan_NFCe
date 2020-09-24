import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import DrawerContainer from './screens/DrawerContainer/DrawerContainer';
import Login from './screens/Authentication/Login';
import HomeScreen from './screens/Home/HomeScreen';
import ScanScreen from './screens/Scan/ScanScreen';
import Settings from './screens/Settings/Settings'
import DetailsNfceScreen from './screens/DetailsNfce/DetailsNfceScreen';

const MainNavigator = createStackNavigator(
    {
      Home: HomeScreen,
      Scan: ScanScreen,
      Settings: Settings,
      "Detalhes da NFCe": DetailsNfceScreen
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
      Auth: Login,
      Main: MainNavigator
    },
    {
      drawerPosition: 'left',
      initialRouteName: 'Auth',
      drawerWidth: 250,
      contentComponent: DrawerContainer
    }
  );
   
  const AppContainer = createAppContainer(DrawerStack);
  
  export default AppContainer;
  
  console.disableYellowBox = true;