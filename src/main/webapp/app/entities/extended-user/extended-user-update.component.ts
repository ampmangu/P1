import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { ExtendedUserService } from './extended-user.service';
import { IUser, UserService } from 'app/core';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';

@Component({
    selector: 'jhi-extended-user-update',
    templateUrl: './extended-user-update.component.html'
})
export class ExtendedUserUpdateComponent implements OnInit {
    extendedUser: IExtendedUser;
    isSaving: boolean;

    users: IUser[];

    troutes: ITRoute[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected extendedUserService: ExtendedUserService,
        protected userService: UserService,
        protected tRouteService: TRouteService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ extendedUser }) => {
            this.extendedUser = extendedUser;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.tRouteService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITRoute[]>) => response.body)
            )
            .subscribe((res: ITRoute[]) => (this.troutes = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.extendedUser.id !== undefined) {
            this.subscribeToSaveResponse(this.extendedUserService.update(this.extendedUser));
        } else {
            this.subscribeToSaveResponse(this.extendedUserService.create(this.extendedUser));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtendedUser>>) {
        result.subscribe((res: HttpResponse<IExtendedUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackTRouteById(index: number, item: ITRoute) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
