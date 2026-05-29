Pod::Spec.new do |s|
  s.name             = 'ffmpeg-kit-ios-full-gpl'
  s.version          = '6.0'
  s.summary          = 'FFmpegKit iOS full-gpl xcframeworks (self-hosted).'
  s.homepage         = 'https://github.com/Nikhil-Cephei/ffmpeg-kit-rn-full-gpl'
  s.license          = { :type => 'LGPL' }
  s.author           = { 'Nikhil-Cephei' => 'https://github.com/Nikhil-Cephei' }
  s.platform         = :ios, '12.1'
  s.static_framework = true

  s.source = {
    :http => 'https://github.com/Nikhil-Cephei/ffmpeg-kit-rn-full-gpl/archive/refs/tags/latest.zip'
  }

  s.vendored_frameworks = [
    'ffmpeg-kit-rn-full-gpl-latest/ios/ffmpegkit.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libavcodec.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libavdevice.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libavfilter.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libavformat.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libavutil.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libswresample.xcframework',
    'ffmpeg-kit-rn-full-gpl-latest/ios/libswscale.xcframework'
  ]
end
