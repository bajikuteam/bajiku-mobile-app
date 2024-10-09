import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Platform, View, Text, StatusBar, SafeAreaView } from "react-native";
import Sidebar from "@/components/Sidebar";


export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Sidebar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
