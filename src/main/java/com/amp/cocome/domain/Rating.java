package com.amp.cocome.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Rating.
 */
@Entity
@Table(name = "rating")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private ZonedDateTime creationDate;

    @Column(name = "name")
    private String name;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "score", nullable = false)
    private Integer score;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "rating_belongs_to_route",
               joinColumns = @JoinColumn(name = "rating_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "belongs_to_route_id", referencedColumnName = "id"))
    private Set<TRoute> belongsToRoutes = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "rating_belongs_to_point",
               joinColumns = @JoinColumn(name = "rating_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "belongs_to_point_id", referencedColumnName = "id"))
    private Set<PointInterest> belongsToPoints = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("createsRatings")
    private User User;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCreationDate() {
        return creationDate;
    }

    public Rating creationDate(ZonedDateTime creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(ZonedDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getName() {
        return name;
    }

    public Rating name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public Rating score(Integer score) {
        this.score = score;
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Set<TRoute> getBelongsToRoutes() {
        return belongsToRoutes;
    }

    public Rating belongsToRoutes(Set<TRoute> tRoutes) {
        this.belongsToRoutes = tRoutes;
        return this;
    }

    public Rating addBelongsToRoute(TRoute tRoute) {
        this.belongsToRoutes.add(tRoute);
        tRoute.getRouteHasRatings().add(this);
        return this;
    }

    public Rating removeBelongsToRoute(TRoute tRoute) {
        this.belongsToRoutes.remove(tRoute);
        tRoute.getRouteHasRatings().remove(this);
        return this;
    }

    public void setBelongsToRoutes(Set<TRoute> tRoutes) {
        this.belongsToRoutes = tRoutes;
    }

    public Set<PointInterest> getBelongsToPoints() {
        return belongsToPoints;
    }

    public Rating belongsToPoints(Set<PointInterest> pointInterests) {
        this.belongsToPoints = pointInterests;
        return this;
    }

    public Rating addBelongsToPoint(PointInterest pointInterest) {
        this.belongsToPoints.add(pointInterest);
        pointInterest.getPointHasRatings().add(this);
        return this;
    }

    public Rating removeBelongsToPoint(PointInterest pointInterest) {
        this.belongsToPoints.remove(pointInterest);
        pointInterest.getPointHasRatings().remove(this);
        return this;
    }

    public void setBelongsToPoints(Set<PointInterest> pointInterests) {
        this.belongsToPoints = pointInterests;
    }

    public User getUser() {
        return User;
    }

    public Rating User(User User) {
        this.User = User;
        return this;
    }

    public void setUser(User User) {
        this.User = User;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Rating rating = (Rating) o;
        if (rating.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), rating.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Rating{" +
            "id=" + getId() +
            ", creationDate='" + getCreationDate() + "'" +
            ", name='" + getName() + "'" +
            ", score=" + getScore() +
            "}";
    }
}
