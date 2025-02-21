export interface Image {
    id: number;
    downloadUrl: string;
}


export interface Category {
    id: number;
    name: string;
    imageUrl: File | null;
}

export interface CategoriesResponse {
    message: string;
    data: Category[];
}

export interface CategoryResponse {
    message: string;
    data: Category;
}
  