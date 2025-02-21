package dev.com.shop_backend.service.attribute;

import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.dto.response.AttributeResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.AttributeMapper;
import dev.com.shop_backend.model.Attribute;
import dev.com.shop_backend.model.AttributeValue;
import dev.com.shop_backend.repository.AttributeRepository;
import dev.com.shop_backend.repository.AttributeValueRepository;
import dev.com.shop_backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AttributeService implements IAttributeService{
    AttributeRepository attributeRepository;
    AttributeValueRepository attributeValueRepository;
    AttributeMapper attributeMapper;

    @Transactional
    @Override
    public void addAttribute(AddAttributeRequest request) {
        if (attributeExists(request.getAttributeName())) {
            throw new AlreadyExistsException("Thuộc tính đã tồn tại");
        }

        Attribute attribute = new Attribute();
        attribute.setAttributeName(request.getAttributeName());

        List<AttributeValue> attributeValues = new ArrayList<>();
        for (String value : request.getValues()) {
            AttributeValue attributeValue = new AttributeValue();
            attributeValue.setValue(value);
            attributeValue.setAttribute(attribute);
            attributeValues.add(attributeValue);
        }
        attribute.setValues(attributeValues);
        attributeRepository.save(attribute);
    }

    @Override
    public void deleteAttribute(Long id) {
        Attribute attribute = attributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thuộc tính không tồn tại"));

        if (!attribute.getValues().isEmpty()) {
            attributeValueRepository.deleteAll(attribute.getValues());
        }
        attributeRepository.deleteById(id);
    }

    @Override
    public AttributeResponse getAttributeById(Long id) {
        Attribute attribute = attributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thuộc tính không tìm thấy"));
        return new AttributeResponse(
                attribute.getId(),
                attribute.getAttributeName(),
                convertValuesToList(attribute.getValues())
        );
    }

    private List<String> convertValuesToList(List<AttributeValue> values) {
        List<String> result = new ArrayList<>();
        for (AttributeValue value : values) {
            result.add(value.getValue());
        }
        return result;
    }

    @Override
    public List<AttributeResponse> getAllAttributes() {
        List<Attribute> attributes = attributeRepository.findAll();
        return attributeMapper.toAttributeResponses(attributes);
    }

    @Transactional
    @Override
    public void updateAttribute(Long id, AddAttributeRequest request) {
        Attribute attribute = attributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thuộc tính không tìm thấy"));
        if (!attribute.getAttributeName().equals(request.getAttributeName()) && attributeExists(request.getAttributeName())) {
            throw new AlreadyExistsException("Thuộc tính đã tồn tại");
        }
        attribute.setAttributeName(request.getAttributeName());
        List<AttributeValue> updatedValues = new ArrayList<>();
        for (String value : request.getValues()) {
            boolean exists = attribute.getValues().stream()
                    .anyMatch(attributeValue -> attributeValue.getValue().equals(value.trim()));
            if (!exists) {
                AttributeValue attributeValue = new AttributeValue();
                attributeValue.setValue(value.trim());
                attributeValue.setAttribute(attribute);
                updatedValues.add(attributeValue);
            }
        }
        attribute.getValues().removeIf(attributeValue -> !request.getValues().contains(attributeValue.getValue()));
        attribute.getValues().addAll(updatedValues);
        attributeRepository.save(attribute);
    }

    @Override
    public boolean attributeExists(String attributeName) {
        return attributeRepository.existsByattributeName(attributeName);
    }

    @Override
    public List<Attribute> getAllAttributesWithoutValues() {
        return attributeRepository.findAll();
    }
}
