import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

export const BackButton = () => {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) {
    return null;
  }

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={{ marginLeft: 20 }}>
      {navigation.canGoBack() && <Button title="volver" onPress={volver} />}
    </View>
  );
};