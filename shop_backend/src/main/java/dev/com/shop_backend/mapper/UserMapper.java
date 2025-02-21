package dev.com.shop_backend.mapper;


import dev.com.shop_backend.dto.request.AddUserRequest;
import dev.com.shop_backend.dto.response.UserResponse;
import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.model.Role;
import dev.com.shop_backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",uses = AddressMapper.class)
public interface UserMapper {
    User toUser(AddUserRequest request);
    @Mapping(source = "roles", target = "roles")
    @Mapping(source = "addresses", target = "addresses")
    UserResponse toUserResponse(User user);

    default List<String> mapRolesToNames(Collection<Role> roles) {
        return roles.stream().map(role -> role.getName().name()).collect(Collectors.toList());
    }
}
