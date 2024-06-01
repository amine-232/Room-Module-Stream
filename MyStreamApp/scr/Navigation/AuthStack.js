import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screen/Login";
import SignUp from "../Screen/SignUp";

const StackAuth = createStackNavigator();

const AuthStack = () => {
  return (
    <StackAuth.Navigator initialRouteName="login">
      <StackAuth.Screen name="login" component={Login} />
      <StackAuth.Screen name="signUp" component={SignUp} />
    </StackAuth.Navigator>
  );
};

export default AuthStack;
