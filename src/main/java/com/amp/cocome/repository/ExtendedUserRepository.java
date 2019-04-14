package com.amp.cocome.repository;

import com.amp.cocome.domain.ExtendedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the ExtendedUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtendedUserRepository extends JpaRepository<ExtendedUser, Long> {

    @Query(value = "select distinct extended_user from ExtendedUser extended_user left join fetch extended_user.followsRoutes",
        countQuery = "select count(distinct extended_user) from ExtendedUser extended_user")
    Page<ExtendedUser> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct extended_user from ExtendedUser extended_user left join fetch extended_user.followsRoutes")
    List<ExtendedUser> findAllWithEagerRelationships();

    @Query("select extended_user from ExtendedUser extended_user left join fetch extended_user.followsRoutes where extended_user.id =:id")
    Optional<ExtendedUser> findOneWithEagerRelationships(@Param("id") Long id);

}
