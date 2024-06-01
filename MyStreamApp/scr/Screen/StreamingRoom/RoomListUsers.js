import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const RoomListUsers = ({
  creatorId,
  users,
  showBtn,
  setShowBtn,
  btndata,
  isCreator,
  handleUserPress,
}) => {
  console.log("RoomListUsers", users);
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          {item.id !== creatorId ? (
            <>
              <Pressable onPress={() => handleUserPress(item)}>
                <View style={styles.user}>
                  <Text>{item.id}</Text>
                </View>
              </Pressable>
              {showBtn === item.id &&
                (isCreator || (isModerator && item.id !== creatorId)) &&
                btndata
                  .filter((btn) => !btn.condition || btn.condition(item))
                  .map((btn, index) => (
                    <Pressable key={index} onPress={() => btn.onPress(item)}>
                      <Text>{btn.text}</Text>
                    </Pressable>
                  ))}
            </>
          ) : null}
        </View>
      )}
    />
  );
};

export default RoomListUsers;

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
