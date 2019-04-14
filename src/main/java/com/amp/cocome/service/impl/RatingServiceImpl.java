package com.amp.cocome.service.impl;

import com.amp.cocome.service.RatingService;
import com.amp.cocome.domain.Rating;
import com.amp.cocome.repository.RatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Rating.
 */
@Service
@Transactional
public class RatingServiceImpl implements RatingService {

    private final Logger log = LoggerFactory.getLogger(RatingServiceImpl.class);

    private final RatingRepository ratingRepository;

    public RatingServiceImpl(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    /**
     * Save a rating.
     *
     * @param rating the entity to save
     * @return the persisted entity
     */
    @Override
    public Rating save(Rating rating) {
        log.debug("Request to save Rating : {}", rating);
        return ratingRepository.save(rating);
    }

    /**
     * Get all the ratings.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Rating> findAll() {
        log.debug("Request to get all Ratings");
        return ratingRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the Rating with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Rating> findAllWithEagerRelationships(Pageable pageable) {
        return ratingRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one rating by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Rating> findOne(Long id) {
        log.debug("Request to get Rating : {}", id);
        return ratingRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the rating by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Rating : {}", id);
        ratingRepository.deleteById(id);
    }
}
