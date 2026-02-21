package com.jc.healthcare.service;

import com.jc.healthcare.dto.*;
import com.jc.healthcare.model.Hospital;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface HospitalService {

    Hospital create(Hospital hospital);

    Hospital createWithImages(String hospitalJson, MultipartFile[] images) throws IOException;

    Hospital createWithFiles(
            String hospitalJson,
            MultipartFile[] images,
            MultipartFile[] documents
    ) throws IOException;

    Hospital update(Long id, Hospital hospital);

    Hospital get(Long id);

    Hospital getByCode(String code);

    List<Hospital> getAll();

    void delete(Long id);

    Hospital partialUpdateById(Long id, Map<String, Object> updates);

    Hospital partialUpdateByCode(String code, Map<String, Object> updates);

    Hospital updateOnlyDocuments(Long id, MultipartFile[] documents);

    Hospital updateOnlyImages(Long id, MultipartFile[] images);

    Hospital updateOnlyPassbook(Long id, MultipartFile passbookImage);

    Hospital updateDocumentsAndImages(
            Long id,
            MultipartFile[] documents,
            MultipartFile[] images
    );

    Hospital updateVerificationLevel(Long id, String newLevel);

    // -------- APIs --------
    List<OrganizationLightDTO> getLightData(String type, String level);

    LocationDTO getLocation(Long id);

    List<NearbyOrganization> findNearby(
            Double latitude,
            Double longitude,
            Double radius,
            String type
    );

    Page<HospitalListDTO> getHospitals(
            String type,
            int page,
            int size,
            String sort
    );

    Page<HospitalListDTO> getHospitalPage(int page, int size);
}
