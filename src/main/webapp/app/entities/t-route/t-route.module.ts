import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { P1SharedModule } from 'app/shared';
import {
    TRouteComponent,
    TRouteDetailComponent,
    TRouteUpdateComponent,
    TRouteDeletePopupComponent,
    TRouteDeleteDialogComponent,
    tRouteRoute,
    tRoutePopupRoute
} from './';

const ENTITY_STATES = [...tRouteRoute, ...tRoutePopupRoute];

@NgModule({
    imports: [P1SharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [TRouteComponent, TRouteDetailComponent, TRouteUpdateComponent, TRouteDeleteDialogComponent, TRouteDeletePopupComponent],
    entryComponents: [TRouteComponent, TRouteUpdateComponent, TRouteDeleteDialogComponent, TRouteDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1TRouteModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
