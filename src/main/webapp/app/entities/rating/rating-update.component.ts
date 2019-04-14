import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from './rating.service';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from 'app/entities/point-interest';
import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { ExtendedUserService } from 'app/entities/extended-user';

@Component({
    selector: 'jhi-rating-update',
    templateUrl: './rating-update.component.html'
})
export class RatingUpdateComponent implements OnInit {
    rating: IRating;
    isSaving: boolean;

    troutes: ITRoute[];

    pointinterests: IPointInterest[];

    extendedusers: IExtendedUser[];
    creationDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected ratingService: RatingService,
        protected tRouteService: TRouteService,
        protected pointInterestService: PointInterestService,
        protected extendedUserService: ExtendedUserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rating }) => {
            this.rating = rating;
            this.creationDate = this.rating.creationDate != null ? this.rating.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.tRouteService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITRoute[]>) => response.body)
            )
            .subscribe((res: ITRoute[]) => (this.troutes = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.pointInterestService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPointInterest[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPointInterest[]>) => response.body)
            )
            .subscribe((res: IPointInterest[]) => (this.pointinterests = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.rating.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.rating.id !== undefined) {
            this.subscribeToSaveResponse(this.ratingService.update(this.rating));
        } else {
            this.subscribeToSaveResponse(this.ratingService.create(this.rating));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>) {
        result.subscribe((res: HttpResponse<IRating>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackPointInterestById(index: number, item: IPointInterest) {
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
