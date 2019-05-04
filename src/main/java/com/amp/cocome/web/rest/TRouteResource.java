package com.amp.cocome.web.rest;
import com.amp.cocome.domain.TRoute;
import com.amp.cocome.domain.Tag;
import com.amp.cocome.service.TRouteService;
import com.amp.cocome.web.rest.errors.BadRequestAlertException;
import com.amp.cocome.web.rest.util.HeaderUtil;
import com.amp.cocome.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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
 * REST controller for managing TRoute.
 */
@RestController
@RequestMapping("/api")
public class TRouteResource {

    private final Logger log = LoggerFactory.getLogger(TRouteResource.class);

    private static final String ENTITY_NAME = "tRoute";

    private final TRouteService tRouteService;

    public TRouteResource(TRouteService tRouteService) {
        this.tRouteService = tRouteService;
    }

    /**
     * POST  /t-routes : Create a new tRoute.
     *
     * @param tRoute the tRoute to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tRoute, or with status 400 (Bad Request) if the tRoute has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/t-routes")
    public ResponseEntity<TRoute> createTRoute(@Valid @RequestBody TRoute tRoute) throws URISyntaxException {
        log.debug("REST request to save TRoute : {}", tRoute);
        if (tRoute.getId() != null) {
            throw new BadRequestAlertException("A new tRoute cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TRoute result = tRouteService.save(tRoute);
        return ResponseEntity.created(new URI("/api/t-routes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /t-routes : Updates an existing tRoute.
     *
     * @param tRoute the tRoute to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tRoute,
     * or with status 400 (Bad Request) if the tRoute is not valid,
     * or with status 500 (Internal Server Error) if the tRoute couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/t-routes")
    public ResponseEntity<TRoute> updateTRoute(@Valid @RequestBody TRoute tRoute) throws URISyntaxException {
        log.debug("REST request to update TRoute : {}", tRoute);
        if (tRoute.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TRoute result = tRouteService.save(tRoute);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tRoute.getId().toString()))
            .body(result);
    }

    /**
     * GET  /t-routes : get all the tRoutes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tRoutes in body
     */
    @GetMapping("/t-routes")
    public ResponseEntity<List<TRoute>> getAllTRoutes(Pageable pageable) {
        log.debug("REST request to get a page of TRoutes");
        Page<TRoute> page = tRouteService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/t-routes");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /t-routes/:id : get the "id" tRoute.
     *
     * @param id the id of the tRoute to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tRoute, or with status 404 (Not Found)
     */
    @GetMapping("/t-routes/{id}")
    public ResponseEntity<TRoute> getTRoute(@PathVariable Long id) {
        log.debug("REST request to get TRoute : {}", id);
        Optional<TRoute> tRoute = tRouteService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tRoute);
    }

    @GetMapping("/t-routes/tags/{id}")
    public ResponseEntity<List<Tag>> getAllTagsOfRoute(@PathVariable Long id) {
        List<Tag> rtnTags = new ArrayList<>();
        Optional<TRoute> tRoute = tRouteService.findOne(id);
        tRoute.ifPresent(route -> rtnTags.addAll(route.getTagsInRoutes()));
        return new ResponseEntity<>(rtnTags, HttpStatus.OK);
    }
    /**
     * DELETE  /t-routes/:id : delete the "id" tRoute.
     *
     * @param id the id of the tRoute to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/t-routes/{id}")
    public ResponseEntity<Void> deleteTRoute(@PathVariable Long id) {
        log.debug("REST request to delete TRoute : {}", id);
        tRouteService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
