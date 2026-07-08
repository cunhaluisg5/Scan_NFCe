let AsyncStorage;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  AsyncStorage = require('react-native').AsyncStorage;
}

export default AsyncStorage;
