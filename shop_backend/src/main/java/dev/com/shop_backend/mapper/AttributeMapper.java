package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.dto.response.AttributeResponse;
import dev.com.shop_backend.model.Attribute;
import dev.com.shop_backend.model.AttributeValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AttributeMapper {
    @Mapping(source = "values", target = "values")
    Attribute toAttribute(AddAttributeRequest request);

    @Mapping(source = "values", target = "values")
    @Mapping(target = "attributeName", source = "attributeName")
    AttributeResponse toAttributeResponse(Attribute attribute);

    List<AttributeResponse> toAttributeResponses(List<Attribute> attributes);

    default List<String> attributeValuesToStringList(List<AttributeValue> attributeValues) {
        return attributeValues.stream()
                .map(AttributeValue::getValue) // Giả sử "value" là thuộc tính trong AttributeValue
                .collect(Collectors.toList());
    }

    default List<AttributeValue> stringListToAttributeValues(List<String> values) {
        return values.stream()
                .map(value -> {
                    AttributeValue attributeValue = new AttributeValue();
                    attributeValue.setValue(value); // Giả sử bạn muốn set giá trị này
                    return attributeValue;
                })
                .collect(Collectors.toList());
    }
}
