/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { router } from 'expo-router';
import React from 'react';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { ThemeItem } from '@/components/settings/theme-item';
import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';

export default function Home() {
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">Home Screen</Text>
          <ItemsContainer title="General Settings">
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="About">
            <Item text="App Name" value={Env.NAME} />
            <Item text="Version" value={Env.VERSION} />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item
                text="settings.logout"
                onPress={() => {
                  router.replace('/onboarding');
                }}
              />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
