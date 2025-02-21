package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.response.AddressResponse;
import dev.com.shop_backend.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    Address toAddress(AddAddressRequest addAddressRequest);
    @Mapping(source = "userName", target = "userName")
    AddressResponse toAddressResponse(Address address);
}
