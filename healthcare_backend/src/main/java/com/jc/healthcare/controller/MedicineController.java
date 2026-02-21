package com.jc.healthcare.controller;

import com.jc.healthcare.dto.MedicineReviewRequest;
import com.jc.healthcare.model.Medicine;
import com.jc.healthcare.model.MedicineReview;
import com.jc.healthcare.service.MedicineService;
import java.util.Map;

import org.springframework.data.domain.Page;   

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;
    

    /*--------------------------------------------------------------
     *           GET ALL MEDICINES FOR ORGANIZATION
     *--------------------------------------------------------------*/
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<Medicine>> getMedicinesByOrganization(
            @PathVariable Long organizationId) {

        return ResponseEntity.ok(
                medicineService.getMedicinesByOrganization(organizationId)
        );
    }

    /*--------------------------------------------------------------
     *            GET MEDICINE BY ID (ORG-SAFE)
     *--------------------------------------------------------------*/
    @GetMapping("/{id}/organization/{organizationId}")
    public ResponseEntity<Medicine> getByIdForOrg(
            @PathVariable Long id,
            @PathVariable Long organizationId) {

        return ResponseEntity.ok(
                medicineService.getMedicineByIdForOrg(id, organizationId)
        );
    }
    @GetMapping("/organization/{organizationId}/list")
    public ResponseEntity<Map<String, Object>> getMedicinesListLightweight(
            @PathVariable Long organizationId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "medicineName") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction
    ) {

        var pageResult = medicineService.getMedicinesListLightweight(
                organizationId, page, size, sortBy, direction, q
        );

        // prepare response metadata
        Map<String, Object> resp = Map.of(
                "content", pageResult.getContent(),
                "page", page,
                "size", size,
                "totalElements", pageResult.getTotalElements(),
                "totalPages", pageResult.getTotalPages()
        );

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}/organization/{organizationId}/details")
    public ResponseEntity<Map<String, Object>> getMedicineDetails(
            @PathVariable Long id,
            @PathVariable Long organizationId
    ) {
        Map<String, Object> details = medicineService.getMedicineDetails(id, organizationId);
        return ResponseEntity.ok(details);
    }



    /*--------------------------------------------------------------
     *              UPDATE (ORG-SAFE)
     *--------------------------------------------------------------*/
    @PatchMapping(
            value = "/{id}/organization/{organizationId}",
            consumes = {"multipart/form-data"}
    )
    public ResponseEntity<Medicine> updateForOrg(
            @PathVariable Long id,
            @PathVariable Long organizationId,
            @RequestPart(required = false) Medicine updated,
            @RequestPart(required = false) MultipartFile image,
            @RequestParam(required = false) Boolean removeImage
    ) {
        return ResponseEntity.ok(
                medicineService.updateMedicineForOrg(
                        id, organizationId, updated, image, removeImage
                )
        );
    }


    /*--------------------------------------------------------------
     *              DELETE (ORG-SAFE)
     *--------------------------------------------------------------*/
    @DeleteMapping("/{id}/organization/{organizationId}")
    public ResponseEntity<String> deleteForOrg(
            @PathVariable Long id,
            @PathVariable Long organizationId) {

        medicineService.deleteMedicineForOrg(id, organizationId);
        return ResponseEntity.ok("Deleted successfully");
    }

    /*--------------------------------------------------------------
     *              GET OUT OF STOCK (ORG)
     *--------------------------------------------------------------*/
    @GetMapping("/out-of-stock/{organizationId}")
    public ResponseEntity<List<Medicine>> getOutOfStock(
            @PathVariable Long organizationId) {

        return ResponseEntity.ok(
                medicineService.getOutOfStockMedicines(organizationId)
        );
    }

    /*--------------------------------------------------------------
     *              GET EXPIRED (ORG)
     *--------------------------------------------------------------*/
    @GetMapping("/expired/{organizationId}")
    public ResponseEntity<List<Medicine>> getExpired(
            @PathVariable Long organizationId) {

        return ResponseEntity.ok(
                medicineService.getExpiredMedicines(organizationId)
        );
    }

    /*--------------------------------------------------------------
     *              EXCEL UPLOAD
     *--------------------------------------------------------------*/
    @PostMapping("/upload")
    public ResponseEntity<String> uploadExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long personId,
            @RequestParam Long organizationId,
            @RequestParam Long supplierId
    ) {
        medicineService.uploadExcel(file, personId, organizationId, supplierId);
        return ResponseEntity.ok("Excel processed successfully");
    }
    
    @PostMapping("/{medicineId}/reviews")
    public ResponseEntity<MedicineReview> addReview(
            @PathVariable Long medicineId,
            @RequestBody MedicineReviewRequest req
    ) {
        return ResponseEntity.ok(
                medicineService.addReview(
                        medicineId,
                        req.getUserId(),
                        req.getRating(),
                        req.getComment()
                )
        );
    }


    @GetMapping("/{medicineId}/reviews")
    public ResponseEntity<List<MedicineReview>> getReviews(
            @PathVariable Long medicineId
    ) {
        return ResponseEntity.ok(
                medicineService.getReviews(medicineId)
        );
    }

    @GetMapping("/{medicineId}/rating-summary")
    public ResponseEntity<Map<String, Object>> getRatingSummary(
            @PathVariable Long medicineId
    ) {
        return ResponseEntity.ok(
                medicineService.getRatingSummary(medicineId)
        );
    }

    @GetMapping("/global")
    public Page<Map<String, Object>> getGlobalMedicines(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction,
            @RequestParam(required = false) String q
    ) {
        return medicineService.getAllMedicinesGlobal(page, size, sortBy, direction, q);
    }

    @GetMapping("/organization/{organizationId}/with-ratings")
    public ResponseEntity<List<Map<String, Object>>> getMedicinesWithRatings(
            @PathVariable Long organizationId
    ) {
        return ResponseEntity.ok(
                medicineService.getMedicinesWithRatingsByOrganization(organizationId)
        );
    }
    @GetMapping("/{medicineId}/organization/{orgId}/basic")
    public ResponseEntity<Map<String, Object>> getBasicMedicineDetails(
            @PathVariable Long medicineId,
            @PathVariable Long orgId
    ) {
        return ResponseEntity.ok(
                medicineService.getBasicMedicineDetails(medicineId, orgId)
        );
    }


}

