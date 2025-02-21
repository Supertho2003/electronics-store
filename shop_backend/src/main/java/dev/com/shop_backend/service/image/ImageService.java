package dev.com.shop_backend.service.image;

import com.amazonaws.services.s3.AmazonS3;
import dev.com.shop_backend.dto.response.ImageResponse;
import dev.com.shop_backend.mapper.ImageMapper;
import dev.com.shop_backend.model.Category;
import dev.com.shop_backend.model.Image;
import dev.com.shop_backend.model.Product;
import dev.com.shop_backend.repository.ImageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ImageService implements IImageService{
    @Value("${aws.s3.bucket.name}")
    String bucketName;
    ImageRepository imageRepository;
    ImageMapper imageMapper;
    AmazonS3 s3Client;


    @Override
    public ImageResponse getImageById(Long id) {
        Image image = imageRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy hình ảnh"));
        return imageMapper.toImageResponse(image);
    }

    @Override
    public void deleteImageById(Long id) {

    }

    @Override
    public ImageResponse saveProductImage(Product product, MultipartFile file) {
        return saveImage(product, file, bucketName);
    }

    @Override
    public ImageResponse saveCategoryImage(Category category, MultipartFile file) {
        return saveImage(category, file, bucketName);
    }

    private ImageResponse saveImage(Object entity, MultipartFile file, String bucketName) {
        try {
            String fileName = file.getOriginalFilename();
            s3Client.putObject(bucketName, fileName, file.getInputStream(), null);

            String fileUrl = s3Client.getUrl(bucketName, fileName).toString();

            Image image = new Image();
            image.setFileName(fileName);
            image.setFileType(file.getContentType());
            image.setDownloadUrl(fileUrl);

            if (entity instanceof Category) {
                image.setCategory((Category) entity);
            } else if (entity instanceof Product) {
                image.setProduct((Product) entity);
            }
            imageRepository.save(image);
            return imageMapper.toImageResponse(image);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public Image saveUpdateCategoryImage(Category category, MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            Image existingImage = imageRepository.findByCategoryId(category.getId());
            if (existingImage != null) {
                s3Client.deleteObject(bucketName, existingImage.getFileName());
                existingImage.setFileName(fileName);
                existingImage.setFileType(file.getContentType());
                s3Client.putObject(bucketName, fileName, file.getInputStream(), null);
                existingImage.setDownloadUrl(s3Client.getUrl(bucketName, fileName).toString());
                imageRepository.save(existingImage);
                return existingImage;
            } else {
                s3Client.putObject(bucketName, fileName, file.getInputStream(), null);
                String fileUrl = s3Client.getUrl(bucketName, fileName).toString();
                Image newImage = new Image();
                newImage.setFileName(fileName);
                newImage.setFileType(file.getContentType());
                newImage.setDownloadUrl(fileUrl);
                newImage.setCategory(category);
                imageRepository.save(newImage);
                return newImage;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Image saveUpdateProductImage(Product product, MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            Image existingImage = imageRepository.findByProductId(product.getId());
            if (existingImage != null) {
                s3Client.deleteObject(bucketName, existingImage.getFileName());
                existingImage.setFileName(fileName);
                existingImage.setFileType(file.getContentType());
                s3Client.putObject(bucketName, fileName, file.getInputStream(), null);
                existingImage.setDownloadUrl(s3Client.getUrl(bucketName, fileName).toString());
                imageRepository.save(existingImage);
                return existingImage;
            } else {
                s3Client.putObject(bucketName, fileName, file.getInputStream(), null);
                String fileUrl = s3Client.getUrl(bucketName, fileName).toString();
                Image newImage = new Image();
                newImage.setFileName(fileName);
                newImage.setFileType(file.getContentType());
                newImage.setDownloadUrl(fileUrl);
                newImage.setProduct(product);
                imageRepository.save(newImage);
                return newImage;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }




}
