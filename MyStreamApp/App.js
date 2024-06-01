import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Routes from "./scr/Navigation/Routes";
import { ContextProvider } from "./scr/Context/AuthContenxt";
import { SocketProvider } from "./scr/Context/SocketContext";

const App = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <SocketProvider>
          <Routes />
        </SocketProvider>
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
