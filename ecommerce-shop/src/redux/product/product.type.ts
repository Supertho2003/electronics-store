export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    colors: number[];
    attributes: string;
    isAvailable: boolean;
    stock: number;
    description: string;
    categoryName: string;
    imageUrl: File | null  ; 
}

export interface ProductsResponse {
    message: string;
    data: Product[];
}

export interface ProductResponse  {
    message: string;
    data: Product;
}