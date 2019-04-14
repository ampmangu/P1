package com.amp.cocome.service;

import com.amp.cocome.domain.Day;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Day.
 */
public interface DayService {

    /**
     * Save a day.
     *
     * @param day the entity to save
     * @return the persisted entity
     */
    Day save(Day day);

    /**
     * Get all the days.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Day> findAll(Pageable pageable);


    /**
     * Get the "id" day.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Day> findOne(Long id);

    /**
     * Delete the "id" day.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
