import { supabase } from "@/lib/supabase";
import { Laundry } from "@/types/Laundry";
import { getUserId } from "./authService";

export async function getLaundrys() {
  const { data, error } = await supabase.from("laundrys").select();

  if (error) {
    console.error("Error fetching laundrys:", error);
    return [];
  }

  return (data ?? []) as Laundry[];
}

export async function getMyLaundry() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("laundrys")
    .select()
    .eq("owner", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching laundry by user ID:", error);
    return null;
  }

  return (data as Laundry | null) ?? null;
}

export async function updateLaundry(
  laundryName: string,
  laundryAddress: string,
  laundryPhone: string,
) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("laundrys")
    .update({
      name: laundryName,
      address: laundryAddress,
      phone: laundryPhone,
    })
    .eq("owner", userId)
    .maybeSingle();

  if (error) {
    console.error("Error updating laundry:", error);
    return null;
  }

  return (data as Laundry | null) ?? null;
}
