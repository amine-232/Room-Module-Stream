import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Screen/Home";
import Login from "../Screen/Login";
import SignUp from "../Screen/SignUp";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContenxt";
import RoomChat from "../Screen/StreamingRoom/RoomChat";
import HomeStack from "./HomeStack";
import AuthStack from "./AuthStack";

const Stack = createStackNavigator();

const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user !== null ? (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
