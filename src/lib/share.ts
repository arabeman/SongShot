import * as RNFS from '@dr.pogodin/react-native-fs';
import { Alert } from 'react-native';
import Share from 'react-native-share';

/**
 * Open the system share sheet for an exported creation video.
 *
 * react-native-share's Android FileProvider only exposes the Download folder
 * and the app cache dir, so a video living under DocumentDirectoryPath must
 * be staged in cache first or the share intent fails to resolve the file.
 */
export async function shareCreationVideo(videoPath: string): Promise<void> {
  try {
    const stagedPath = `${RNFS.CachesDirectoryPath}/${videoPath.split('/').pop()}`;
    if (await RNFS.exists(stagedPath)) await RNFS.unlink(stagedPath);
    await RNFS.copyFile(videoPath, stagedPath);
    await Share.open({
      url: `file://${stagedPath}`,
      type: 'video/mp4',
      failOnCancel: false,
    });
  } catch {
    Alert.alert("Couldn't share", 'Try saving to the gallery and sharing from there.');
  }
}
