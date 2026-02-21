package com.jc.healthcare.controller;

import com.jc.healthcare.dto.HospitalListDTO;
import com.jc.healthcare.dto.LocationDTO;
import com.jc.healthcare.dto.NearbyOrganization;
import com.jc.healthcare.dto.OrganizationLightDTO;
import com.jc.healthcare.model.Hospital;
import com.jc.healthcare.model.Staff;
import com.jc.healthcare.repository.StaffRepository;
import com.jc.healthcare.service.HospitalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin("*")
public class HospitalController {

    private final HospitalService service;

    @Autowired
    private StaffRepository staffRepository;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    // =====================================================
    // LIGHT FILTER
    // =====================================================
    @GetMapping("/filter/light")
    public Map<String, Object> getLightData(
            @RequestParam String type,
            @RequestParam String level
    ) {
        List<OrganizationLightDTO> list = service.getLightData(type, level);

        Map<String, Object> response = new HashMap<>();
        response.put("count", list.size());
        response.put("data", list);
        return response;
    }

    // =====================================================
    // LOCATION
    // =====================================================
    @GetMapping("/{id}/location")
    public LocationDTO getLocation(@PathVariable Long id) {
        return service.getLocation(id);
    }

    // =====================================================
    // FULL DETAILS WITH OWNER
    // =====================================================
    @GetMapping("/{id}")
    public Map<String, Object> getHospitalWithOwner(@PathVariable Long id) {

        Hospital hospital = service.get(id);

        List<Staff> owners =
                staffRepository.findByOrganizationIdAndRoleIgnoreCase(id, "owner");

        Staff owner = owners.isEmpty() ? null : owners.get(0);

        Map<String, Object> response = new HashMap<>();
        response.put("hospital", hospital);
        response.put("owner", owner);

        return response;
    }

    // =====================================================
    // CREATE
    // =====================================================
    @PostMapping
    public Hospital create(@RequestBody Hospital hospital) {
        return service.create(hospital);
    }

    @PostMapping(
            value = "/create-with-images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Hospital createWithImages(
            @RequestPart("hospital") String hospitalJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents
    ) throws IOException {
        return service.createWithFiles(hospitalJson, images, documents);
    }

    // =====================================================
    // UPDATE
    // =====================================================
    @PutMapping("/{id}")
    public Hospital update(@PathVariable Long id, @RequestBody Hospital hospital) {
        return service.update(id, hospital);
    }

    @PatchMapping("/{id}")
    public Hospital patchById(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates
    ) {
        return service.partialUpdateById(id, updates);
    }

    @PatchMapping("/code/{code}")
    public Hospital patchByCode(
            @PathVariable String code,
            @RequestBody Map<String, Object> updates
    ) {
        return service.partialUpdateByCode(code, updates);
    }

    @GetMapping("/code/{code}")
    public Hospital getByCode(@PathVariable String code) {
        return service.getByCode(code);
    }

    // =====================================================
    // FILE UPDATES
    // =====================================================
    @PutMapping(
            value = "/{id}/update-documents",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Hospital updateDocuments(
            @PathVariable Long id,
            @RequestPart("documents") MultipartFile[] documents
    ) {
        return service.updateOnlyDocuments(id, documents);
    }

    @PutMapping(
            value = "/{id}/update-images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Hospital updateImages(
            @PathVariable Long id,
            @RequestPart("images") MultipartFile[] images
    ) {
        return service.updateOnlyImages(id, images);
    }

    @PutMapping(
            value = "/{id}/update-passbook",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Hospital updatePassbook(
            @PathVariable Long id,
            @RequestPart("passbook_image") MultipartFile passbookImage
    ) {
        return service.updateOnlyPassbook(id, passbookImage);
    }

    @PutMapping(
            value = "/{id}/update-documents-images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Hospital updateDocumentsAndImages(
            @PathVariable Long id,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        return service.updateDocumentsAndImages(id, documents, images);
    }

    // =====================================================
    // VERIFICATION
    // =====================================================
    @PatchMapping("/{id}/verification")
    public Hospital updateVerificationLevel(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return service.updateVerificationLevel(id, body.get("verification_level"));
    }

    // =====================================================
    // NEARBY
    // =====================================================
    @GetMapping("/nearby")
    public Map<String, Object> findNearbyOrganizations(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5") Double radius,
            @RequestParam String type
    ) {

        List<NearbyOrganization> list =
                service.findNearby(latitude, longitude, radius, type);

        Map<String, Object> response = new HashMap<>();
        response.put("count", list.size());
        response.put("data", list);
        return response;
    }

    // =====================================================
    // GLOBAL PAGINATION (MAIN LIST)
    // =====================================================
    @GetMapping("/page")
    public Map<String, Object> getHospitalsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<HospitalListDTO> result = service.getHospitalPage(page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("page", result.getNumber());
        response.put("size", result.getSize());
        response.put("totalPages", result.getTotalPages());
        response.put("totalElements", result.getTotalElements());
        response.put("data", result.getContent());

        return response;
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Hospital deleted successfully";
    }
}
