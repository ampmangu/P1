import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { P1SharedModule } from 'app/shared';
import {
    ExtendedUserComponent,
    ExtendedUserDetailComponent,
    ExtendedUserUpdateComponent,
    ExtendedUserDeletePopupComponent,
    ExtendedUserDeleteDialogComponent,
    extendedUserRoute,
    extendedUserPopupRoute
} from './';

const ENTITY_STATES = [...extendedUserRoute, ...extendedUserPopupRoute];

@NgModule({
    imports: [P1SharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ExtendedUserComponent,
        ExtendedUserDetailComponent,
        ExtendedUserUpdateComponent,
        ExtendedUserDeleteDialogComponent,
        ExtendedUserDeletePopupComponent
    ],
    entryComponents: [
        ExtendedUserComponent,
        ExtendedUserUpdateComponent,
        ExtendedUserDeleteDialogComponent,
        ExtendedUserDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class P1ExtendedUserModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
