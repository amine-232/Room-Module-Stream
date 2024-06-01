import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CostumeInput = ({ setValue, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </View>
  );
};

export default CostumeInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "silvar",
  },
  input: {
    width: "100%",
    height: "auto",
    fontSize: 20,
    fontWeight: "700",
    outlineStyle: "none",
  },
});
