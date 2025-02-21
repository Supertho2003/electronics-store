export interface ApiResponse<T> {
    data: T;
    message: string;
  }
  
  export interface Attribute {
    id: number;
    attributeName: string;
    values: AttributeValue[];
  }

  export interface AttributeProduct {
    attributeId: number; 
    name: string;       
    values: string[];  
}
  
  export interface AttributeValue {
    id: number;
    value: string;
  }
  
  export interface AttributesResponse {
    message: string;
    data: Attribute[];
  }
  
  export interface AttributeResponse {
    message: string;
    data: Attribute;
  }
  