import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDay } from 'app/shared/model/day.model';
import { DayService } from './day.service';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { ExtendedUserService } from 'app/entities/extended-user';

@Component({
    selector: 'jhi-day-update',
    templateUrl: './day-update.component.html'
})
export class DayUpdateComponent implements OnInit {
    day: IDay;
    isSaving: boolean;

    troutes: ITRoute[];

    extendedusers: IExtendedUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected dayService: DayService,
        protected tRouteService: TRouteService,
        protected extendedUserService: ExtendedUserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ day }) => {
            this.day = day;
        });
        this.tRouteService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITRoute[]>) => response.body)
            )
            .subscribe((res: ITRoute[]) => (this.troutes = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.extendedUserService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IExtendedUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IExtendedUser[]>) => response.body)
            )
            .subscribe((res: IExtendedUser[]) => (this.extendedusers = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.day.id !== undefined) {
            this.subscribeToSaveResponse(this.dayService.update(this.day));
        } else {
            this.subscribeToSaveResponse(this.dayService.create(this.day));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDay>>) {
        result.subscribe((res: HttpResponse<IDay>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackTRouteById(index: number, item: ITRoute) {
        return item.id;
    }

    trackExtendedUserById(index: number, item: IExtendedUser) {
        return item.id;
    }
}
