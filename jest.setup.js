/* eslint-env jest */
/* Mocks for native modules so components render under Jest. */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
}));

jest.mock('@dr.pogodin/react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  CachesDirectoryPath: '/mock/caches',
  exists: jest.fn().mockResolvedValue(false),
  mkdir: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  copyFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@wokcito/ffmpeg-kit-react-native', () => ({
  FFmpegKit: {
    executeWithArguments: jest.fn(),
    executeWithArgumentsAsync: jest.fn(),
  },
  FFprobeKit: { getMediaInformation: jest.fn() },
  ReturnCode: { isSuccess: jest.fn().mockReturnValue(true) },
}));

jest.mock('react-native-video', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({ seek: () => {} }));
      return null;
    }),
  };
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn().mockResolvedValue({ didCancel: true }),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  keepLocalCopy: jest.fn(),
  types: { audio: 'audio/*' },
  isErrorWithCode: () => false,
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
}));

jest.mock('@react-native-camera-roll/camera-roll', () => ({
  CameraRoll: { save: jest.fn() },
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: { open: jest.fn() },
}));
