package com.amp.cocome.web.rest;

import com.amp.cocome.P1App;

import com.amp.cocome.domain.PointInterest;
import com.amp.cocome.repository.PointInterestRepository;
import com.amp.cocome.service.PointInterestService;
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
import java.util.List;


import static com.amp.cocome.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PointInterestResource REST controller.
 *
 * @see PointInterestResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = P1App.class)
public class PointInterestResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private PointInterestRepository pointInterestRepository;

    @Autowired
    private PointInterestService pointInterestService;

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

    private MockMvc restPointInterestMockMvc;

    private PointInterest pointInterest;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointInterestResource pointInterestResource = new PointInterestResource(pointInterestService);
        this.restPointInterestMockMvc = MockMvcBuilders.standaloneSetup(pointInterestResource)
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
    public static PointInterest createEntity(EntityManager em) {
        PointInterest pointInterest = new PointInterest()
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS)
            .city(DEFAULT_CITY)
            .description(DEFAULT_DESCRIPTION);
        return pointInterest;
    }

    @Before
    public void initTest() {
        pointInterest = createEntity(em);
    }

    @Test
    @Transactional
    public void createPointInterest() throws Exception {
        int databaseSizeBeforeCreate = pointInterestRepository.findAll().size();

        // Create the PointInterest
        restPointInterestMockMvc.perform(post("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isCreated());

        // Validate the PointInterest in the database
        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeCreate + 1);
        PointInterest testPointInterest = pointInterestList.get(pointInterestList.size() - 1);
        assertThat(testPointInterest.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPointInterest.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testPointInterest.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testPointInterest.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createPointInterestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointInterestRepository.findAll().size();

        // Create the PointInterest with an existing ID
        pointInterest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointInterestMockMvc.perform(post("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isBadRequest());

        // Validate the PointInterest in the database
        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointInterestRepository.findAll().size();
        // set the field null
        pointInterest.setName(null);

        // Create the PointInterest, which fails.

        restPointInterestMockMvc.perform(post("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isBadRequest());

        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointInterestRepository.findAll().size();
        // set the field null
        pointInterest.setAddress(null);

        // Create the PointInterest, which fails.

        restPointInterestMockMvc.perform(post("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isBadRequest());

        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCityIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointInterestRepository.findAll().size();
        // set the field null
        pointInterest.setCity(null);

        // Create the PointInterest, which fails.

        restPointInterestMockMvc.perform(post("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isBadRequest());

        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPointInterests() throws Exception {
        // Initialize the database
        pointInterestRepository.saveAndFlush(pointInterest);

        // Get all the pointInterestList
        restPointInterestMockMvc.perform(get("/api/point-interests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pointInterest.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getPointInterest() throws Exception {
        // Initialize the database
        pointInterestRepository.saveAndFlush(pointInterest);

        // Get the pointInterest
        restPointInterestMockMvc.perform(get("/api/point-interests/{id}", pointInterest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pointInterest.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPointInterest() throws Exception {
        // Get the pointInterest
        restPointInterestMockMvc.perform(get("/api/point-interests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePointInterest() throws Exception {
        // Initialize the database
        pointInterestService.save(pointInterest);

        int databaseSizeBeforeUpdate = pointInterestRepository.findAll().size();

        // Update the pointInterest
        PointInterest updatedPointInterest = pointInterestRepository.findById(pointInterest.getId()).get();
        // Disconnect from session so that the updates on updatedPointInterest are not directly saved in db
        em.detach(updatedPointInterest);
        updatedPointInterest
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .description(UPDATED_DESCRIPTION);

        restPointInterestMockMvc.perform(put("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPointInterest)))
            .andExpect(status().isOk());

        // Validate the PointInterest in the database
        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeUpdate);
        PointInterest testPointInterest = pointInterestList.get(pointInterestList.size() - 1);
        assertThat(testPointInterest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPointInterest.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testPointInterest.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testPointInterest.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingPointInterest() throws Exception {
        int databaseSizeBeforeUpdate = pointInterestRepository.findAll().size();

        // Create the PointInterest

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointInterestMockMvc.perform(put("/api/point-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointInterest)))
            .andExpect(status().isBadRequest());

        // Validate the PointInterest in the database
        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePointInterest() throws Exception {
        // Initialize the database
        pointInterestService.save(pointInterest);

        int databaseSizeBeforeDelete = pointInterestRepository.findAll().size();

        // Delete the pointInterest
        restPointInterestMockMvc.perform(delete("/api/point-interests/{id}", pointInterest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PointInterest> pointInterestList = pointInterestRepository.findAll();
        assertThat(pointInterestList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointInterest.class);
        PointInterest pointInterest1 = new PointInterest();
        pointInterest1.setId(1L);
        PointInterest pointInterest2 = new PointInterest();
        pointInterest2.setId(pointInterest1.getId());
        assertThat(pointInterest1).isEqualTo(pointInterest2);
        pointInterest2.setId(2L);
        assertThat(pointInterest1).isNotEqualTo(pointInterest2);
        pointInterest1.setId(null);
        assertThat(pointInterest1).isNotEqualTo(pointInterest2);
    }
}
