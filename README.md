# SongShot

A little React Native app that makes music videos out of your photos.

Pick a picture, pick a song from your library, drag the waveform to choose your favorite 15–60 seconds, and the app renders an MP4 you can share anywhere. Everything happens on your phone — no uploads, no accounts, no internet needed.

**How it works:** Home → Pick a photo → Pick a song → Trim the audio → Get your video.

The heavy lifting is done by FFmpeg running on-device. Your finished creations are saved locally so you can re-share them later.

## Running it

Requires Node 22+ and a React Native dev environment.

```sh
npm install
npm start
```

Then in another terminal: `npm run android` or `npm run ios` (iOS needs `bundle exec pod install` first).
