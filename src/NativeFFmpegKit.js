// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  // AbstractSession
  abstractSessionGetEndTime(sessionId: number): Promise<?number>;
  abstractSessionGetDuration(sessionId: number): Promise<number>;
  abstractSessionGetAllLogs(sessionId: number, waitTimeout: number): Promise<$ReadOnlyArray<Object>>;
  abstractSessionGetLogs(sessionId: number): Promise<$ReadOnlyArray<Object>>;
  abstractSessionGetAllLogsAsString(sessionId: number, waitTimeout: number): Promise<?string>;
  abstractSessionGetState(sessionId: number): Promise<number>;
  abstractSessionGetReturnCode(sessionId: number): Promise<?number>;
  abstractSessionGetFailStackTrace(sessionId: number): Promise<?string>;
  thereAreAsynchronousMessagesInTransmit(sessionId: number): Promise<boolean>;

  // ArchDetect
  getArch(): Promise<string>;

  // FFmpegSession
  ffmpegSession(args: $ReadOnlyArray<string>): Promise<Object>;
  ffmpegSessionGetAllStatistics(sessionId: number, waitTimeout: number): Promise<$ReadOnlyArray<Object>>;
  ffmpegSessionGetStatistics(sessionId: number): Promise<$ReadOnlyArray<Object>>;

  // FFprobeSession
  ffprobeSession(args: $ReadOnlyArray<string>): Promise<Object>;

  // MediaInformationSession
  mediaInformationSession(args: $ReadOnlyArray<string>): Promise<Object>;
  mediaInformationJsonParserFrom(ffprobeJsonOutput: string): Promise<?Object>;
  mediaInformationJsonParserFromWithError(ffprobeJsonOutput: string): Promise<?Object>;

  // FFmpegKitConfig
  enableRedirection(): Promise<void>;
  disableRedirection(): Promise<void>;
  enableLogs(): Promise<void>;
  disableLogs(): Promise<void>;
  enableStatistics(): Promise<void>;
  disableStatistics(): Promise<void>;
  setFontconfigConfigurationPath(path: string): Promise<void>;
  setFontDirectory(fontDirectoryPath: string, fontNameMap: Object): Promise<void>;
  setFontDirectoryList(fontDirectoryList: $ReadOnlyArray<string>, fontNameMap: Object): Promise<void>;
  registerNewFFmpegPipe(): Promise<string>;
  closeFFmpegPipe(ffmpegPipePath: string): Promise<void>;
  getFFmpegVersion(): Promise<string>;
  isLTSBuild(): Promise<number>;
  getBuildDate(): Promise<string>;
  setEnvironmentVariable(variableName: string, variableValue: string): Promise<void>;
  ignoreSignal(signalValue: number): Promise<void>;
  ffmpegSessionExecute(sessionId: number): Promise<void>;
  ffprobeSessionExecute(sessionId: number): Promise<void>;
  mediaInformationSessionExecute(sessionId: number, waitTimeout: number): Promise<void>;
  asyncFFmpegSessionExecute(sessionId: number): Promise<void>;
  asyncFFprobeSessionExecute(sessionId: number): Promise<void>;
  asyncMediaInformationSessionExecute(sessionId: number, waitTimeout: number): Promise<void>;
  getLogLevel(): Promise<number>;
  setLogLevel(level: number): Promise<void>;
  getSessionHistorySize(): Promise<number>;
  setSessionHistorySize(sessionHistorySize: number): Promise<void>;
  getSession(sessionId: number): Promise<Object>;
  getLastSession(): Promise<?Object>;
  getLastCompletedSession(): Promise<?Object>;
  getSessions(): Promise<$ReadOnlyArray<Object>>;
  clearSessions(): Promise<void>;
  getSessionsByState(sessionState: number): Promise<$ReadOnlyArray<Object>>;
  getLogRedirectionStrategy(): Promise<number>;
  setLogRedirectionStrategy(logRedirectionStrategy: number): Promise<void>;
  messagesInTransmit(sessionId: number): Promise<number>;
  getPlatform(): Promise<string>;
  writeToPipe(inputPath: string, namedPipePath: string): Promise<number>;
  selectDocument(writable: boolean, title: ?string, type: string, extraTypes: $ReadOnlyArray<string>): Promise<?string>;
  getSafParameter(uriString: string, openMode: string): Promise<?string>;

  // FFmpegKit
  cancel(): Promise<void>;
  cancelSession(sessionId: number): Promise<void>;
  getFFmpegSessions(): Promise<$ReadOnlyArray<Object>>;

  // FFprobeKit
  getFFprobeSessions(): Promise<$ReadOnlyArray<Object>>;
  getMediaInformationSessions(): Promise<$ReadOnlyArray<Object>>;

  // MediaInformationSession
  getMediaInformation(sessionId: number): Promise<?Object>;

  // Packages
  getPackageName(): Promise<string>;
  getExternalLibraries(): Promise<$ReadOnlyArray<string>>;

  uninit(): Promise<void>;

  // Required by RCTEventEmitter
  addListener(eventType: string): void;
  removeListeners(count: number): void;
}

export default (TurboModuleRegistry.get<Spec>(
  'FFmpegKitReactNativeModule',
): ?Spec);
