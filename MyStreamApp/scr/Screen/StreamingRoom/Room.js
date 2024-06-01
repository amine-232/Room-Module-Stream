import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
import RoomListUsers from "./RoomListUsers";

const RoomDetailScreen = ({ route }) => {
  const { newSocket } = useContext(SocketContext);

  const { room } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [creatorId, setCreatorId] = useState(null);
  const [showBtn, setShowBtn] = useState(null); // Updated to store user id

  const navigation = useNavigation();

  console.log("users", users);
  useEffect(() => {
    newSocket.emit("joinRoom", room.id);

    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("roomUsers", ({ users, creatorId, moderators }) => {
      setUsers(users);
      const currentUser = users.find((user) => user.id === newSocket.id);
      if (currentUser) {
        setCreatorId(creatorId);
        setIsCreator(creatorId === newSocket.id);
        setIsModerator(moderators.includes(newSocket.id));
      }
    });

    newSocket.on("kicked", (roomId) => {
      if (roomId === room.id) {
        Alert.alert("You have been kicked out of the room");
        navigation.navigate("home");
      }
    });

    return () => {
      newSocket.emit("leaveRoom", room.id);
      newSocket.off("message");
      newSocket.off("roomUsers");
      newSocket.off("kicked");
    };
  }, [room.id, navigation]);

  const sendMessage = () => {
    if (message.trim()) {
      newSocket.emit("message", { roomId: room.id, message });
      setMessage("");
    }
  };

  const closeRoom = () => {
    newSocket.emit("closeRoom", room.id);
    navigation.navigate("home");
  };

  const addModerator = (userId) => {
    newSocket.emit("addModerator", room.id, userId);
  };

  const removeModerator = (userId) => {
    newSocket.emit("removeModerator", room.id, userId);
  };

  const kickUser = (userId) => {
    newSocket.emit("kickUser", room.id, userId);
  };

  const handleUserPress = (user) => {
    setShowBtn((prev) => (prev === user.id ? null : user.id));
  };

  const btndata = [
    {
      text: "Set as Moderator",
      onPress: (user) => {
        addModerator(user.id);
        setShowBtn(null);
      },
    },
    {
      text: "Remove Moderator",
      onPress: (user) => {
        removeModerator(user.id), setShowBtn(null);
      },
      // Show this option only if the user is already a moderator
      condition: (user) => user.isModerator,
    },
    {
      text: "Kick Out",
      onPress: (user) => {
        kickUser(user.id);
        setUsers((prev) => prev.filter((prev) => prev.id !== user.id));

        setShowBtn(null);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.username}>{item.username}:</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <View style={{ width: "100%", height: "auto" }}>
        <RoomListUsers
          users={Object.values(users)}
          isCreator={isCreator}
          creatorId={creatorId}
          showBtn={showBtn}
          setShowBtn={setShowBtn}
          btndata={btndata}
          handleUserPress={handleUserPress}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
      {isCreator && <Button title="Close Room" onPress={closeRoom} />}
      <Button title="Exit" onPress={() => navigation.navigate("home")} />
    </View>
  );
};

export default RoomDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  message: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  user: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
