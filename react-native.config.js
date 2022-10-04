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
      sourceDir: './example/ios',
    },
  },
};
