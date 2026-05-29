'use strict';

const {withDangerousMod, withProjectBuildGradle} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFFmpegKit = (config, options = {}) => {
  const subspec = options.subspec || 'full-gpl';

  // iOS — inject pods into Podfile
  config = withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (contents.includes('ffmpeg-kit-react-native')) return config;

      const pods = [
        `  pod 'ffmpeg-kit-ios-full-gpl', :podspec => '../node_modules/@nikhil-cephei/ffmpeg-kit-react-native/ios/ffmpeg-kit-ios-full-gpl.podspec'`,
        `  pod 'ffmpeg-kit-react-native', :subspecs => ['${subspec}'], :podspec => '../node_modules/@nikhil-cephei/ffmpeg-kit-react-native/ffmpeg-kit-react-native.podspec'`,
      ].join('\n');

      contents = contents.replace(/^(\s*use_expo_modules!)/m, `${pods}\n\n$1`);
      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);

  // Android — remove retired ffmpegKitPackage ext var
  config = withProjectBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /[ \t]*ffmpegKitPackage\s*=\s*["'][^"']*["'][ \t]*\r?\n/g,
      '',
    );
    return config;
  });

  return config;
};

module.exports = withFFmpegKit;
