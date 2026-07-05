import {
  FFmpegKit,
  FFprobeKit,
  ReturnCode,
  Statistics,
} from '@wokcito/ffmpeg-kit-react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { colors } from '../theme';

/** Strip the file:// scheme so FFmpeg gets a plain filesystem path. */
export function uriToPath(uri: string): string {
  return decodeURIComponent(uri.replace(/^file:\/\//, ''));
}

export async function probeDurationSec(uri: string): Promise<number | null> {
  try {
    const session = await FFprobeKit.getMediaInformation(uriToPath(uri));
    const info = session.getMediaInformation();
    const raw = info?.getDuration();
    const dur = raw ? parseFloat(String(raw)) : NaN;
    return Number.isFinite(dur) && dur > 0 ? dur : null;
  } catch {
    return null;
  }
}

/**
 * Render the song's waveform to a transparent PNG (ink-colored) for the
 * trimmer strip. Returns null if the filter isn't available in this build.
 */
export async function renderWaveformPng(songUri: string, outPath: string): Promise<string | null> {
  try {
    if (await RNFS.exists(outPath)) await RNFS.unlink(outPath);
    const session = await FFmpegKit.executeWithArguments([
      '-y',
      '-i', uriToPath(songUri),
      '-filter_complex',
      `aformat=channel_layouts=mono,compand,showwavespic=s=1000x160:colors=${colors.ink}`,
      '-frames:v', '1',
      outPath,
    ]);
    const ok = ReturnCode.isSuccess(await session.getReturnCode());
    return ok && (await RNFS.exists(outPath)) ? outPath : null;
  } catch {
    return null;
  }
}

interface ExportOptions {
  imageUri: string;
  songUri: string;
  startSec: number;
  durSec: number;
  outPath: string;
  onProgress?: (fraction: number) => void;
}

// Keep output dimensions even (required by yuv420p) and capped at 1080 wide.
const SCALE_FILTER =
  "scale=w='min(1080,iw)':h=-2,crop='trunc(iw/2)*2':'trunc(ih/2)*2',format=yuv420p";

function buildArgs(opts: ExportOptions, videoCodecArgs: string[]): string[] {
  return [
    '-y',
    '-loop', '1',
    '-i', uriToPath(opts.imageUri),
    '-ss', opts.startSec.toFixed(3),
    '-t', opts.durSec.toFixed(3),
    '-i', uriToPath(opts.songUri),
    '-map', '0:v',
    '-map', '1:a',
    '-vf', SCALE_FILTER,
    '-r', '30',
    ...videoCodecArgs,
    '-c:a', 'aac',
    '-b:a', '192k',
    '-t', opts.durSec.toFixed(3),
    '-movflags', '+faststart',
    opts.outPath,
  ];
}

function runExport(opts: ExportOptions, videoCodecArgs: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    FFmpegKit.executeWithArgumentsAsync(
      buildArgs(opts, videoCodecArgs),
      async (session) => {
        try {
          resolve(ReturnCode.isSuccess(await session.getReturnCode()));
        } catch (e) {
          reject(e);
        }
      },
      undefined,
      (stats: Statistics) => {
        const ms = stats.getTime();
        if (opts.onProgress && ms > 0) {
          opts.onProgress(Math.min(1, ms / (opts.durSec * 1000)));
        }
      },
    );
  });
}

/**
 * Mux the still image with the selected song segment into an MP4.
 * Tries the hardware H.264 encoder first; the bundled FFmpeg build has no
 * libx264 (GPL), so we fall back to the built-in mpeg4 encoder.
 */
export async function exportCreationVideo(opts: ExportOptions): Promise<void> {
  if (await RNFS.exists(opts.outPath)) await RNFS.unlink(opts.outPath);

  const h264 = await runExport(opts, ['-c:v', 'h264_mediacodec', '-b:v', '5M']);
  if (h264) return;

  if (await RNFS.exists(opts.outPath)) await RNFS.unlink(opts.outPath);
  const mpeg4 = await runExport(opts, ['-c:v', 'mpeg4', '-q:v', '3']);
  if (!mpeg4) {
    throw new Error('FFmpeg could not encode the video.');
  }
}
