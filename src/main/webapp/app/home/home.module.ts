import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { P1SharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { PremiumComponent } from 'app/home/premium.component';

@NgModule({
    imports: [P1SharedModule, RouterModule.forChild([...HOME_ROUTE])],
    declarations: [HomeComponent, PremiumComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1HomeModule {}
