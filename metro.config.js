
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Add this to handle the 'exports' field in rpc-websockets
config.resolver.sourceExts.push('mjs');
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'import'];

config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
};

module.exports = config;
