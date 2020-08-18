module.exports = {
  dependencies: {
    'react-native-mobeye-geolocation': {
      root: __dirname,
    },
  },
  project: {
    android: {
      sourceDir: './example/android',
    },
    ios: {
      project: './example/ios/example.xcodeproj',
    },
  },
};
