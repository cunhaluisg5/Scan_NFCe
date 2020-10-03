import { AsyncStorage } from 'react-native';
import { create } from 'apisauce';

const api = create({
  baseURL: 'https://scannfceserver.herokuapp.com'
});

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem('@APP:token');

  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
});

api.addResponseTransform(response => {
  if (!response.ok) throw response;
})

export default api;