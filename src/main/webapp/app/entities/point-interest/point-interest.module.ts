import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { P1SharedModule } from 'app/shared';
import {
    PointInterestComponent,
    PointInterestDetailComponent,
    PointInterestUpdateComponent,
    PointInterestDeletePopupComponent,
    PointInterestDeleteDialogComponent,
    pointInterestRoute,
    pointInterestPopupRoute
} from './';
import { PointInterestAddExistingComponent } from 'app/entities/point-interest/point-interest-add-existing.component';
import { RatingComponent } from 'app/entities/rating';

const ENTITY_STATES = [...pointInterestRoute, ...pointInterestPopupRoute];

@NgModule({
    imports: [P1SharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PointInterestComponent,
        PointInterestDetailComponent,
        PointInterestUpdateComponent,
        PointInterestDeleteDialogComponent,
        PointInterestDeletePopupComponent,
        PointInterestAddExistingComponent,
        RatingComponent
    ],
    entryComponents: [
        PointInterestComponent,
        PointInterestUpdateComponent,
        PointInterestDeleteDialogComponent,
        PointInterestDeletePopupComponent,
        PointInterestAddExistingComponent,
        RatingComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1PointInterestModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
