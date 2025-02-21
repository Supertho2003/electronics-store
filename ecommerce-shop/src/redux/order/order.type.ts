// order.type.ts
export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface OrderDto {
    id: number;
    userId: number;
    orderDate: string; 
    totalAmount: number; 
    status: string;
    items: OrderItemDto[];
}


export interface OrderResponseWithPaymentUrl extends OrderDto {
    paymentUrl: string;
}


export interface OrderItemDto {
    productBrand: string;
    quantity: number;
    product: ProductDto;
}

export interface ProductDto {
    id: number;
    name: string;
    brand: string;
    price: number; 
    description: string;
    category: CategoryDto; 
}

export interface CategoryDto {
    id: number;
    name: string; 
}
