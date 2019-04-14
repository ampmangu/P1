package com.amp.cocome.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ExtendedUser.
 */
@Entity
@Table(name = "extended_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ExtendedUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Column(name = "alias")
    private String alias;
//    @JoinColumn(unique = true)

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true, name = "id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "extendedUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TRoute> createsRoutes = new HashSet<>();
    @OneToMany(mappedBy = "extendedUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Rating> createsRatings = new HashSet<>();
    @OneToMany(mappedBy = "extendedUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Day> createsDays = new HashSet<>();
    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "extended_user_follows_route",
               joinColumns = @JoinColumn(name = "extended_user_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "follows_route_id", referencedColumnName = "id"))
    private Set<TRoute> followsRoutes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlias() {
        return alias;
    }

    public ExtendedUser alias(String alias) {
        this.alias = alias;
        return this;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public User getUser() {
        return user;
    }

    public ExtendedUser user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<TRoute> getCreatesRoutes() {
        return createsRoutes;
    }

    public ExtendedUser createsRoutes(Set<TRoute> tRoutes) {
        this.createsRoutes = tRoutes;
        return this;
    }

    public ExtendedUser addCreatesRoute(TRoute tRoute) {
        this.createsRoutes.add(tRoute);
        tRoute.setExtendedUser(this);
        return this;
    }

    public ExtendedUser removeCreatesRoute(TRoute tRoute) {
        this.createsRoutes.remove(tRoute);
        tRoute.setExtendedUser(null);
        return this;
    }

    public void setCreatesRoutes(Set<TRoute> tRoutes) {
        this.createsRoutes = tRoutes;
    }

    public Set<Rating> getCreatesRatings() {
        return createsRatings;
    }

    public ExtendedUser createsRatings(Set<Rating> ratings) {
        this.createsRatings = ratings;
        return this;
    }

    public ExtendedUser addCreatesRating(Rating rating) {
        this.createsRatings.add(rating);
        rating.setExtendedUser(this);
        return this;
    }

    public ExtendedUser removeCreatesRating(Rating rating) {
        this.createsRatings.remove(rating);
        rating.setExtendedUser(null);
        return this;
    }

    public void setCreatesRatings(Set<Rating> ratings) {
        this.createsRatings = ratings;
    }

    public Set<Day> getCreatesDays() {
        return createsDays;
    }

    public ExtendedUser createsDays(Set<Day> days) {
        this.createsDays = days;
        return this;
    }

    public ExtendedUser addCreatesDay(Day day) {
        this.createsDays.add(day);
        day.setExtendedUser(this);
        return this;
    }

    public ExtendedUser removeCreatesDay(Day day) {
        this.createsDays.remove(day);
        day.setExtendedUser(null);
        return this;
    }

    public void setCreatesDays(Set<Day> days) {
        this.createsDays = days;
    }

    public Set<TRoute> getFollowsRoutes() {
        return followsRoutes;
    }

    public ExtendedUser followsRoutes(Set<TRoute> tRoutes) {
        this.followsRoutes = tRoutes;
        return this;
    }

    public ExtendedUser addFollowsRoute(TRoute tRoute) {
        this.followsRoutes.add(tRoute);
        tRoute.getIsFollowedBies().add(this);
        return this;
    }

    public ExtendedUser removeFollowsRoute(TRoute tRoute) {
        this.followsRoutes.remove(tRoute);
        tRoute.getIsFollowedBies().remove(this);
        return this;
    }

    public void setFollowsRoutes(Set<TRoute> tRoutes) {
        this.followsRoutes = tRoutes;
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
        ExtendedUser extendedUser = (ExtendedUser) o;
        if (extendedUser.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), extendedUser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ExtendedUser{" +
            "id=" + getId() +
            ", alias='" + getAlias() + "'" +
            "}";
    }
}
