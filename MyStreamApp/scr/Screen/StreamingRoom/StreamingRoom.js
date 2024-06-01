import React from "react";
import { View, Text } from "react-native";
import RoomListUsers from "./RoomListUsers";

const StreamingRoom = ({ navigation, route }) => {
  const { room } = route.params;

  console.log("StreamingRoom", room);

  return (
    <View style={{ width: "100%", height: "auto", flexDirection: "column" }}>
      <Text>{`Room Streamer ${room.id}`}</Text>
      <RoomListUsers />
    </View>
  );
};

export default StreamingRoom;
