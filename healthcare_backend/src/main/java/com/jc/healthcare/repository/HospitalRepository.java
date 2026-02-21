package com.jc.healthcare.repository;

import com.jc.healthcare.dto.HospitalListDTO;
import com.jc.healthcare.dto.NearbyOrganization;
import com.jc.healthcare.dto.OrganizationLightDTO;
import com.jc.healthcare.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByCode(String code);

    Optional<Hospital> findByOrganizationMail(String email);

    // -------- LIGHT FILTER API
    @Query("""
        SELECT new com.jc.healthcare.dto.OrganizationLightDTO(
            h.id, h.name, h.city, h.code, h.verificationLevel, h.type
        )
        FROM Hospital h
        WHERE h.type = :type
          AND h.verificationLevel = :level
    """)
    List<OrganizationLightDTO> getLightData(String type, String level);

    // -------- NEARBY
    @Query("""
    		SELECT new com.jc.healthcare.dto.NearbyOrganization(
    		    h.id,
    		    h.name,
    		    h.latitude,
    		    h.longitude,
    		    h.city,
    		    h.type,
    		    h.hospital_phone,
    		    h.services,
    		    (
    		      6371 * acos(
    		        cos(radians(:lat)) * cos(radians(h.latitude)) *
    		        cos(radians(h.longitude) - radians(:lng)) +
    		        sin(radians(:lat)) * sin(radians(h.latitude))
    		      )
    		    )
    		)
    		FROM Hospital h
    		WHERE h.latitude IS NOT NULL
    		  AND h.longitude IS NOT NULL
    		  AND h.type = :type
    		  AND (
    		      6371 * acos(
    		        cos(radians(:lat)) * cos(radians(h.latitude)) *
    		        cos(radians(h.longitude) - radians(:lng)) +
    		        sin(radians(:lat)) * sin(radians(h.latitude))
    		      )
    		  ) <= :radius
    		ORDER BY
    		  (
    		      6371 * acos(
    		        cos(radians(:lat)) * cos(radians(h.latitude)) *
    		        cos(radians(h.longitude) - radians(:lng)) +
    		        sin(radians(:lat)) * sin(radians(h.latitude))
    		      )
    		  ) ASC
    		""")
    		List<NearbyOrganization> findNearby(
    		        @Param("lat") Double lat,
    		        @Param("lng") Double lng,
    		        @Param("radius") Double radius,
    		        @Param("type") String type
    		);
    
    @Query("""
            SELECT new com.jc.healthcare.dto.HospitalListDTO(
                h.id,
                h.name,
                h.city,
                h.type,
                COALESCE(h.rating, 0),
                COALESCE(h.rating_count, 0),
                h.latitude,
                h.longitude,
                h.address,
                h.hospital_phone
            )
            FROM Hospital h
            WHERE h.status = 'Approved'
              AND h.type = 'Hospital'
        """)
        Page<HospitalListDTO> findHospitalPage(Pageable pageable);
}