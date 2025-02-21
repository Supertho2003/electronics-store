package dev.com.shop_backend.service.attribute;

import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.dto.response.AttributeResponse;
import dev.com.shop_backend.model.Attribute;

import java.util.List;

public interface IAttributeService {
    void addAttribute(AddAttributeRequest request);

    List<AttributeResponse> getAllAttributes();

    boolean attributeExists(String name);

    void deleteAttribute(Long id);

    void updateAttribute(Long id, AddAttributeRequest request);

    AttributeResponse getAttributeById(Long id);

    List<Attribute> getAllAttributesWithoutValues();
}
