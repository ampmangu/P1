import { Routes } from '@angular/router';

import { HomeComponent } from './';
import { PremiumComponent } from 'app/home/premium.component';
import { UserRouteAccessService } from 'app/core';

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
    }
];
