import { Linking } from 'react-native';

// TODO: replace with your real Play Store applicationId once published.
export const PLAY_STORE_ID = 'com.rn';

// TODO: replace with your real Ko-fi page URL.
export const KOFI_URL = 'https://ko-fi.com/YOUR_PAGE_HERE';

// Uncomment if needed in the future
// export const PATREON_URL = 'https://www.patreon.com/YOUR_PAGE_HERE';

export async function openPlayStoreRating() {
  const market = `market://details?id=${PLAY_STORE_ID}`;
  const web = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;
  try {
    await Linking.openURL(market);
  } catch {
    await Linking.openURL(web);
  }
}

export async function openKofi() {
  await Linking.openURL(KOFI_URL);
}

// Uncomment if needed in the future
// export async function openPatreon() {
//   await Linking.openURL(PATREON_URL);
// }
