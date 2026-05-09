import { supabase } from "@/lib/supabase";
import { CreateOrder, CreateOrderItem, Order, OrderItem } from "@/types/Order";
import { getUserId } from "./authService";

export async function createOrder(
  createOrderData: CreateOrder,
  orderItems: CreateOrderItem[],
) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      laundry_id: createOrderData.laundryId,
      user_id: userId!,
      total: createOrderData.total,
      status: createOrderData.status,
      paid: createOrderData.paid,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }

  const orderId = data.id;

  // Create order items
  const orderItemPromises = orderItems.map(async (item) => {
    const { error } = await supabase.from("orders_details").insert({
      order_id: orderId,
      service: item.service,
      quantity: item.quantity,
      subtotal: item.subtotal,
    });

    if (error) {
      console.error("Error creating order item:", error);
      throw new Error("Failed to create order item");
    }
  });

  await Promise.all(orderItemPromises);

  return data;
}

export async function getOrders() {
  const userId = await getUserId();
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }

  return data as Order[];
}

export async function getOrderById(orderId: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }

  return data as Order | null;
}

export async function getOrderItems(orderId: number) {
  const { data, error } = await supabase
    .from("orders_details")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    console.error("Error fetching order items:", error);
    throw new Error("Failed to fetch order items");
  }

  return data as OrderItem[];
}
