import React, { useContext, useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { SocketContext } from "../../Context/SocketContext";

const RoomListScreen = ({ navigation }) => {
  const { newSocket } = useContext(SocketContext);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    newSocket.emit("getRooms");

    newSocket.on("roomsUpdated", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      newSocket.off("roomsUpdated");
    };
  }, []);

  const Itemrender = ({ item }) => {
    return (
      <View style={styles.room}>
        <Text>{item[1].name}</Text>
        <Button
          title="Join"
          onPress={() =>
            navigation.navigate("RoomDetail", {
              room: { id: item[0], ...item[1] },
            })
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => <Itemrender item={item} />}
      />
      <Button
        title="Create Room"
        onPress={() => navigation.navigate("CreateRoom")}
      />
    </View>
  );
};

export default RoomListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  room: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
