import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { P1SharedModule } from 'app/shared';
import {
    DayComponent,
    DayDetailComponent,
    DayUpdateComponent,
    DayDeletePopupComponent,
    DayDeleteDialogComponent,
    dayRoute,
    dayPopupRoute
} from './';

const ENTITY_STATES = [...dayRoute, ...dayPopupRoute];

@NgModule({
    imports: [P1SharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [DayComponent, DayDetailComponent, DayUpdateComponent, DayDeleteDialogComponent, DayDeletePopupComponent],
    entryComponents: [DayComponent, DayUpdateComponent, DayDeleteDialogComponent, DayDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1DayModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
