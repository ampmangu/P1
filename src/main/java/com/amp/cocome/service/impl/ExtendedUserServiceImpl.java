package com.amp.cocome.service.impl;

import com.amp.cocome.service.ExtendedUserService;
import com.amp.cocome.domain.ExtendedUser;
import com.amp.cocome.repository.ExtendedUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing ExtendedUser.
 */
@Service
@Transactional
public class ExtendedUserServiceImpl implements ExtendedUserService {

    private final Logger log = LoggerFactory.getLogger(ExtendedUserServiceImpl.class);

    private final ExtendedUserRepository extendedUserRepository;

    public ExtendedUserServiceImpl(ExtendedUserRepository extendedUserRepository) {
        this.extendedUserRepository = extendedUserRepository;
    }

    /**
     * Save a extendedUser.
     *
     * @param extendedUser the entity to save
     * @return the persisted entity
     */
    @Override
    public ExtendedUser save(ExtendedUser extendedUser) {
        log.debug("Request to save ExtendedUser : {}", extendedUser);
        return extendedUserRepository.save(extendedUser);
    }

    /**
     * Get all the extendedUsers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ExtendedUser> findAll() {
        log.debug("Request to get all ExtendedUsers");
        return extendedUserRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the ExtendedUser with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<ExtendedUser> findAllWithEagerRelationships(Pageable pageable) {
        return extendedUserRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one extendedUser by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ExtendedUser> findOne(Long id) {
        log.debug("Request to get ExtendedUser : {}", id);
        return extendedUserRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the extendedUser by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ExtendedUser : {}", id);
        extendedUserRepository.deleteById(id);
    }
}
