export interface OrderItem {
    id: number;
    order_id: number;
    service: string;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: number;
    created_at: string;
    laundry_id: number;
    user_id: string;
    total: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    paid: boolean;
}

export interface CreateOrder {
    laundryId: number;
    total: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    paid: boolean;
}

export interface CreateOrderItem {
    service: string;
    quantity: number;
    subtotal: number;
}