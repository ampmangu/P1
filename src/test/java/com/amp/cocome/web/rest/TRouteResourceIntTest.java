package com.amp.cocome.web.rest;

import com.amp.cocome.P1App;

import com.amp.cocome.domain.TRoute;
import com.amp.cocome.repository.TRouteRepository;
import com.amp.cocome.service.TRouteService;
import com.amp.cocome.service.UserService;
import com.amp.cocome.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static com.amp.cocome.web.rest.TestUtil.sameInstant;
import static com.amp.cocome.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TRouteResource REST controller.
 *
 * @see TRouteResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = P1App.class)
public class TRouteResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private TRouteRepository tRouteRepository;

    @Autowired
    private TRouteService tRouteService;

    @Autowired
    private UserService userService;
    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restTRouteMockMvc;

    private TRoute tRoute;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TRouteResource tRouteResource = new TRouteResource(tRouteService, userService);
        this.restTRouteMockMvc = MockMvcBuilders.standaloneSetup(tRouteResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TRoute createEntity(EntityManager em) {
        TRoute tRoute = new TRoute()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE);
        return tRoute;
    }

    @Before
    public void initTest() {
        tRoute = createEntity(em);
    }

    @Test
    @Transactional
    public void createTRoute() throws Exception {
        int databaseSizeBeforeCreate = tRouteRepository.findAll().size();

        // Create the TRoute
        restTRouteMockMvc.perform(post("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tRoute)))
            .andExpect(status().isCreated());

        // Validate the TRoute in the database
        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeCreate + 1);
        TRoute testTRoute = tRouteList.get(tRouteList.size() - 1);
        assertThat(testTRoute.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTRoute.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTRoute.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createTRouteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tRouteRepository.findAll().size();

        // Create the TRoute with an existing ID
        tRoute.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTRouteMockMvc.perform(post("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tRoute)))
            .andExpect(status().isBadRequest());

        // Validate the TRoute in the database
        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = tRouteRepository.findAll().size();
        // set the field null
        tRoute.setTitle(null);

        // Create the TRoute, which fails.

        restTRouteMockMvc.perform(post("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tRoute)))
            .andExpect(status().isBadRequest());

        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = tRouteRepository.findAll().size();
        // set the field null
        tRoute.setDate(null);

        // Create the TRoute, which fails.

        restTRouteMockMvc.perform(post("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tRoute)))
            .andExpect(status().isBadRequest());

        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTRoutes() throws Exception {
        // Initialize the database
        tRouteRepository.saveAndFlush(tRoute);

        // Get all the tRouteList
        restTRouteMockMvc.perform(get("/api/t-routes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tRoute.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }
    
    @Test
    @Transactional
    public void getTRoute() throws Exception {
        // Initialize the database
        tRouteRepository.saveAndFlush(tRoute);

        // Get the tRoute
        restTRouteMockMvc.perform(get("/api/t-routes/{id}", tRoute.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tRoute.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingTRoute() throws Exception {
        // Get the tRoute
        restTRouteMockMvc.perform(get("/api/t-routes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTRoute() throws Exception {
        // Initialize the database
        tRouteService.save(tRoute);

        int databaseSizeBeforeUpdate = tRouteRepository.findAll().size();

        // Update the tRoute
        TRoute updatedTRoute = tRouteRepository.findById(tRoute.getId()).get();
        // Disconnect from session so that the updates on updatedTRoute are not directly saved in db
        em.detach(updatedTRoute);
        updatedTRoute
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE);

        restTRouteMockMvc.perform(put("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTRoute)))
            .andExpect(status().isOk());

        // Validate the TRoute in the database
        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeUpdate);
        TRoute testTRoute = tRouteList.get(tRouteList.size() - 1);
        assertThat(testTRoute.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTRoute.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTRoute.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingTRoute() throws Exception {
        int databaseSizeBeforeUpdate = tRouteRepository.findAll().size();

        // Create the TRoute

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTRouteMockMvc.perform(put("/api/t-routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tRoute)))
            .andExpect(status().isBadRequest());

        // Validate the TRoute in the database
        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTRoute() throws Exception {
        // Initialize the database
        tRouteService.save(tRoute);

        int databaseSizeBeforeDelete = tRouteRepository.findAll().size();

        // Delete the tRoute
        restTRouteMockMvc.perform(delete("/api/t-routes/{id}", tRoute.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TRoute> tRouteList = tRouteRepository.findAll();
        assertThat(tRouteList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TRoute.class);
        TRoute tRoute1 = new TRoute();
        tRoute1.setId(1L);
        TRoute tRoute2 = new TRoute();
        tRoute2.setId(tRoute1.getId());
        assertThat(tRoute1).isEqualTo(tRoute2);
        tRoute2.setId(2L);
        assertThat(tRoute1).isNotEqualTo(tRoute2);
        tRoute1.setId(null);
        assertThat(tRoute1).isNotEqualTo(tRoute2);
    }
}
