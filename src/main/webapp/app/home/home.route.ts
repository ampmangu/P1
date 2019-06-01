import { Routes } from '@angular/router';

import { HomeComponent } from './';
import { PremiumComponent } from 'app/home/premium.component';

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
            authorities: [],
            pageTitle: 'global.title'
        }
    }
];
