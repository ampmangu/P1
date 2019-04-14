package com.amp.cocome.service.impl;

import com.amp.cocome.service.PointInterestService;
import com.amp.cocome.domain.PointInterest;
import com.amp.cocome.repository.PointInterestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing PointInterest.
 */
@Service
@Transactional
public class PointInterestServiceImpl implements PointInterestService {

    private final Logger log = LoggerFactory.getLogger(PointInterestServiceImpl.class);

    private final PointInterestRepository pointInterestRepository;

    public PointInterestServiceImpl(PointInterestRepository pointInterestRepository) {
        this.pointInterestRepository = pointInterestRepository;
    }

    /**
     * Save a pointInterest.
     *
     * @param pointInterest the entity to save
     * @return the persisted entity
     */
    @Override
    public PointInterest save(PointInterest pointInterest) {
        log.debug("Request to save PointInterest : {}", pointInterest);
        return pointInterestRepository.save(pointInterest);
    }

    /**
     * Get all the pointInterests.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<PointInterest> findAll(Pageable pageable) {
        log.debug("Request to get all PointInterests");
        return pointInterestRepository.findAll(pageable);
    }


    /**
     * Get one pointInterest by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PointInterest> findOne(Long id) {
        log.debug("Request to get PointInterest : {}", id);
        return pointInterestRepository.findById(id);
    }

    /**
     * Delete the pointInterest by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete PointInterest : {}", id);
        pointInterestRepository.deleteById(id);
    }
}
