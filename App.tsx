import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChatMessage, Message } from "./components/ChatMessage";
import ConvAiDOMComponent from "./components/ConvAI";
import tools from "./utils/tools";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ status }) => {
      if (status !== "granted") {
        alert("Debés habilitar el permiso de micrófono para usar esta app.");
      }
    });
  }, []);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topContent}>
        <Text style={styles.description}>
          Cross-platform conversational AI agents with ElevenLabs and Expo React
          Native.
        </Text>

        <View style={styles.toolsList}>
          <Text style={styles.toolsTitle}>Available Client Tools:</Text>
          <View style={styles.toolItem}>
            <Text style={styles.toolText}>Get battery level</Text>
            <View style={styles.platformTags}>
              <Text style={styles.platformTag}>web</Text>
              <Text style={styles.platformTag}>ios</Text>
              <Text style={styles.platformTag}>android</Text>
            </View>
          </View>
          <View style={styles.toolItem}>
            <Text style={styles.toolText}>Change screen brightness</Text>
            <View style={styles.platformTags}>
              <Text style={styles.platformTag}>ios</Text>
              <Text style={styles.platformTag}>android</Text>
            </View>
          </View>
          <View style={styles.toolItem}>
            <Text style={styles.toolText}>Flash screen</Text>
            <View style={styles.platformTags}>
              <Text style={styles.platformTag}>ios</Text>
              <Text style={styles.platformTag}>android</Text>
            </View>
          </View>
        </View>
        <View style={styles.domComponentContainer}>
          <ConvAiDOMComponent
            dom={{ style: styles.domComponent }}
            platform={Platform.OS}
            get_battery_level={tools.get_battery_level}
            change_brightness={tools.change_brightness}
            flash_screen={tools.flash_screen}
            onMessage={message => {
              setMessages(prev => [message, ...prev]);
            }}
          />
        </View>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </ScrollView>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContent: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#E2E8F0",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 24,
    marginBottom: 24,
  },
  toolsList: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  toolsTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#E2E8F0",
    marginBottom: 16,
  },
  toolItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  toolText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#E2E8F0",
  },
  platformTags: {
    flexDirection: "row",
    gap: 8,
  },
  platformTag: {
    fontSize: 12,
    color: "#94A3B8",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
    fontFamily: "Inter-Regular",
  },
  domComponentContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  domComponent: {
    width: 120,
    height: 120,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});
