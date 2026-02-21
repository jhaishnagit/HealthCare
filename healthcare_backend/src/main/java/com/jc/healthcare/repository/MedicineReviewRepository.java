package com.jc.healthcare.repository;

import com.jc.healthcare.model.MedicineReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MedicineReviewRepository extends JpaRepository<MedicineReview, Long> {

    List<MedicineReview> findByMedicineIdOrderByCreatedAtDesc(Long medicineId);

    @Query(
    	    value = "SELECT NVL(AVG(RATING),0), COUNT(*) FROM MEDICINE_REVIEWS WHERE MEDICINE_ID = :medicineId",
    	    nativeQuery = true
    	)
    	Object[] getRatingSummary(Long medicineId);

}


