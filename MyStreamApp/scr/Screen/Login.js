import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, StatusBar } from "react-native";
import CostumeInput from "../component/CostumeInput";
import { auth } from "../Auth/Firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErorrMessage] = useState(false);

  useEffect(() => {}, [email, password]);
  // import { auth } from '../firebase/fireBase';
  //  make sure to have add the FirebaseSets as firebase.js in to your folder
  // login set

  // the sign up is set

  // left to do
  // set socket context
  // create room enter
  //

  const InputLogiMap = [
    {
      setValue: setEmail,
      placeholder: "enter you Eamil",
    },
    {
      setValue: setPassword,
      placeholder: "enter you'r Password",
    },
  ];

  const FunctionSignIn = async () => {
    if (email === "") {
      setErorrMessage("email field can't be Empthy");
    }

    if (password === "") {
      setErorrMessage("password field can't be Empthy");
    }
    if (email !== "" && password !== "") {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (credential) => {
          const user = credential.user;
          const userId = user.uid;
          console.log("userId", userId);
        })
        .catch((error) => {
          console.log("FunctionSignIn error:", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <View style={styles.loginPanel}>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        {InputLogiMap.map((inputLogin, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <CostumeInput
              setValue={inputLogin.setValue}
              placeholder={inputLogin.placeholder}
            />
          </View>
        ))}
        <Button title="Login" onPress={() => FunctionSignIn()} />
        <Button
          onPress={() => navigation.navigate("signUp")}
          title="create Account"
        />
      </View>
    </View>
  );
};

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
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "silver",
  },
});

export default Login;
