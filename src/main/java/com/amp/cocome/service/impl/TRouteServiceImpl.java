package com.amp.cocome.service.impl;

import com.amp.cocome.service.TRouteService;
import com.amp.cocome.domain.TRoute;
import com.amp.cocome.repository.TRouteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing TRoute.
 */
@Service
@Transactional
public class TRouteServiceImpl implements TRouteService {

    private final Logger log = LoggerFactory.getLogger(TRouteServiceImpl.class);

    private final TRouteRepository tRouteRepository;

    public TRouteServiceImpl(TRouteRepository tRouteRepository) {
        this.tRouteRepository = tRouteRepository;
    }

    /**
     * Save a tRoute.
     *
     * @param tRoute the entity to save
     * @return the persisted entity
     */
    @Override
    public TRoute save(TRoute tRoute) {
        log.debug("Request to save TRoute : {}", tRoute);
        return tRouteRepository.save(tRoute);
    }

    /**
     * Get all the tRoutes.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<TRoute> findAll(Pageable pageable) {
        log.debug("Request to get all TRoutes");
        return tRouteRepository.findAll(pageable);
    }


    /**
     * Get one tRoute by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TRoute> findOne(Long id) {
        log.debug("Request to get TRoute : {}", id);
        return tRouteRepository.findById(id);
    }

    /**
     * Delete the tRoute by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete TRoute : {}", id);
        tRouteRepository.deleteById(id);
    }
}
