// Componente para gestionar la comunicacion con ElevenLabs
"use dom";
import { useConversation } from "@11labs/react";
import { Audio } from "expo-av";
import { Mic } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Message } from "../components/ChatMessage";
import { AGENT_ID, ELEVENLABS_API_KEY } from "../utils/env";
//import tools from "../utils/tools";

// Solicita permiso para usar el microfono
async function requestMicrophonePermission() {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission to access microphone was denied");
    return false;
  }
  return true;
}

// Obtiene la fecha actual formateada y el dia de la semana
function getFormattedDate() {
  const date = new Date();
  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const dayOfWeek = dayNames[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return {
    formattedDate: `${day}/${month}/${year}`,
    dayOfWeek,
  };
}

// Genera un identificador unico para la sesion
function generateSessionId() {
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Almacena el identificador de la sesion actual
let sessionId: string | null = null;

// Devuelve el identificador de sesion, generandolo si es necesario
function getSessionId() {
  if (!sessionId) {
    sessionId = generateSessionId();
  }
  return sessionId;
}


export default function ConvAiDOMComponent({
  //platform,
  //get_battery_level,
  //change_brightness,
  //flash_screen,
  onMessage,
}: {
  dom?: import("expo/dom").DOMProps;
  //platform: string;
  //get_battery_level: typeof tools.get_battery_level;
  //change_brightness: typeof tools.change_brightness;
  //flash_screen: typeof tools.flash_screen;
  onMessage: (message: Message) => void;
}) {
// Hook que se conecta con el servicio de conversacion
  const conversation = useConversation({
    apiKey: ELEVENLABS_API_KEY,
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: message => {
      onMessage(message);
    },
    onError: error => console.error("Error:", error),
  });
// Funcion que inicia la conversacion con el agente
  const startConversation = useCallback(async () => {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert("No permission");
        return;
      }
  
      const { formattedDate, dayOfWeek } = getFormattedDate();
  
      await conversation.startSession({
        agentId: AGENT_ID,
        dynamicVariables: {
          //platform,
          fecha_actual: formattedDate,
          dia_semana: dayOfWeek,
          sessionId: getSessionId(), // This is the session ID
        },
        clientTools: {
          logMessage: async ({ message }) => {
            console.log(message);
          },
          //get_battery_level,
          //change_brightness,
          //flash_screen,
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);
  
// Finaliza la conversacion en curso
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
// Boton para iniciar o detener la conversacion
    <Pressable
      style={[
        styles.callButton,
        conversation.status === "connected" && styles.callButtonActive,
      ]}
      onPress={
        conversation.status === "disconnected"
          ? startConversation
          : stopConversation
      }
    >
      <View
        style={[
          styles.buttonInner,
          conversation.status === "connected" && styles.buttonInnerActive,
        ]}
      >
        <Mic
          size={32}
          color="#E2E8F0"
          strokeWidth={1.5}
          style={styles.buttonIcon}
        />
      </View>
    </Pressable>
  );
}

// Estilos del boton de microfono
const styles = StyleSheet.create({
  callButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  callButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  buttonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
  },
  buttonIcon: {
    transform: [{ translateY: 2 }],
  },
});
