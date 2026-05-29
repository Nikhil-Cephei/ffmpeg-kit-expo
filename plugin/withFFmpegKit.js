'use strict';

const fs = require('fs');
const path = require('path');

// Resolve @expo/config-plugins from the app root (process.cwd()) so this works
// both when the package is installed from npm and when used as a local file: link.
function requireFromProject(moduleId) {
  try {
    return require(require.resolve(moduleId, {paths: [process.cwd()]}));
  } catch (_) {
    return require(moduleId);
  }
}

const {withDangerousMod, withProjectBuildGradle} = requireFromProject('@expo/config-plugins');

const AAR_FLAT_DIR =
  '        flatDir { dirs "$rootDir/../node_modules/@nikhil-cephei/ffmpeg-kit-react-native/android/libs" }';

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

  // Android (build.gradle) — remove retired ffmpegKitPackage ext var and inject flatDir
  // into allprojects > repositories (classic RN template)
  config = withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    contents = contents.replace(
      /[ \t]*ffmpegKitPackage\s*=\s*["'][^"']*["'][ \t]*\r?\n/g,
      '',
    );

    if (!contents.includes('ffmpeg-kit-react-native/android/libs')) {
      // Inject after the opening brace of the first `repositories {` block inside `allprojects`
      contents = contents.replace(
        /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
        `$1\n${AAR_FLAT_DIR}`,
      );
    }

    config.modResults.contents = contents;
    return config;
  });

  // Android (settings.gradle) — inject flatDir into dependencyResolutionManagement > repositories
  // used by newer React Native / Expo SDK templates
  config = withDangerousMod(config, [
    'android',
    (config) => {
      const settingsPath = path.join(config.modRequest.platformProjectRoot, 'settings.gradle');
      if (!fs.existsSync(settingsPath)) return config;

      let contents = fs.readFileSync(settingsPath, 'utf8');

      if (
        contents.includes('dependencyResolutionManagement') &&
        !contents.includes('ffmpeg-kit-react-native/android/libs')
      ) {
        contents = contents.replace(
          /(dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{)/,
          `$1\n${AAR_FLAT_DIR}`,
        );
        fs.writeFileSync(settingsPath, contents);
      }

      return config;
    },
  ]);

  return config;
};

module.exports = withFFmpegKit;
