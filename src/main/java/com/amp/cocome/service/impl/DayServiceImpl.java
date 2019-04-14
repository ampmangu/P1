package com.amp.cocome.service.impl;

import com.amp.cocome.service.DayService;
import com.amp.cocome.domain.Day;
import com.amp.cocome.repository.DayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing Day.
 */
@Service
@Transactional
public class DayServiceImpl implements DayService {

    private final Logger log = LoggerFactory.getLogger(DayServiceImpl.class);

    private final DayRepository dayRepository;

    public DayServiceImpl(DayRepository dayRepository) {
        this.dayRepository = dayRepository;
    }

    /**
     * Save a day.
     *
     * @param day the entity to save
     * @return the persisted entity
     */
    @Override
    public Day save(Day day) {
        log.debug("Request to save Day : {}", day);
        return dayRepository.save(day);
    }

    /**
     * Get all the days.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Day> findAll(Pageable pageable) {
        log.debug("Request to get all Days");
        return dayRepository.findAll(pageable);
    }


    /**
     * Get one day by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Day> findOne(Long id) {
        log.debug("Request to get Day : {}", id);
        return dayRepository.findById(id);
    }

    /**
     * Delete the day by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Day : {}", id);
        dayRepository.deleteById(id);
    }
}
