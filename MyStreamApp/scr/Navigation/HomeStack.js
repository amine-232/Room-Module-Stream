import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Screen/Home";
import RoomChat from "../Screen/StreamingRoom/RoomChat";
import StreamingRoom from "../Screen/StreamingRoom/StreamingRoom";
import RoomDetailScreen from "../Screen/StreamingRoom/Room";

const StackHome = createStackNavigator();

const HomeStack = () => {
  return (
    <StackHome.Navigator initialRouteName="home">
      <StackHome.Screen
        name="home"
        component={Home}
        options={{ headerShown: false }}
      />
      <StackHome.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={{ headerShown: false }}
      />
      <StackHome.Screen
        name="Streamer"
        component={StreamingRoom}
        options={{ headerShown: false }}
      />
    </StackHome.Navigator>
  );
};

export default HomeStack;
