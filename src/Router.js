import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import DrawerContainer from './screens/DrawerContainer/DrawerContainer';
import Login from './screens/Authentication/Login';
import HomeStack from './routes/HomeStack';
import ScanStack from './routes/ScanStack';
import ChartStack from './routes/ChartStack';
import SettingsStack from './routes/SettingsStack'

const MenuRoutes = {
  Home: {
    screen: HomeStack,
  },
  Scan: {
    screen: ScanStack,
  },
  Chart: {
    screen: ChartStack,
  },
  Settings: {
    screen: SettingsStack,
  },
}

const MenuConfig = {
  initialRouteName: 'Home',
  contentComponent: DrawerContainer
}

const RootDrawerNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const MainRoutes = {
  Auth: {
    screen: Login
  },
  Main: {
    screen: RootDrawerNavigator
  }
}

const MainNavigator = createSwitchNavigator(MainRoutes, {
  initialRouteName: 'Auth'
})

console.disableYellowBox = true;

export default createAppContainer(MainNavigator);