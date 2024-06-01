import React from "react";
import { View, Text } from "react-native";
import RoomListUsers from "./RoomListUsers";

const RoomChat = ({ navigation, route }) => {
  const { room } = route.params;

  return (
    <View style={{ width: "100%", height: "auto", flexDirection: "column" }}>
      <Text>{`Room Viewer ${room.id}`}</Text>
      <RoomListUsers roomId={room.Id} />
    </View>
  );
};

export default RoomChat;
