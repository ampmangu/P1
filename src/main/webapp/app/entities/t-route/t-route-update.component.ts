import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from './t-route.service';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from 'app/entities/rating';
import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { ExtendedUserService } from 'app/entities/extended-user';

@Component({
    selector: 'jhi-t-route-update',
    templateUrl: './t-route-update.component.html'
})
export class TRouteUpdateComponent implements OnInit {
    tRoute: ITRoute;
    isSaving: boolean;

    ratings: IRating[];

    extendedusers: IExtendedUser[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected tRouteService: TRouteService,
        protected ratingService: RatingService,
        protected extendedUserService: ExtendedUserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tRoute }) => {
            this.tRoute = tRoute;
            this.date = this.tRoute.date != null ? this.tRoute.date.format(DATE_TIME_FORMAT) : null;
        });
        this.ratingService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IRating[]>) => mayBeOk.ok),
                map((response: HttpResponse<IRating[]>) => response.body)
            )
            .subscribe((res: IRating[]) => (this.ratings = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.tRoute.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.tRoute.id !== undefined) {
            this.subscribeToSaveResponse(this.tRouteService.update(this.tRoute));
        } else {
            this.subscribeToSaveResponse(this.tRouteService.create(this.tRoute));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITRoute>>) {
        result.subscribe((res: HttpResponse<ITRoute>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackRatingById(index: number, item: IRating) {
        return item.id;
    }

    trackExtendedUserById(index: number, item: IExtendedUser) {
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