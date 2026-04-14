import { getSession } from "@/services/authService";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData);
    }
    fetchSession();
  }, []);

  return (
    <View>
      <Text>Hola {session?.user.user_metadata.name}</Text>
    </View>
  );
}
