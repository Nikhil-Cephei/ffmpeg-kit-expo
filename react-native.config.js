module.exports = {
  dependency: {
    platforms: {
      // iOS is handled by the Expo config plugin (withFFmpegKit).
      // Disabling auto-linking prevents use_native_modules! from adding the
      // default subspec and conflicting with the plugin's subspec selection.
      ios: null,
    },
  },
};
