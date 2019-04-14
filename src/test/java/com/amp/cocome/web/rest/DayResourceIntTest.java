package com.amp.cocome.web.rest;

import com.amp.cocome.P1App;

import com.amp.cocome.domain.Day;
import com.amp.cocome.repository.DayRepository;
import com.amp.cocome.service.DayService;
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
 * Test class for the DayResource REST controller.
 *
 * @see DayResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = P1App.class)
public class DayResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private DayRepository dayRepository;

    @Autowired
    private DayService dayService;

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

    private MockMvc restDayMockMvc;

    private Day day;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DayResource dayResource = new DayResource(dayService);
        this.restDayMockMvc = MockMvcBuilders.standaloneSetup(dayResource)
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
    public static Day createEntity(EntityManager em) {
        Day day = new Day()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION);
        return day;
    }

    @Before
    public void initTest() {
        day = createEntity(em);
    }

    @Test
    @Transactional
    public void createDay() throws Exception {
        int databaseSizeBeforeCreate = dayRepository.findAll().size();

        // Create the Day
        restDayMockMvc.perform(post("/api/days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(day)))
            .andExpect(status().isCreated());

        // Validate the Day in the database
        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeCreate + 1);
        Day testDay = dayList.get(dayList.size() - 1);
        assertThat(testDay.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testDay.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createDayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dayRepository.findAll().size();

        // Create the Day with an existing ID
        day.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDayMockMvc.perform(post("/api/days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(day)))
            .andExpect(status().isBadRequest());

        // Validate the Day in the database
        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = dayRepository.findAll().size();
        // set the field null
        day.setTitle(null);

        // Create the Day, which fails.

        restDayMockMvc.perform(post("/api/days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(day)))
            .andExpect(status().isBadRequest());

        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDays() throws Exception {
        // Initialize the database
        dayRepository.saveAndFlush(day);

        // Get all the dayList
        restDayMockMvc.perform(get("/api/days?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(day.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getDay() throws Exception {
        // Initialize the database
        dayRepository.saveAndFlush(day);

        // Get the day
        restDayMockMvc.perform(get("/api/days/{id}", day.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(day.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDay() throws Exception {
        // Get the day
        restDayMockMvc.perform(get("/api/days/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDay() throws Exception {
        // Initialize the database
        dayService.save(day);

        int databaseSizeBeforeUpdate = dayRepository.findAll().size();

        // Update the day
        Day updatedDay = dayRepository.findById(day.getId()).get();
        // Disconnect from session so that the updates on updatedDay are not directly saved in db
        em.detach(updatedDay);
        updatedDay
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION);

        restDayMockMvc.perform(put("/api/days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDay)))
            .andExpect(status().isOk());

        // Validate the Day in the database
        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeUpdate);
        Day testDay = dayList.get(dayList.size() - 1);
        assertThat(testDay.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDay.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingDay() throws Exception {
        int databaseSizeBeforeUpdate = dayRepository.findAll().size();

        // Create the Day

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDayMockMvc.perform(put("/api/days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(day)))
            .andExpect(status().isBadRequest());

        // Validate the Day in the database
        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDay() throws Exception {
        // Initialize the database
        dayService.save(day);

        int databaseSizeBeforeDelete = dayRepository.findAll().size();

        // Delete the day
        restDayMockMvc.perform(delete("/api/days/{id}", day.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Day> dayList = dayRepository.findAll();
        assertThat(dayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Day.class);
        Day day1 = new Day();
        day1.setId(1L);
        Day day2 = new Day();
        day2.setId(day1.getId());
        assertThat(day1).isEqualTo(day2);
        day2.setId(2L);
        assertThat(day1).isNotEqualTo(day2);
        day1.setId(null);
        assertThat(day1).isNotEqualTo(day2);
    }
}
