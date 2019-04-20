package com.amp.cocome.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.amp.cocome.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.amp.cocome.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".createsRoutes", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".createsRatings", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".createsDays", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".followsRoutes", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.PersistentToken.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.User.class.getName() + ".persistentTokens", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName() + ".tagsInRoutes", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName() + ".daysInRoutes", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName() + ".routeHasRatings", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName() + ".isFollowedBies", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.TRoute.class.getName() + ".pointInterests", jcacheConfiguration);

            cm.createCache(com.amp.cocome.domain.Tag.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.PointInterest.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.PointInterest.class.getName() + ".tagsInPointInterests", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.PointInterest.class.getName() + ".pointHasRatings", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.Day.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.Rating.class.getName(), jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.Rating.class.getName() + ".belongsToRoutes", jcacheConfiguration);
            cm.createCache(com.amp.cocome.domain.Rating.class.getName() + ".belongsToPoints", jcacheConfiguration);

            // jhipster-needle-ehcache-add-entry
        };
    }
}
