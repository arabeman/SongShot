import HapticFeedback from 'react-native-haptic-feedback';

const opts = { enableVibrateFallback: false, ignoreAndroidSystemSettings: false };

export const hapticLight = () => HapticFeedback.trigger('impactMedium', opts);
export const hapticHeavy = () => HapticFeedback.trigger('impactHeavy', opts);
export const hapticSelection = () => HapticFeedback.trigger('selection', opts);
