import { supabase } from "@/lib/supabase";
import { Service } from "@/types/Service";

export async function getServicesByLaundryId(laundryId: number) {
    const { data, error } = await supabase.from("prices").select().eq("laundry", laundryId);

    if (error) {
        console.error("Error fetching services by laundry ID:", error);
        return [];
    }

    return data as Service[];

}

export async function createService(service: string, price: number, laundry: number) {
    const { data, error } = await supabase.from("prices").insert([{ service, price, laundry }]);

    if (error) {
        console.error("Error creating service:", error);
        return null;
    }
}


export async function deleteService(serviceId: number) {
    const { data, error } = await supabase.from("prices").delete().eq("id", serviceId);
}