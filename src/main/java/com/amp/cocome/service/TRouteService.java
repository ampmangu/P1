package com.amp.cocome.service;

import com.amp.cocome.domain.TRoute;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing TRoute.
 */
public interface TRouteService {

    /**
     * Save a tRoute.
     *
     * @param tRoute the entity to save
     * @return the persisted entity
     */
    TRoute save(TRoute tRoute);

    /**
     * Get all the tRoutes.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<TRoute> findAll(Pageable pageable);


    /**
     * Get the "id" tRoute.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<TRoute> findOne(Long id);

    /**
     * Delete the "id" tRoute.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
