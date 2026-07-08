import { Linking } from 'react-native';

// TODO: replace with your real Play Store applicationId once published.
export const PLAY_STORE_ID = 'com.rn';

// TODO: point this at the hosted Papi.mg donation page (my-papi-donate) once deployed.
// export const DONATE_URL = 'https://donate.example.mg';

export async function openPlayStoreRating() {
  const market = `market://details?id=${PLAY_STORE_ID}`;
  const web = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;
  try {
    await Linking.openURL(market);
  } catch {
    await Linking.openURL(web);
  }
}

// TODO: add openDonate() pointing at DONATE_URL once the Papi page is live.
