package com.jc.healthcare.repository;

import com.jc.healthcare.model.Medicine;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByOrganizationId(Long orgId);

    Optional<Medicine> findByIdAndOrganizationId(Long id, Long orgId);

    // Excel duplicate check
    Optional<Medicine> findByMedicineNameAndCategoryAndBatchNoAndPersonIdAndOrganizationId(
            String name, String category, String batch, Long personId, Long orgId);

    // Out of stock
    List<Medicine> findByOrganizationIdAndQuantityAvailableLessThanEqual(Long orgId, Integer qty);

    // Expired
    List<Medicine> findByOrganizationIdAndExpiryDateBefore(Long orgId, Date date);

    // Lightweight list
   

        // Correct version – Spring Data handles ORDER BY automatically using Pageable.sort
    Page<Medicine> findByOrganizationId(Long orgId, Pageable pageable);

       
    @Query("""
            SELECT m FROM Medicine m
            WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(m.category) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    Page<Medicine> globalSearch(String q, Pageable pageable);
    
    @Query("SELECT m FROM Medicine m WHERE " +
    	       "LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
    	       "LOWER(m.category) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
    	       "LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :q, '%'))")
    	Page<Medicine> searchGlobal(String q, Pageable pageable);


    // Search
    @Query("SELECT m FROM Medicine m " +
            "WHERE m.organizationId = :orgId " +
            "AND (LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(m.category) LIKE LOWER(CONCAT('%', :q, '%')) " +
            "OR LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :q, '%'))) ")
    Page<Medicine> searchByOrganization(Long orgId, String q, Pageable pageable);

    // Reviews
    @Query(value = """
    	    SELECT REVIEW_ID, MEDICINE_ID, RATING, REVIEW_TEXT, CREATED_ON
    	    FROM MEDICINE_REVIEWS
    	    WHERE MEDICINE_ID = :id
    	    ORDER BY CREATED_ON DESC
    	    FETCH FIRST 10 ROWS ONLY
    	""", nativeQuery = true)
    List<Object[]> findReviews(@Param("id") Long id);

    // Rating summary
    @Query(value = """
    	    SELECT NVL(AVG(RATING),0), COUNT(*)
    	    FROM MEDICINE_REVIEWS
    	    WHERE MEDICINE_ID = :id
    	""", nativeQuery = true)
    	Object[] getRatingSummary(@Param("id") Long id);



    // Sold info
    @Query(value = "SELECT SUM(oi.qty), COUNT(DISTINCT oi.order_id) " +
                   "FROM CUSTOMER_ORDER_ITEMS oi WHERE oi.medicine_id = :id",
            nativeQuery = true)
    Object[] getSoldInfo(Long id);

    // Similar products
    @Query(value = """
    		SELECT *
    		FROM (
    		   SELECT * FROM MEDICINE
    		   WHERE ORGANIZATION_ID = :orgId
    		     AND CATEGORY = :category
    		     AND MEDICINE_ID <> :id
    		   ORDER BY CREATED_AT DESC
    		)
    		FETCH FIRST 5 ROWS ONLY
    		""", nativeQuery = true)
    		List<Medicine> getSimilarMedicines(
    		        @Param("orgId") Long orgId,
    		        @Param("category") String category,
    		        @Param("id") Long id
    		);

    
    
    
}
