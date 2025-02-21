export interface Coupon {
    id: number;
    code: string; 
    discountPercentage: number; 
    expirationDate: string; 
    active: boolean; 
}