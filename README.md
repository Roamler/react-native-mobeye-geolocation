# React Native Mobeye Geolocation

## Table of Contents

- [React Native Mobeye Geolocation](#react-native-mobeye-geolocation)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [General Usage](#general-usage)
## Getting started

```bash
yarn add react-native-mobeye-geolocation
```

## General Usage
```javascript
import {
    useLocation,
    initiateLocation,
    requestIOSLocationAuthorization,
} from 'react-native-mobeye-geolocation';

export const App = () => {
  const location = useLocation();
};
```
