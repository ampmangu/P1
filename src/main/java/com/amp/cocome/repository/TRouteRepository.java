package com.amp.cocome.repository;

import com.amp.cocome.domain.TRoute;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TRoute entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TRouteRepository extends JpaRepository<TRoute, Long> {

}
