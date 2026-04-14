import { supabase } from "@/lib/supabase";
import { Laundry } from "@/types/Laundry";

export async function getLaundrys() {
    const { data, error } = await supabase.from("laundrys").select();
    
    if (error) {
        console.error("Error fetching laundrys:", error);
        return [];
    }

    return data as Laundry[];
}