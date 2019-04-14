package com.amp.cocome.repository;

import com.amp.cocome.domain.PointInterest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PointInterest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointInterestRepository extends JpaRepository<PointInterest, Long> {

}
