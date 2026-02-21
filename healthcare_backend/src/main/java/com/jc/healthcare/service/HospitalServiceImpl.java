package com.jc.healthcare.service;

import com.cloudinary.Cloudinary;
import com.google.gson.Gson;
import com.jc.healthcare.dto.*;
import com.jc.healthcare.model.Hospital;
import com.jc.healthcare.repository.HospitalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository repository;

    @Autowired
    private Cloudinary cloudinary;

    public HospitalServiceImpl(HospitalRepository repository) {
        this.repository = repository;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public Hospital create(Hospital hospital) {
        return repository.save(hospital);
    }

    @Override
    public Hospital createWithFiles(
            String hospitalJson,
            MultipartFile[] images,
            MultipartFile[] documents
    ) throws IOException {

        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(hospitalJson, Map.class);

        map.put("departments", toJsonArray(map.get("departments")));
        map.put("services", toJsonArray(map.get("services")));
        map.put("facilities", toJsonArray(map.get("facilities")));

        Hospital hospital = gson.fromJson(gson.toJson(map), Hospital.class);

        if (images != null && images.length > 0) {
            hospital.setImages(uploadMultipleFiles(images, "hospitals/images"));
        }

        if (documents != null && documents.length > 0) {
            hospital.setDocuments(uploadMultipleFiles(documents, "hospitals/documents"));
        }

        return repository.save(hospital);
    }

    @Override
    public Hospital createWithImages(String hospitalJson, MultipartFile[] images)
            throws IOException {

        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(hospitalJson, Map.class);

        map.put("departments", toJsonArray(map.get("departments")));
        map.put("services", toJsonArray(map.get("services")));
        map.put("facilities", toJsonArray(map.get("facilities")));

        Hospital hospital = gson.fromJson(gson.toJson(map), Hospital.class);

        if (images != null && images.length > 0) {
            hospital.setImages(uploadMultipleFiles(images, "hospitals/images"));
        }

        return repository.save(hospital);
    }

    // =========================================================
    // GET
    // =========================================================

    @Override
    public Hospital get(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    @Override
    public Hospital getByCode(String code) {
        return repository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    @Override
    public List<Hospital> getAll() {
        return repository.findAll();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public Hospital update(Long id, Hospital newData) {
        Hospital old = get(id);
        newData.setId(old.getId());
        return repository.save(newData);
    }

    @Override
    public Hospital partialUpdateById(Long id, Map<String, Object> updates) {
        return applyPatch(get(id), updates);
    }

    @Override
    public Hospital partialUpdateByCode(String code, Map<String, Object> updates) {
        return applyPatch(getByCode(code), updates);
    }

    private Hospital applyPatch(Hospital hospital, Map<String, Object> updates) {

        updates.forEach((key, value) -> {
            try {
                Field field = Hospital.class.getDeclaredField(key);
                field.setAccessible(true);

                if ("departments".equals(key)
                        || "services".equals(key)
                        || "facilities".equals(key)) {
                    field.set(hospital, convertToJsonArray(value));
                } else {
                    field.set(hospital, value);
                }

            } catch (Exception e) {
                throw new RuntimeException("Invalid field: " + key);
            }
        });

        return repository.save(hospital);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // =========================================================
    // FILE UPDATES
    // =========================================================

    @Override
    public Hospital updateOnlyDocuments(Long id, MultipartFile[] documents) {
        Hospital hospital = get(id);

        if (documents != null && documents.length > 0) {
            hospital.setDocuments(uploadMultipleFiles(documents, "hospitals/documents"));
        }

        return repository.save(hospital);
    }

    @Override
    public Hospital updateOnlyImages(Long id, MultipartFile[] images) {
        Hospital hospital = get(id);

        if (images != null && images.length > 0) {
            hospital.setImages(uploadMultipleFiles(images, "hospitals/images"));
        }

        return repository.save(hospital);
    }

    @Override
    public Hospital updateOnlyPassbook(Long id, MultipartFile passbookImage) {
        Hospital hospital = get(id);

        String url = uploadSingleFile(passbookImage, "hospitals/passbooks");
        hospital.setPassbookImage(new Gson().toJson(Map.of("url", url)));

        return repository.save(hospital);
    }

    @Override
    public Hospital updateDocumentsAndImages(
            Long id,
            MultipartFile[] documents,
            MultipartFile[] images
    ) {
        Hospital hospital = get(id);

        if (documents != null && documents.length > 0) {
            hospital.setDocuments(uploadMultipleFiles(documents, "hospitals/documents"));
        }

        if (images != null && images.length > 0) {
            hospital.setImages(uploadMultipleFiles(images, "hospitals/images"));
        }

        return repository.save(hospital);
    }

    // =========================================================
    // VERIFICATION
    // =========================================================
 // =========================================================
 // PAGINATED LIST BY TYPE (LIGHT LIST – NO IMAGES)
 // =========================================================
 @Override
 public Page<HospitalListDTO> getHospitals(
         String type,
         int page,
         int size,
         String sort
 ) {

     // Safety default
     if (sort == null || !sort.contains(",")) {
         sort = "rating,desc";
     }

     String[] sortArr = sort.split(",");

     Sort.Direction direction =
             sortArr[1].equalsIgnoreCase("desc")
                     ? Sort.Direction.DESC
                     : Sort.Direction.ASC;

     Pageable pageable = PageRequest.of(
             page,
             size,
             Sort.by(direction, sortArr[0])
     );

     // We already filter Approved + Hospital in repository
     return repository.findHospitalPage(pageable);
 }

    @Override
    public Hospital updateVerificationLevel(Long id, String newLevel) {
        Hospital hospital = get(id);
        hospital.setVerificationLevel(newLevel);

        if ("2".equals(newLevel)) {
            hospital.setStatus("Approved");
        }

        return repository.save(hospital);
    }

    // =========================================================
    // LIGHT / LOCATION / NEARBY
    // =========================================================

    @Override
    public List<OrganizationLightDTO> getLightData(String type, String level) {
        return repository.getLightData(type, level);
    }

    @Override
    public LocationDTO getLocation(Long id) {
        Hospital h = get(id);

        if (h.getLatitude() == null || h.getLongitude() == null) {
            throw new RuntimeException("Location not available");
        }

        String mapUrl =
                "https://www.google.com/maps?q=" +
                        h.getLatitude() + "," + h.getLongitude();

        return new LocationDTO(
                h.getId(),
                h.getLatitude(),
                h.getLongitude(),
                mapUrl
        );
    }

    @Override
    public List<NearbyOrganization> findNearby(
            Double latitude,
            Double longitude,
            Double radius,
            String type
    ) {
        return repository.findNearby(latitude, longitude, radius, type);
    }

    // =========================================================
    // GLOBAL PAGINATION (NO IMAGES)
    // =========================================================

    @Override
    public Page<HospitalListDTO> getHospitalPage(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );
        return repository.findHospitalPage(pageable);
    }

    // =========================================================
    // CLOUDINARY HELPERS
    // =========================================================

    private String uploadSingleFile(MultipartFile file, String folder) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", folder,
                            "resource_type", "auto"
                    )
            );
            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed");
        }
    }

    private String uploadMultipleFiles(MultipartFile[] files, String folder) {
        if (files == null || files.length == 0) {
            return "[]";
        }

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadSingleFile(file, folder));
        }

        return new Gson().toJson(urls);
    }

    // =========================================================
    // JSON HELPERS
    // =========================================================

    private String toJsonArray(Object value) {
        Gson gson = new Gson();
        if (value == null) return "[]";

        if (value instanceof List<?> list) return gson.toJson(list);

        if (value instanceof String str) {
            str = str.trim();
            if (str.startsWith("[") && str.endsWith("]")) return str;
            if (str.contains(",")) return gson.toJson(str.split("\\s*,\\s*"));
            return gson.toJson(List.of(str));
        }

        return gson.toJson(List.of(value.toString()));
    }

    private String convertToJsonArray(Object value) {
        return toJsonArray(value);
    }
}
