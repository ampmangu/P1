package com.amp.cocome.service;

import com.amp.cocome.domain.Rating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Rating.
 */
public interface RatingService {

    /**
     * Save a rating.
     *
     * @param rating the entity to save
     * @return the persisted entity
     */
    Rating save(Rating rating);

    /**
     * Get all the ratings.
     *
     * @return the list of entities
     */
    List<Rating> findAll();

    /**
     * Get all the Rating with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    Page<Rating> findAllWithEagerRelationships(Pageable pageable);
    
    /**
     * Get the "id" rating.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Rating> findOne(Long id);

    /**
     * Delete the "id" rating.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
