import React from "react";
import { View, Text } from "react-native";
import CreateRoomScreen from "./StreamingRoom/MainScrean";

const Home = ({ navigation }) => {
  return (
    <View>
      <CreateRoomScreen navigation={navigation} />
    </View>
  );
};

export default Home;
