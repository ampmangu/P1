package com.amp.cocome.repository;

import com.amp.cocome.domain.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Rating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query(value = "select distinct rating from Rating rating left join fetch rating.belongsToRoutes left join fetch rating.belongsToPoints",
        countQuery = "select count(distinct rating) from Rating rating")
    Page<Rating> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct rating from Rating rating left join fetch rating.belongsToRoutes left join fetch rating.belongsToPoints")
    List<Rating> findAllWithEagerRelationships();

    @Query("select rating from Rating rating left join fetch rating.belongsToRoutes left join fetch rating.belongsToPoints where rating.id =:id")
    Optional<Rating> findOneWithEagerRelationships(@Param("id") Long id);

}
