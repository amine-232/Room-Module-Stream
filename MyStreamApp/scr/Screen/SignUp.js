import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import CostumeInput from "../component/CostumeInput";
import { auth } from "../Auth/Firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const InputMap = [
    {
      setValue: setEmail,
      placeholder: "enter you Eamil",
    },
    {
      setValue: setPassword,
      placeholder: "enter you'r Password",
    },
  ];

  //  make sure to have add the FirebaseSets as firebase.js in to your folder

  const SignUpFunc = async () => {
    if (email !== "" && password !== "") {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (credential) => {
          const userId = credential.user.uid;
          const userEmail = credential.user.email;
          console.log("userId:", userId);
          if (userId && userEmail) {
            // add savaDatafunc to save data in to fireStore
            // just type savaDatafunc
            // await saveUserData(userId, userEmail);
          }
        })
        .catch((error) => {
          console.log("FunctionSignUp error:", error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <Text>SignUpin</Text>
      <View style={styles.loginPanel}>
        {InputMap.map((v, index) => (
          <View style={{ marginVertical: 10 }}>
            <CostumeInput
              key={index}
              setValue={v.setValue}
              placeholder={v.placeholder}
            />
          </View>
        ))}
        <Button onPress={() => SignUpFunc()} title="Create Account" />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  loginPanel: {
    width: "50%",
    height: "auto",
    flexDirection: "column",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "silver",
  },
});
