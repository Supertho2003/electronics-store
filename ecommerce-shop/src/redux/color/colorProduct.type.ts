export interface colorProduct {
    id: number;
    name: string;
    code: string;
}

export interface ColorsResponse {
    message: string;
    data: colorProduct[];
}

export interface ColorResponse {
    message: string;
    data: colorProduct;
  }
  