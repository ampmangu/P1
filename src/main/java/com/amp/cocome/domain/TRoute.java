package com.amp.cocome.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * A TRoute.
 */
@Entity
@Table(name = "t_route")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TRoute implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private ZonedDateTime date;
    @JsonIgnore
    @OneToMany(mappedBy = "tRoute", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Tag> tagsInRoutes = new HashSet<>();
    @OneToMany(mappedBy = "tRoute", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Day> daysInRoutes = new HashSet<>();
    @ManyToMany(mappedBy = "belongsToRoutes")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Rating> routeHasRatings = new HashSet<>();

    @ManyToMany(mappedBy = "followsRoutes", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<User> isFollowedBies = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("createsRoutes")
    private User user;

    @OneToMany(mappedBy = "route")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<PointInterest> pointInterests;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public TRoute title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public TRoute description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public TRoute date(ZonedDateTime date) {
        this.date = date;
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<Tag> getTagsInRoutes() {
        return tagsInRoutes;
    }

    public TRoute tagsInRoutes(Set<Tag> tags) {
        this.tagsInRoutes = tags;
        return this;
    }

    public TRoute addTagsInRoute(Tag tag) {
        this.tagsInRoutes.add(tag);
        tag.setTRoute(this);
        return this;
    }

    public TRoute removeTagsInRoute(Tag tag) {
        this.tagsInRoutes.remove(tag);
        tag.setTRoute(null);
        return this;
    }

    public void setTagsInRoutes(Set<Tag> tags) {
        this.tagsInRoutes = tags;
    }

    public Set<Day> getDaysInRoutes() {
        return daysInRoutes;
    }

    public TRoute daysInRoutes(Set<Day> days) {
        this.daysInRoutes = days;
        return this;
    }

    public TRoute addDaysInRoute(Day day) {
        this.daysInRoutes.add(day);
        day.setTRoute(this);
        return this;
    }

    public TRoute removeDaysInRoute(Day day) {
        this.daysInRoutes.remove(day);
        day.setTRoute(null);
        return this;
    }

    public void setDaysInRoutes(Set<Day> days) {
        this.daysInRoutes = days;
    }

    public Set<Rating> getRouteHasRatings() {
        return routeHasRatings;
    }

    public TRoute routeHasRatings(Set<Rating> ratings) {
        this.routeHasRatings = ratings;
        return this;
    }

    public TRoute addRouteHasRatings(Rating rating) {
        this.routeHasRatings.add(rating);
        rating.getBelongsToRoutes().add(this);
        return this;
    }

    public TRoute removeRouteHasRatings(Rating rating) {
        this.routeHasRatings.remove(rating);
        rating.getBelongsToRoutes().remove(this);
        return this;
    }

    public void setRouteHasRatings(Set<Rating> ratings) {
        this.routeHasRatings = ratings;
    }

    public Set<User> getIsFollowedBies() {
        return isFollowedBies;
    }

    public TRoute isFollowedBies(Set<User> Users) {
        this.isFollowedBies = Users;
        return this;
    }

    public TRoute addIsFollowedBy(User User) {
        this.isFollowedBies.add(User);
        User.getFollowsRoutes().add(this);
        return this;
    }

    public TRoute removeIsFollowedBy(User User) {
        this.isFollowedBies.remove(User);
        User.getFollowsRoutes().remove(this);
        return this;
    }

    public void setIsFollowedBies(Set<User> Users) {
        this.isFollowedBies = Users;
    }

    public User getUser() {
        return user;
    }

    public TRoute User(User User) {
        this.user = User;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        TRoute tRoute = (TRoute) o;
        if (tRoute.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tRoute.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TRoute{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
