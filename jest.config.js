module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*|@react-native-documents/.*|@react-native-async-storage/.*|@react-native-camera-roll/.*|@dr\.pogodin/.*|nativewind|react-native-css-interop|uuid)/)',
  ],
};
