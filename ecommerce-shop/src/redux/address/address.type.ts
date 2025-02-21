export interface AddAddressRequest {
    id?: number;
    userName: string;
    streetAddress: string; 
    province: string;       
    district: string;      
    ward: string;          
    mobile: string;         
}

export interface ColorsResponse {
    message: string;
    data: AddAddressRequest[];
}

export interface AddressResponse {
    message: string;
    data: AddAddressRequest;
  }
  