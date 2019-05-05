package com.amp.cocome.web.rest;

import com.amp.cocome.domain.PointInterest;
import com.amp.cocome.domain.TRoute;
import com.amp.cocome.domain.Tag;
import com.amp.cocome.service.PointInterestService;
import com.amp.cocome.service.TRouteService;
import com.amp.cocome.service.TagService;
import com.amp.cocome.web.rest.errors.BadRequestAlertException;
import com.amp.cocome.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * REST controller for managing Tag.
 */
@RestController
@RequestMapping("/api")
public class TagResource {

    private final Logger log = LoggerFactory.getLogger(TagResource.class);

    private static final String ENTITY_NAME = "tag";

    private final TagService tagService;
    private final TRouteService routeService;
    private final PointInterestService pointInterestService;

    public TagResource(TagService tagService, TRouteService routeService, PointInterestService pointInterestService) {
        this.tagService = tagService;
        this.routeService = routeService;
        this.pointInterestService = pointInterestService;
    }

    /**
     * POST  /tags : Create a new tag.
     *
     * @param tag the tag to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tag, or with status 400 (Bad Request) if the tag has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tags")
    public ResponseEntity<Tag> createTag(@Valid @RequestBody Tag tag) throws URISyntaxException {
        log.debug("REST request to save Tag : {}", tag);
        if (tag.getId() != null) {
            throw new BadRequestAlertException("A new tag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.created(new URI("/api/tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tags : Updates an existing tag.
     *
     * @param tag the tag to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tag,
     * or with status 400 (Bad Request) if the tag is not valid,
     * or with status 500 (Internal Server Error) if the tag couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tags")
    public ResponseEntity<Tag> updateTag(@Valid @RequestBody Tag tag) throws URISyntaxException {
        log.debug("REST request to update Tag : {}", tag);
        if (tag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tag.getId().toString()))
            .body(result);
    }

    @PutMapping("/tags/point/{id}")
    public ResponseEntity<Tag> updateTagWithPoint(@Valid @RequestBody Tag tag, @PathVariable Long id) throws BadRequestAlertException {
        if (tag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<PointInterest> point = pointInterestService.findOne(id);
        if (point.isPresent()) {
            tag.setPointInterest(point.get());
        } else {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tag.getId().toString()))
            .body(result);
    }

    @PutMapping("/tags/route/{id}")
    public ResponseEntity<Tag> updateTagWithRoute(@Valid @RequestBody Tag tag, @PathVariable Long id) throws BadRequestAlertException {
        //TODO This method is a temporal measure, investigate why the one above doesn't receive route. IT may extend to PoI
        if (tag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<TRoute> route = routeService.findOne(id);
        if (route.isPresent()) {
            tag.setTRoute(route.get());
        } else {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tag.getId().toString()))
            .body(result);
    }

    @PostMapping("/tags/point/{id}")
    public ResponseEntity<Tag> createTagWithPoint(@Valid @RequestBody Tag tag, @PathVariable Long id) throws URISyntaxException {
        if (tag.getId() != null) {
            throw new BadRequestAlertException("A new tag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<PointInterest> point = pointInterestService.findOne(id);
        if (point.isPresent()) {
            tag.setPointInterest(point.get());
        } else {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.created(new URI("/api/tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/tags/route/{id}")
    public ResponseEntity<Tag> createTagWithRoute(@Valid @RequestBody Tag tag, @PathVariable Long id) throws URISyntaxException {
        if (tag.getId() != null) {
            throw new BadRequestAlertException("A new tag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<TRoute> route = routeService.findOne(id);
        if (route.isPresent()) {
            tag.setTRoute(route.get());
        } else {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tag result = tagService.save(tag);
        return ResponseEntity.created(new URI("/api/tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tags : get all the tags.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tags in body
     */
    @GetMapping("/tags")
    public List<Tag> getAllTags() {
        log.debug("REST request to get all Tags");
        return tagService.findAll().stream().filter(distinctByKey(Tag::getName)).collect(Collectors.toList());
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    /**
     * @param id Id of route
     * @return ResponseEntity with status 200 and the list of tags of that route
     */
    @GetMapping("/tags/route/{id}")
    public ResponseEntity<List<Tag>> getTagByRouteId(@PathVariable Long id) {
        List<Tag> rtnList = new ArrayList<>();
        List<Tag> tagPage = tagService.findAll();
        tagPage.stream().filter(tag -> tag.getTRoute() != null && tag.getTRoute().getId().equals(id)).forEach(rtnList::add);
        return new ResponseEntity<>(rtnList.stream().filter(distinctByKey(Tag::getName)).collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/tags/points/{id}")
    public ResponseEntity<List<Tag>> getTagByPointId(@PathVariable Long id) {
        List<Tag> rtnList = new ArrayList<>();
        List<Tag> tagPage = tagService.findAll();
        tagPage.stream().filter(tag -> tag.getPointInterest() != null && tag.getPointInterest().getId().equals(id)).forEach(rtnList::add);
        return new ResponseEntity<>(rtnList.stream().filter(distinctByKey(Tag::getName)).collect(Collectors.toList()), HttpStatus.OK);
    }

    /**
     * GET  /tags/:id : get the "id" tag.
     *
     * @param id the id of the tag to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tag, or with status 404 (Not Found)
     */
    @GetMapping("/tags/{id}")
    public ResponseEntity<Tag> getTag(@PathVariable Long id) {
        log.debug("REST request to get Tag : {}", id);
        Optional<Tag> tag = tagService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tag);
    }

    /**
     * DELETE  /tags/:id : delete the "id" tag.
     *
     * @param id the id of the tag to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        log.debug("REST request to delete Tag : {}", id);
        tagService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
