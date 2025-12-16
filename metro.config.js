
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

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

// This is the new part to prepend the shim.js file
const projectRoot = __dirname;
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
  prelude: `
    try {
      require("${path.resolve(projectRoot, 'shim.js')}");
    } catch (e) {
      console.error("Could not load shim.js", e);
    }
  `,
});

module.exports = config;
