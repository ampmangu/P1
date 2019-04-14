package com.amp.cocome.service;

import com.amp.cocome.domain.PointInterest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing PointInterest.
 */
public interface PointInterestService {

    /**
     * Save a pointInterest.
     *
     * @param pointInterest the entity to save
     * @return the persisted entity
     */
    PointInterest save(PointInterest pointInterest);

    /**
     * Get all the pointInterests.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<PointInterest> findAll(Pageable pageable);


    /**
     * Get the "id" pointInterest.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<PointInterest> findOne(Long id);

    /**
     * Delete the "id" pointInterest.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
