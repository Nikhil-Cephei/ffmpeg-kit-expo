# @nikhil-cephei/ffmpeg-kit-react-native

A maintained fork of [ffmpeg-kit-react-native](https://github.com/arthenica/ffmpeg-kit) that bundles the
`full-gpl` variant of FFmpeg Kit for React Native (Android + iOS), with the Android AAR downloaded automatically
on install and iOS CocoaPod sourced from a self-hosted podspec.

### 1. Features

- Includes both `FFmpeg` and `FFprobe`
- Supports
  - Both `Android` and `iOS`
  - FFmpeg `v6.0`
  - `arm-v7a`, `arm-v7a-neon`, `arm64-v8a`, `x86` and `x86_64` architectures on Android
  - `Android API Level 24` or later
  - `armv7`, `armv7s`, `arm64`, `arm64-simulator`, `i386`, `x86_64`, `x86_64-mac-catalyst` and `arm64-mac-catalyst` architectures on iOS
  - `iOS SDK 12.1` or later
  - Can process Storage Access Framework (SAF) Uris on Android
  - 25 external libraries

    `dav1d`, `fontconfig`, `freetype`, `fribidi`, `gmp`, `gnutls`, `kvazaar`, `lame`, `libass`, `libiconv`,
    `libilbc`, `libtheora`, `libvorbis`, `libvpx`, `libwebp`, `libxml2`, `opencore-amr`, `opus`, `shine`,
    `snappy`, `soxr`, `speex`, `twolame`, `vo-amrwbenc`, `zimg`

  - 4 external libraries with GPL license

    `vid.stab`, `x264`, `x265`, `xvidcore`

  - `zlib` and `MediaCodec` Android system libraries
  - `bzip2`, `iconv`, `libuuid`, `zlib` system libraries and `AudioToolbox`, `VideoToolbox`, `AVFoundation`
    system frameworks on iOS

- Includes TypeScript definitions
- Licensed under `LGPL 3.0` by default; `full-gpl` package licensed under `GPL v3.0`

### 2. Installation

```sh
npm install @nikhil-cephei/ffmpeg-kit-react-native
# or
yarn add @nikhil-cephei/ffmpeg-kit-react-native
```

The `postinstall` script automatically downloads the Android AAR (~57 MB) from GitHub on first install.

#### 2.1 iOS — Pod setup

Add the following to your `ios/Podfile` before the `use_expo_modules!` / `use_native_modules!` line:

```ruby
pod 'ffmpeg-kit-ios-full-gpl', :podspec => '../node_modules/@nikhil-cephei/ffmpeg-kit-react-native/ios/ffmpeg-kit-ios-full-gpl.podspec'
pod 'ffmpeg-kit-react-native', :subspecs => ['full-gpl'], :podspec => '../node_modules/@nikhil-cephei/ffmpeg-kit-react-native/ffmpeg-kit-react-native.podspec'
```

Then run:

```sh
cd ios && pod install
```

#### 2.2 Expo — Config Plugin

If you are using Expo managed workflow, add the plugin to your `app.json` / `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      ["@nikhil-cephei/ffmpeg-kit-react-native", { "subspec": "full-gpl" }]
    ]
  }
}
```

Then run `npx expo prebuild` to regenerate native projects.

#### 2.3 Available subspecs

| Subspec | Android API | iOS Min |
|---|---|---|
| `min` | 24 | 12.1 |
| `min-lts` | 16 | 10 |
| `min-gpl` | 24 | 12.1 |
| `min-gpl-lts` | 16 | 10 |
| `https` _(default)_ | 24 | 12.1 |
| `https-lts` | 16 | 10 |
| `https-gpl` | 24 | 12.1 |
| `https-gpl-lts` | 16 | 10 |
| `audio` | 24 | 12.1 |
| `audio-lts` | 16 | 10 |
| `video` | 24 | 12.1 |
| `video-lts` | 16 | 10 |
| `full` | 24 | 12.1 |
| `full-lts` | 16 | 10 |
| `full-gpl` | 24 | 12.1 |
| `full-gpl-lts` | 16 | 10 |

### 3. Using

1. Execute FFmpeg commands.

    ```js
    import { FFmpegKit, ReturnCode } from '@nikhil-cephei/ffmpeg-kit-react-native';

    FFmpegKit.execute('-i file1.mp4 -c:v mpeg4 file2.mp4').then(async (session) => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
      } else if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
      } else {
        // ERROR
      }
    });
    ```

2. Each `execute` call creates a new session. Access every detail about your execution from the session.

    ```js
    FFmpegKit.execute('-i file1.mp4 -c:v mpeg4 file2.mp4').then(async (session) => {
      const sessionId = session.getSessionId();
      const command = session.getCommand();
      const commandArguments = session.getArguments();
      const state = await session.getState();
      const returnCode = await session.getReturnCode();

      const startTime = session.getStartTime();
      const endTime = await session.getEndTime();
      const duration = await session.getDuration();

      const output = await session.getOutput();
      const failStackTrace = await session.getFailStackTrace();
      const logs = await session.getLogs();
      const statistics = await session.getStatistics();
    });
    ```

3. Execute `FFmpeg` commands asynchronously with callbacks.

    ```js
    FFmpegKit.executeAsync('-i file1.mp4 -c:v mpeg4 file2.mp4',
      session => { /* called when session completes */ },
      log => { /* called when session prints logs */ },
      statistics => { /* called when session generates statistics */ }
    );
    ```

4. Execute `FFprobe` commands.

    ```js
    import { FFprobeKit } from '@nikhil-cephei/ffmpeg-kit-react-native';

    FFprobeKit.execute(ffprobeCommand).then(async (session) => {
      // CALLED WHEN SESSION IS EXECUTED
    });
    ```

5. Get media information for a file or URL.

    ```js
    FFprobeKit.getMediaInformation(url).then(async (session) => {
      const information = await session.getMediaInformation();

      if (information === undefined) {
        const state = FFmpegKitConfig.sessionStateToString(await session.getState());
        const returnCode = await session.getReturnCode();
        const failStackTrace = await session.getFailStackTrace();
        const output = await session.getOutput();
      }
    });
    ```

6. Stop ongoing FFmpeg operations.

    ```js
    // Stop all sessions
    FFmpegKit.cancel();

    // Stop a specific session
    FFmpegKit.cancel(sessionId);
    ```

7. (Android) Convert Storage Access Framework (SAF) URIs into paths usable by FFmpegKit.

    ```js
    // Reading
    FFmpegKitConfig.selectDocumentForRead('*/*').then(uri => {
      FFmpegKitConfig.getSafParameterForRead(uri).then(safUrl => {
        FFmpegKit.executeAsync(`-i ${safUrl} -c:v mpeg4 file2.mp4`);
      });
    });

    // Writing
    FFmpegKitConfig.selectDocumentForWrite('video.mp4', 'video/*').then(uri => {
      FFmpegKitConfig.getSafParameterForWrite(uri).then(safUrl => {
        FFmpegKit.executeAsync(`-i file1.mp4 -c:v mpeg4 ${safUrl}`);
      });
    });
    ```

8. Get previous sessions from history.

    ```js
    FFmpegKit.listSessions().then(sessionList => {
      sessionList.forEach(async session => {
        const sessionId = session.getSessionId();
      });
    });

    FFprobeKit.listFFprobeSessions().then(sessionList => { /* ... */ });
    FFprobeKit.listMediaInformationSessions().then(sessionList => { /* ... */ });
    ```

9. Enable global callbacks.

    ```js
    FFmpegKitConfig.enableFFmpegSessionCompleteCallback(session => { /* ... */ });
    FFmpegKitConfig.enableFFprobeSessionCompleteCallback(session => { /* ... */ });
    FFmpegKitConfig.enableMediaInformationSessionCompleteCallback(session => { /* ... */ });

    FFmpegKitConfig.enableLogCallback(log => {
      const message = log.getMessage();
    });

    FFmpegKitConfig.enableStatisticsCallback(statistics => {
      const size = statistics.getSize();
    });
    ```

10. Register system fonts and custom font directories.

    ```js
    FFmpegKitConfig.setFontDirectoryList(["/system/fonts", "/System/Library/Fonts", "<folder with fonts>"]);
    ```

### 4. License

Licensed under `LGPL 3.0`. The `full-gpl` package (used by default in this fork) is licensed under `GPL v3.0`
due to the inclusion of `vid.stab`, `x264`, `x265`, and `xvidcore`.

### 5. Credits

Based on the original [ffmpeg-kit](https://github.com/arthenica/ffmpeg-kit) by
[ARTHENICA](https://www.arthenica.com). This fork packages the `full-gpl` build with self-hosted binaries
to work around the retirement of the original CocoaPods and Maven artifacts.
