const { getDefaultConfig } = require('expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin');

const config = getDefaultConfig(__dirname);

module.exports = withTamagui(config, {
  components: ['@tamagui/core', '@tamagui/stacks', '@tamagui/text', '@tamagui/button', '@tamagui/card', '@tamagui/separator', '@tamagui/avatar', '@tamagui/input', '@tamagui/switch', '@tamagui/slider'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
});
