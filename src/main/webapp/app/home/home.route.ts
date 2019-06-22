import { Routes } from '@angular/router';

import { HomeComponent } from './';
import { PremiumComponent } from 'app/home/premium.component';
import { UserRouteAccessService } from 'app/core';
import { SearchResultsComponent } from 'app/home/search-results.component';

export const HOME_ROUTE: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            authorities: [],
            pageTitle: 'global.title'
        }
    },
    {
        path: 'getpremium',
        component: PremiumComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'search/:searchValue',
        component: SearchResultsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
