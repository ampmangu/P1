package com.amp.cocome.service;

import com.amp.cocome.domain.ExtendedUser;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing ExtendedUser.
 */
public interface ExtendedUserService {

    /**
     * Save a extendedUser.
     *
     * @param extendedUser the entity to save
     * @return the persisted entity
     */
    ExtendedUser save(ExtendedUser extendedUser);

    /**
     * Get all the extendedUsers.
     *
     * @return the list of entities
     */
    List<ExtendedUser> findAll();

    /**
     * Get all the ExtendedUser with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    Page<ExtendedUser> findAllWithEagerRelationships(Pageable pageable);
    
    /**
     * Get the "id" extendedUser.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<ExtendedUser> findOne(Long id);

    /**
     * Delete the "id" extendedUser.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
