/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Linking } from 'react-native';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Rate, Share, Support } from '@/components/ui/icons';
import { handleCall, signOut } from '@/lib';

export default function Settings() {
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-4 ">
          <Text className="text-xl font-bold">Settings</Text>
          <ItemsContainer title="Theme">
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="About">
            <Item text="App Name" value={Env.NAME} />
            <Item text="App Version" value={Env.VERSION} />
          </ItemsContainer>

          <ItemsContainer title="Useful Links">
            <Item
              text="Whatsapp"
              icon={<Share color={iconColor} />}
              onPress={() => {
                Linking.openURL(`https://wa.me/+0000000000?text=Help needed`);
              }}
            />
            <Item
              text="Call Knox"
              icon={<Rate color={iconColor} />}
              onPress={() => handleCall('0000000000')}
            />
            <Item
              text="Call Support"
              icon={<Support color={iconColor} />}
              onPress={() => handleCall('hi there')}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="Logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
