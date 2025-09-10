module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['@tamagui/core', '@tamagui/stacks', '@tamagui/text', '@tamagui/button', '@tamagui/card', '@tamagui/separator', '@tamagui/avatar', '@tamagui/input', '@tamagui/switch', '@tamagui/slider'],
          config: './tamagui.config.ts',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
