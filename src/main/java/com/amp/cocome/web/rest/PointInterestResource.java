package com.amp.cocome.web.rest;
import com.amp.cocome.domain.PointInterest;
import com.amp.cocome.service.PointInterestService;
import com.amp.cocome.web.rest.errors.BadRequestAlertException;
import com.amp.cocome.web.rest.util.HeaderUtil;
import com.amp.cocome.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PointInterest.
 */
@RestController
@RequestMapping("/api")
public class PointInterestResource {

    private final Logger log = LoggerFactory.getLogger(PointInterestResource.class);

    private static final String ENTITY_NAME = "pointInterest";

    private final PointInterestService pointInterestService;

    public PointInterestResource(PointInterestService pointInterestService) {
        this.pointInterestService = pointInterestService;
    }

    /**
     * POST  /point-interests : Create a new pointInterest.
     *
     * @param pointInterest the pointInterest to create
     * @return the ResponseEntity with status 201 (Created) and with body the new pointInterest, or with status 400 (Bad Request) if the pointInterest has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/point-interests")
    public ResponseEntity<PointInterest> createPointInterest(@Valid @RequestBody PointInterest pointInterest) throws URISyntaxException {
        log.debug("REST request to save PointInterest : {}", pointInterest);
        if (pointInterest.getId() != null) {
            throw new BadRequestAlertException("A new pointInterest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PointInterest result = pointInterestService.save(pointInterest);
        return ResponseEntity.created(new URI("/api/point-interests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /point-interests : Updates an existing pointInterest.
     *
     * @param pointInterest the pointInterest to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated pointInterest,
     * or with status 400 (Bad Request) if the pointInterest is not valid,
     * or with status 500 (Internal Server Error) if the pointInterest couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/point-interests")
    public ResponseEntity<PointInterest> updatePointInterest(@Valid @RequestBody PointInterest pointInterest) throws URISyntaxException {
        log.debug("REST request to update PointInterest : {}", pointInterest);
        if (pointInterest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PointInterest result = pointInterestService.save(pointInterest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pointInterest.getId().toString()))
            .body(result);
    }

    /**
     * GET  /point-interests : get all the pointInterests.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of pointInterests in body
     */
    @GetMapping("/point-interests")
    public ResponseEntity<List<PointInterest>> getAllPointInterests(Pageable pageable) {
        log.debug("REST request to get a page of PointInterests");
        Page<PointInterest> page = pointInterestService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/point-interests");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /point-interests/:id : get the "id" pointInterest.
     *
     * @param id the id of the pointInterest to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the pointInterest, or with status 404 (Not Found)
     */
    @GetMapping("/point-interests/{id}")
    public ResponseEntity<PointInterest> getPointInterest(@PathVariable Long id) {
        log.debug("REST request to get PointInterest : {}", id);
        Optional<PointInterest> pointInterest = pointInterestService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pointInterest);
    }

    /**
     * DELETE  /point-interests/:id : delete the "id" pointInterest.
     *
     * @param id the id of the pointInterest to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/point-interests/{id}")
    public ResponseEntity<Void> deletePointInterest(@PathVariable Long id) {
        log.debug("REST request to delete PointInterest : {}", id);
        pointInterestService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/point-interests/route/{id}")
    public ResponseEntity<List<PointInterest>> getPointsByRouteId(@PathVariable Long id) {
        List<PointInterest> rtnPoints = new ArrayList<>();
        Page<PointInterest> pointInterests = pointInterestService.findAll(PageRequest.of(0, 3000));
        for(PointInterest pointInterest : pointInterests.getContent()) {
            if (pointInterest.getRoute().getId().equals(id)) {
                rtnPoints.add(pointInterest);
            }
        }
        return new ResponseEntity<>(rtnPoints, HttpStatus.OK);
    }
}
