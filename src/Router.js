import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Login from './screens/Authentication/Login';

const AuthNavigation = createSwitchNavigator({
  Auth: Login
});
 
const AppContainer = createAppContainer(AuthNavigation);

export default AppContainer;

console.disableYellowBox = true;