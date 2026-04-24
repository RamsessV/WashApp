import { getMyLaundry } from "@/services/LaundryService";
import { Laundry } from "@/types/Laundry";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface LaundryContextValue  {
  laundry: Laundry | null;
  loading: boolean;
  error: string | null;
  refreshLaundry: (showLoader?: boolean) => Promise<void>;
  setLaundry: (value: Laundry | null) => void;
};  

const LaundryContext = createContext<LaundryContextValue | undefined>(undefined);

export function LaundryProvider({ children }: { children: ReactNode }) {
  const [laundry, setLaundry] = useState<Laundry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLaundry = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const laundryData = await getMyLaundry();
      setLaundry(laundryData);
      setError(null);
    } catch {
      setError("No pudimos cargar tu lavanderia.");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshLaundry(true);
  }, [refreshLaundry]);

  const value = useMemo(
    () => ({ laundry, loading, error, refreshLaundry, setLaundry }),
    [laundry, loading, error, refreshLaundry],
  );

  return (
    <LaundryContext.Provider value={value}>{children}</LaundryContext.Provider>
  );
}

export function useLaundryContext() {
  const context = useContext(LaundryContext);

  if (!context) {
    throw new Error("useLaundryContext must be used inside LaundryProvider");
  }

  return context;
}

