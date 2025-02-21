import * as React from 'react';

import { View } from '@/components/ui';
import { Text } from '@/components/ui';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export const ItemsContainer = ({ title, children }: Props) => {
  return (
    <View className="w-full">
      {title && <Text className="pb-2 pt-4 text-lg">{title}</Text>}
      <View className="rounded-lg bg-neutral-200 dark:bg-neutral-800">
        {children}
      </View>
    </View>
  );
};
