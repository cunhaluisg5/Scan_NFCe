import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import DrawerContainer from './screens/DrawerContainer/DrawerContainer';
import Login from './screens/Authentication/Login';
import HomeScreen from './screens/Home/HomeScreen';
import ScanScreen from './screens/Scan/ScanScreen';
import Settings from './screens/Settings/Settings'
import DetailsNfceScreen from './screens/DetailsNfce/DetailsNfceScreen';

const MenuRoutes = {
  Home: HomeScreen,
  Scan: ScanScreen,
  Settings: Settings,
  "Detalhes da NFCe": DetailsNfceScreen
}

const MenuConfig = {
  initialRouteName: 'Home',
  contentComponent: DrawerContainer,
  defaulfNavigationOptions: ({ navigation }) => ({
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    }
  })
}

const MenuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const MainRoutes = {
  Auth: Login,
  Main: MenuNavigator
}

const MainNavigator = createSwitchNavigator(MainRoutes, {
  initialRouteName: 'Auth',
  drawerPosition: 'left',
  drawerWidth: 250,
})

console.disableYellowBox = true;

const App = createAppContainer(MainNavigator);
export default App;