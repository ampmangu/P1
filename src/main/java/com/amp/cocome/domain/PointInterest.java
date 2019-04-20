package com.amp.cocome.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A PointInterest.
 */
@Entity
@Table(name = "point_interest")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PointInterest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "pointInterest")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Tag> tagsInPointInterests = new HashSet<>();
    @ManyToMany(mappedBy = "belongsToPoints")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Rating> pointHasRatings = new HashSet<>();

    @ManyToOne
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private TRoute route;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PointInterest name(String name) {
        this.name = name;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public PointInterest address(String address) {
        this.address = address;
        return this;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public PointInterest city(String city) {
        this.city = city;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PointInterest description(String description) {
        this.description = description;
        return this;
    }

    public Set<Tag> getTagsInPointInterests() {
        return tagsInPointInterests;
    }

    public void setTagsInPointInterests(Set<Tag> tags) {
        this.tagsInPointInterests = tags;
    }

    public PointInterest tagsInPointInterests(Set<Tag> tags) {
        this.tagsInPointInterests = tags;
        return this;
    }

    public PointInterest addTagsInPointInterest(Tag tag) {
        this.tagsInPointInterests.add(tag);
        tag.setPointInterest(this);
        return this;
    }

    public PointInterest removeTagsInPointInterest(Tag tag) {
        this.tagsInPointInterests.remove(tag);
        tag.setPointInterest(null);
        return this;
    }

    public Set<Rating> getPointHasRatings() {
        return pointHasRatings;
    }

    public void setPointHasRatings(Set<Rating> ratings) {
        this.pointHasRatings = ratings;
    }

    public PointInterest pointHasRatings(Set<Rating> ratings) {
        this.pointHasRatings = ratings;
        return this;
    }

    public PointInterest addPointHasRatings(Rating rating) {
        this.pointHasRatings.add(rating);
        rating.getBelongsToPoints().add(this);
        return this;
    }

    public PointInterest removePointHasRatings(Rating rating) {
        this.pointHasRatings.remove(rating);
        rating.getBelongsToPoints().remove(this);
        return this;
    }

    public TRoute getRoute() {
        return route;
    }

    public void setRoute(TRoute route) {
        this.route = route;
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
        PointInterest pointInterest = (PointInterest) o;
        if (pointInterest.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), pointInterest.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PointInterest{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", city='" + getCity() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
