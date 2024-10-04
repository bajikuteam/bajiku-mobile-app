import { Image, StyleSheet, Platform, View, Text, StatusBar, SafeAreaView } from "react-native";
import Sidebar from "@/components/Sidebar";
import DatePickerComponent from "@/components/DatePicker";

export default function HomeScreen() {
  return ( // You need to return the JSX
    <SafeAreaView>
      <StatusBar />
      <Sidebar />
      {/* <DatePickerComponent/> */}
    </SafeAreaView>
  );
}
