import { StatusBar } from "expo-status-bar";

import { SafeAreaView } from "react-native-safe-area-context";

import Home from "./Screens/Home";

export default function App() {
  return (
    <SafeAreaView>
      <Home />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
