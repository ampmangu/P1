import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from './rating.service';
import { ITRoute, TRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { IPointInterest, PointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from 'app/entities/point-interest';
import { User, UserService } from 'app/core';

@Component({
    selector: 'jhi-rating-update',
    templateUrl: './rating-update.component.html'
})
export class RatingUpdateComponent implements OnInit {
    rating: IRating;
    isSaving: boolean;

    troutes: ITRoute[];

    pointinterests: IPointInterest[];

    users: User[];
    creationDate: string;
    sub: any;
    routeTitle: any;
    routeId: any;
    route: ITRoute;
    userId: any;
    user: User;
    pointId: any;
    point: PointInterest;
    today: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected ratingService: RatingService,
        protected tRouteService: TRouteService,
        protected pointInterestService: PointInterestService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.today = formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en');
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.routeTitle = params['title'];
            this.routeId = params['routeId'];
            this.userId = params['userId'];
            this.pointId = params['pointId'];
            console.log(params);
            this.pointInterestService
                .find(this.pointId)
                .pipe(
                    filter((mayBeOk: HttpResponse<PointInterest>) => mayBeOk.ok),
                    map((response: HttpResponse<PointInterest>) => response.body)
                )
                .subscribe((res: PointInterest) => (this.point = res));
            this.userService
                .find(this.userId)
                .pipe(
                    filter((mayBeOk: HttpResponse<User>) => mayBeOk.ok),
                    map((response: HttpResponse<User>) => response.body)
                )
                .subscribe((res: User) => (this.user = res), (res: HttpErrorResponse) => this.onError(res.message));
        });

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
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<User[]>) => mayBeOk.ok),
                map((response: HttpResponse<User[]>) => response.body)
            )
            .subscribe((res: User[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.tRouteService
            .find(this.routeId)
            .pipe(
                filter((response: HttpResponse<TRoute>) => response.ok),
                map((tRoute: HttpResponse<TRoute>) => tRoute.body)
            )
            .subscribe((res: TRoute) => (this.route = res));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.rating.creationDate = moment(this.today, DATE_TIME_FORMAT);
        this.rating.user = this.user;
        if (this.route) {
            if (this.rating.belongsToRoutes) {
                this.rating.belongsToRoutes.push(this.route);
            } else {
                this.rating.belongsToRoutes = [this.route];
            }
        }
        if (this.point) {
            if (this.rating.belongsToPoints) {
                this.rating.belongsToPoints.push(this.point);
            } else {
                this.rating.belongsToPoints = [this.point];
            }
        }
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

    trackUserById(index: number, item: User) {
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
