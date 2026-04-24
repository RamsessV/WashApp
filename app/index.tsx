import { getSession, isLaundry } from "@/services/authService";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        const laundry = await isLaundry();
        setTarget(laundry ? "/dashboard" : "/home");
      } else {
        setTarget("/login");
      }
    })();
  }, []);

  if (!target) {
    return null;
  }

  
  return <Redirect href={target as "/home" | "/login" | "/dashboard"} />;
}
