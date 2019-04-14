import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 't-route',
                loadChildren: './t-route/t-route.module#P1TRouteModule'
            },
            {
                path: 'tag',
                loadChildren: './tag/tag.module#P1TagModule'
            },
            {
                path: 'point-interest',
                loadChildren: './point-interest/point-interest.module#P1PointInterestModule'
            },
            {
                path: 'day',
                loadChildren: './day/day.module#P1DayModule'
            },
            {
                path: 'rating',
                loadChildren: './rating/rating.module#P1RatingModule'
            },
            {
                path: 'extended-user',
                loadChildren: './extended-user/extended-user.module#P1ExtendedUserModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1EntityModule {}
