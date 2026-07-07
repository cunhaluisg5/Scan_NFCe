import React from 'react';
import '@testing-library/jest-native/extend-expect';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  function MockLinearGradient({ children, ...props }) {
    return <View {...props}>{children}</View>;
  }

  return {
    LinearGradient: MockLinearGradient,
  };
});

jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  function MockCameraView({ children, ...props }) {
    return <View testID="camera-view" {...props}>{children}</View>;
  }

  return {
    CameraView: MockCameraView,
    useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
  };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  function MockModal({ children, visible }) {
    return visible ? <View>{children}</View> : null;
  }

  return MockModal;
});
