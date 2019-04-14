package com.amp.cocome.web.rest;

import com.amp.cocome.P1App;

import com.amp.cocome.domain.ExtendedUser;
import com.amp.cocome.repository.ExtendedUserRepository;
import com.amp.cocome.service.ExtendedUserService;
import com.amp.cocome.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;


import static com.amp.cocome.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ExtendedUserResource REST controller.
 *
 * @see ExtendedUserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = P1App.class)
public class ExtendedUserResourceIntTest {

    private static final String DEFAULT_ALIAS = "AAAAAAAAAA";
    private static final String UPDATED_ALIAS = "BBBBBBBBBB";

    @Autowired
    private ExtendedUserRepository extendedUserRepository;

    @Mock
    private ExtendedUserRepository extendedUserRepositoryMock;

    @Mock
    private ExtendedUserService extendedUserServiceMock;

    @Autowired
    private ExtendedUserService extendedUserService;

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

    private MockMvc restExtendedUserMockMvc;

    private ExtendedUser extendedUser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ExtendedUserResource extendedUserResource = new ExtendedUserResource(extendedUserService);
        this.restExtendedUserMockMvc = MockMvcBuilders.standaloneSetup(extendedUserResource)
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
    public static ExtendedUser createEntity(EntityManager em) {
        ExtendedUser extendedUser = new ExtendedUser()
            .alias(DEFAULT_ALIAS);
        return extendedUser;
    }

    @Before
    public void initTest() {
        extendedUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createExtendedUser() throws Exception {
        int databaseSizeBeforeCreate = extendedUserRepository.findAll().size();

        // Create the ExtendedUser
        restExtendedUserMockMvc.perform(post("/api/extended-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(extendedUser)))
            .andExpect(status().isCreated());

        // Validate the ExtendedUser in the database
        List<ExtendedUser> extendedUserList = extendedUserRepository.findAll();
        assertThat(extendedUserList).hasSize(databaseSizeBeforeCreate + 1);
        ExtendedUser testExtendedUser = extendedUserList.get(extendedUserList.size() - 1);
        assertThat(testExtendedUser.getAlias()).isEqualTo(DEFAULT_ALIAS);
    }

    @Test
    @Transactional
    public void createExtendedUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = extendedUserRepository.findAll().size();

        // Create the ExtendedUser with an existing ID
        extendedUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restExtendedUserMockMvc.perform(post("/api/extended-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(extendedUser)))
            .andExpect(status().isBadRequest());

        // Validate the ExtendedUser in the database
        List<ExtendedUser> extendedUserList = extendedUserRepository.findAll();
        assertThat(extendedUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllExtendedUsers() throws Exception {
        // Initialize the database
        extendedUserRepository.saveAndFlush(extendedUser);

        // Get all the extendedUserList
        restExtendedUserMockMvc.perform(get("/api/extended-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(extendedUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].alias").value(hasItem(DEFAULT_ALIAS.toString())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllExtendedUsersWithEagerRelationshipsIsEnabled() throws Exception {
        ExtendedUserResource extendedUserResource = new ExtendedUserResource(extendedUserServiceMock);
        when(extendedUserServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restExtendedUserMockMvc = MockMvcBuilders.standaloneSetup(extendedUserResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restExtendedUserMockMvc.perform(get("/api/extended-users?eagerload=true"))
        .andExpect(status().isOk());

        verify(extendedUserServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllExtendedUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        ExtendedUserResource extendedUserResource = new ExtendedUserResource(extendedUserServiceMock);
            when(extendedUserServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restExtendedUserMockMvc = MockMvcBuilders.standaloneSetup(extendedUserResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restExtendedUserMockMvc.perform(get("/api/extended-users?eagerload=true"))
        .andExpect(status().isOk());

            verify(extendedUserServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getExtendedUser() throws Exception {
        // Initialize the database
        extendedUserRepository.saveAndFlush(extendedUser);

        // Get the extendedUser
        restExtendedUserMockMvc.perform(get("/api/extended-users/{id}", extendedUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(extendedUser.getId().intValue()))
            .andExpect(jsonPath("$.alias").value(DEFAULT_ALIAS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingExtendedUser() throws Exception {
        // Get the extendedUser
        restExtendedUserMockMvc.perform(get("/api/extended-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateExtendedUser() throws Exception {
        // Initialize the database
        extendedUserService.save(extendedUser);

        int databaseSizeBeforeUpdate = extendedUserRepository.findAll().size();

        // Update the extendedUser
        ExtendedUser updatedExtendedUser = extendedUserRepository.findById(extendedUser.getId()).get();
        // Disconnect from session so that the updates on updatedExtendedUser are not directly saved in db
        em.detach(updatedExtendedUser);
        updatedExtendedUser
            .alias(UPDATED_ALIAS);

        restExtendedUserMockMvc.perform(put("/api/extended-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedExtendedUser)))
            .andExpect(status().isOk());

        // Validate the ExtendedUser in the database
        List<ExtendedUser> extendedUserList = extendedUserRepository.findAll();
        assertThat(extendedUserList).hasSize(databaseSizeBeforeUpdate);
        ExtendedUser testExtendedUser = extendedUserList.get(extendedUserList.size() - 1);
        assertThat(testExtendedUser.getAlias()).isEqualTo(UPDATED_ALIAS);
    }

    @Test
    @Transactional
    public void updateNonExistingExtendedUser() throws Exception {
        int databaseSizeBeforeUpdate = extendedUserRepository.findAll().size();

        // Create the ExtendedUser

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtendedUserMockMvc.perform(put("/api/extended-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(extendedUser)))
            .andExpect(status().isBadRequest());

        // Validate the ExtendedUser in the database
        List<ExtendedUser> extendedUserList = extendedUserRepository.findAll();
        assertThat(extendedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteExtendedUser() throws Exception {
        // Initialize the database
        extendedUserService.save(extendedUser);

        int databaseSizeBeforeDelete = extendedUserRepository.findAll().size();

        // Delete the extendedUser
        restExtendedUserMockMvc.perform(delete("/api/extended-users/{id}", extendedUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ExtendedUser> extendedUserList = extendedUserRepository.findAll();
        assertThat(extendedUserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExtendedUser.class);
        ExtendedUser extendedUser1 = new ExtendedUser();
        extendedUser1.setId(1L);
        ExtendedUser extendedUser2 = new ExtendedUser();
        extendedUser2.setId(extendedUser1.getId());
        assertThat(extendedUser1).isEqualTo(extendedUser2);
        extendedUser2.setId(2L);
        assertThat(extendedUser1).isNotEqualTo(extendedUser2);
        extendedUser1.setId(null);
        assertThat(extendedUser1).isNotEqualTo(extendedUser2);
    }
}
