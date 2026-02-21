package com.jc.healthcare.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jc.healthcare.model.Medicine;
import com.jc.healthcare.model.MedicineReview;
import com.jc.healthcare.repository.MedicineRepository;
import com.jc.healthcare.repository.MedicineReviewRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.PersistenceContext;
import java.util.*;

@Service
public class MedicineService {
	
	 @Autowired
	    private MedicineReviewRepository reviewRepo;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private Cloudinary cloudinary;

    // ------------------------------------------------------------------
    // BASIC METHODS
    // ------------------------------------------------------------------

    public List<Medicine> getMedicinesByOrganization(Long organizationId) {
        return medicineRepository.findByOrganizationId(organizationId);
    }

    public Medicine getMedicineByIdForOrg(Long id, Long organizationId) {
        return medicineRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new RuntimeException(
                        "Medicine does not belong to this organization"
                ));
    }

    public Medicine updateMedicineForOrg(
            Long id,
            Long organizationId,
            Medicine updated,
            MultipartFile image,
            Boolean removeImage
    ) {

        Medicine existing = getMedicineByIdForOrg(id, organizationId);

        if (updated != null) {
            if (updated.getQuantityAvailable() != null)
                existing.setQuantityAvailable(updated.getQuantityAvailable());

            if (updated.getPricePerUnit() != null)
                existing.setPricePerUnit(updated.getPricePerUnit());

            if (updated.getReorderLevel() != null)
                existing.setReorderLevel(updated.getReorderLevel());

            if (updated.getStatus() != null)
                existing.setStatus(updated.getStatus());
        }

        if (image != null && !image.isEmpty()) {
            existing.setImageUrl(uploadImageToCloudinary(image));
        }

        if (Boolean.TRUE.equals(removeImage)) {
            existing.setImageUrl(null);
        }

        existing.setUpdatedAt(new Date());
        return medicineRepository.save(existing);
    }

    private String uploadImageToCloudinary(MultipartFile file) {

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "medicines",
                            "resource_type", "image"
                    )
            );
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    public void deleteMedicineForOrg(Long id, Long organizationId) {
        Medicine med = getMedicineByIdForOrg(id, organizationId);
        medicineRepository.delete(med);
    }

    public List<Medicine> getExpiredMedicines(Long organizationId) {
        return medicineRepository.findByOrganizationIdAndExpiryDateBefore(
                organizationId, new Date()
        );
    }

    public List<Medicine> getOutOfStockMedicines(Long organizationId) {
        return medicineRepository.findByOrganizationIdAndQuantityAvailableLessThanEqual(
                organizationId, 0
        );
    }

    // ------------------------------------------------------------------
    // Excel Upload
    // ------------------------------------------------------------------

    public void uploadExcel(MultipartFile file, Long personId, Long orgId, Long supplierId) {

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);
                if (row == null) continue;

                String name = getString(row.getCell(0));
                String category = getString(row.getCell(1));
                String batchNo = getString(row.getCell(2));

                Optional<Medicine> opt = medicineRepository
                        .findByMedicineNameAndCategoryAndBatchNoAndPersonIdAndOrganizationId(
                                name, category, batchNo, personId, orgId
                        );

                Medicine med = opt.orElseGet(Medicine::new);

                med.setMedicineName(name);
                med.setCategory(category);
                med.setBatchNo(batchNo);
                med.setManufacturer(getString(row.getCell(3)));
                med.setPricePerUnit(getDouble(row.getCell(4)));
                med.setPurchaseCost(getDouble(row.getCell(5)));
                med.setQuantityAvailable(getInt(row.getCell(6)));
                med.setReorderLevel(getInt(row.getCell(7)));
                med.setExpiryDate(getDate(row.getCell(8)));
                med.setDescription(getString(row.getCell(9)));
                med.setStatus(getString(row.getCell(10)));
                med.setLocationOfRack(getString(row.getCell(11)));

                med.setPersonId(personId);
                med.setOrganizationId(orgId);
                med.setSupplierId(supplierId);

                med.setUpdatedAt(new Date());
                if (med.getCreatedAt() == null) med.setCreatedAt(new Date());

                medicineRepository.save(med);
            }

        } catch (Exception e) {
            throw new RuntimeException("Excel upload failed", e);
        }
    }

    private String getString(Cell cell) {
        if (cell == null) return "";
        return cell.getCellType() == CellType.STRING
                ? cell.getStringCellValue().trim()
                : String.valueOf(cell.getNumericCellValue());
    }

    private Double getDouble(Cell cell) {
        if (cell == null) return 0.0;
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        return Double.valueOf(cell.getStringCellValue().trim());
    }

    private Integer getInt(Cell cell) {
        return getDouble(cell).intValue();
    }

    private Date getDate(Cell cell) {
        try {
            return cell.getCellType() == CellType.NUMERIC
                    ? cell.getDateCellValue()
                    : java.sql.Date.valueOf(cell.getStringCellValue().trim());
        } catch (Exception e) {
            return null;
        }
    }

    // ------------------------------------------------------------------
    // ⭐ PAGINATION + SEARCH (LIGHTWEIGHT LIST)
    // ------------------------------------------------------------------

    public Page<Map<String, Object>> getMedicinesListLightweight(
            Long orgId, Integer page, Integer size,
            String sortBy, String direction, String q) {

        // Allowed fields for sorting
        List<String> allowedSorts = List.of("medicineName", "pricePerUnit", "category", "updatedAt");

        if (sortBy == null || !allowedSorts.contains(sortBy)) {
            sortBy = "medicineName";
        }

        Sort.Direction sortDirection =
                (direction == null || !direction.equalsIgnoreCase("DESC"))
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(
                page == null ? 0 : page,
                size == null ? 20 : size,
                Sort.by(sortDirection, sortBy)
        );

        Page<Medicine> medPage =
                (q != null && !q.isEmpty())
                        ? medicineRepository.searchByOrganization(orgId, q, pageable)
                        : medicineRepository.findByOrganizationId(orgId, pageable);

        List<Map<String, Object>> content = new ArrayList<>();

        for (Medicine m : medPage.getContent()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("medicineName", m.getMedicineName());
            map.put("pricePerUnit", m.getPricePerUnit());
            map.put("category", m.getCategory());
            map.put("imageUrl", m.getImageUrl());
            content.add(map);
        }

        return new PageImpl<>(content, pageable, medPage.getTotalElements());
    }
    
    // ------------------------------------------------------------------
    // ⭐ FULL DETAILS (NO SQL IN SERVICE)
    // ------------------------------------------------------------------
 // ⭐ PARTICULAR MEDICINE DETAILS (NO SOLD INFO)
    public Map<String, Object> getMedicineDetails(Long id, Long orgId) {

        Medicine med = getMedicineByIdForOrg(id, orgId);

        Map<String, Object> result = new HashMap<>();
        result.put("medicine", med);

        // ⭐ Rating summary
        Object[] ratingData = medicineRepository.getRatingSummary(id);

        Double avgRating = 0.0;
        Long ratingCount = 0L;

        if (ratingData != null) {
            if (ratingData.length > 0 && ratingData[0] instanceof Number) {
                avgRating = ((Number) ratingData[0]).doubleValue();
            }
            if (ratingData.length > 1 && ratingData[1] instanceof Number) {
                ratingCount = ((Number) ratingData[1]).longValue();
            }
        }

        result.put("avgRating", avgRating);
        result.put("ratingCount", ratingCount);

        // ⭐ Reviews (CLOB SAFE)
        List<Object[]> rawReviews = medicineRepository.findReviews(id);
        List<Map<String, Object>> reviews = new ArrayList<>();

        for (Object[] r : rawReviews) {
            Map<String, Object> review = new HashMap<>();
            review.put("reviewId", r[0]);
            review.put("medicineId", r[1]);
            review.put("rating", r[2]);
            review.put("comment", clobToString(r[3])); // ✅ FIX HERE
            review.put("createdAt", r[4]);
            reviews.add(review);
        }

        result.put("reviews", reviews);

        // ⭐ Similar medicines
        List<Medicine> similar = medicineRepository.getSimilarMedicines(
                orgId, med.getCategory(), id
        );
        result.put("similarMedicines", similar);

        return result;
    }


    public MedicineReview addReview(Long medicineId, Long userId, Integer rating, String comment) {
        MedicineReview r = new MedicineReview();
        r.setMedicineId(medicineId);
        r.setUserId(userId);
        r.setRating(rating);
        r.setComment(comment);
        r.setCreatedAt(new Date());
        return reviewRepo.save(r);
    }

   
    public List<MedicineReview> getReviews(Long medicineId) {
        return reviewRepo.findByMedicineIdOrderByCreatedAtDesc(medicineId);
    }

    // ⭐ Get rating summary
    public Map<String, Object> getRatingSummary(Long medicineId) {
        Object[] data = reviewRepo.getRatingSummary(medicineId);

        Double avg = data[0] == null ? 0.0 : ((Number) data[0]).doubleValue();
        Long count = data[1] == null ? 0L : ((Number) data[1]).longValue();

        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", avg);
        summary.put("totalReviews", count);
        return summary;
    }
    
    public Page<Map<String, Object>> getAllMedicinesGlobal(
            Integer page, Integer size, String sortBy, String direction, String q) {

        String sortField = (sortBy == null || sortBy.isEmpty()) ? "medicineName" : sortBy;
        String sortDirection = (direction == null || direction.isEmpty()) ? "ASC" : direction.toUpperCase();

        Pageable pageable = PageRequest.of(
                page == null ? 0 : page,
                size == null ? 20 : size,
                Sort.by(Sort.Direction.fromString(sortDirection), sortField)
        );

        Page<Medicine> medPage =
                (q != null && !q.isEmpty())
                        ? medicineRepository.searchGlobal(q, pageable)
                        : medicineRepository.findAll(pageable);

        List<Map<String,Object>> content = new ArrayList<>();

        for (Medicine m : medPage.getContent()) {
            Map<String,Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("medicineName", m.getMedicineName());
            map.put("category", m.getCategory());
            map.put("pricePerUnit", m.getPricePerUnit());
            map.put("imageUrl", m.getImageUrl());
            map.put("organizationId", m.getOrganizationId());
            content.add(map);
        }

        return new PageImpl<>(content, pageable, medPage.getTotalElements());
    }
    public List<Map<String, Object>> getMedicinesWithRatingsByOrganization(Long orgId) {

        List<Medicine> medicines = medicineRepository.findByOrganizationId(orgId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Medicine m : medicines) {

            Object result = reviewRepo.getRatingSummary(m.getId());

            Double avgRating = 0.0;
            Long totalReviews = 0L;

            if (result instanceof Object[]) {
                Object[] arr = (Object[]) result;

                if (arr.length > 0 && arr[0] instanceof Number) {
                    avgRating = ((Number) arr[0]).doubleValue();
                }

                if (arr.length > 1 && arr[1] instanceof Number) {
                    totalReviews = ((Number) arr[1]).longValue();
                }
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("medicineName", m.getMedicineName());
            map.put("category", m.getCategory());
            map.put("pricePerUnit", m.getPricePerUnit());
            map.put("quantityAvailable", m.getQuantityAvailable());
            map.put("imageUrl", m.getImageUrl());

            map.put("averageRating", avgRating);
            map.put("totalReviews", totalReviews);

            response.add(map);
        }

        return response;
    }

    private String clobToString(Object clob) {
        if (clob == null) return null;

        if (clob instanceof String) {
            return (String) clob;
        }

        try {
            java.sql.Clob c = (java.sql.Clob) clob;
            return c.getSubString(1, (int) c.length());
        } catch (Exception e) {
            return null;
        }
    }
    public Map<String, Object> getBasicMedicineDetails(Long id, Long orgId) {

        Medicine medicine = getMedicineByIdForOrg(id, orgId);

        Map<String, Object> response = new HashMap<>();
        response.put("medicine", medicine);

        // ⭐ Rating summary
        Object[] ratingData = reviewRepo.getRatingSummary(id);

        Double avgRating = 0.0;
        Long ratingCount = 0L;

        if (ratingData != null) {
            if (ratingData.length > 0 && ratingData[0] instanceof Number) {
                avgRating = ((Number) ratingData[0]).doubleValue();
            }
            if (ratingData.length > 1 && ratingData[1] instanceof Number) {
                ratingCount = ((Number) ratingData[1]).longValue();
            }
        }

        response.put("avgRating", avgRating);
        response.put("ratingCount", ratingCount);

        // ⭐ Reviews with REVIEW_TEXT (SAFE)
        List<MedicineReview> reviewEntities =
                reviewRepo.findByMedicineIdOrderByCreatedAtDesc(id);

        List<Map<String, Object>> reviews = new ArrayList<>();

        for (MedicineReview r : reviewEntities) {
            Map<String, Object> map = new HashMap<>();
            map.put("reviewId", r.getId());
            map.put("medicineId", r.getMedicineId());
            map.put("rating", r.getRating());
            map.put("comment", r.getComment()); // ✅ REVIEW_TEXT
            map.put("createdAt", r.getCreatedAt());
            reviews.add(map);
        }

        response.put("reviews", reviews);

        return response;
    }

}
