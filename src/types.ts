export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: 'user' | 'admin';
}

export interface Order {
    id: string;
    user_id: string;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
}
