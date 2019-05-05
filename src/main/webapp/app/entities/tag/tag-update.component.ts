import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITag } from 'app/shared/model/tag.model';
import { TagService } from './tag.service';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from 'app/entities/point-interest';

@Component({
    selector: 'jhi-tag-update',
    templateUrl: './tag-update.component.html',
    styleUrls: ['tag-update.scss']
})
export class TagUpdateComponent implements OnInit {
    tag: ITag;
    isSaving: boolean;

    troutes: ITRoute[];

    pointinterests: IPointInterest[];
    sub: any;
    routeId: any;
    route: ITRoute;
    pointId: any;
    point: IPointInterest;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected tagService: TagService,
        protected tRouteService: TRouteService,
        protected pointInterestService: PointInterestService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tag }) => {
            this.tag = tag;
        });
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.routeId = params['routeId'];
            this.pointId = params['pointId'];
            if (this.routeId) {
                this.tRouteService
                    .find(this.routeId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<ITRoute>) => mayBeOk.ok),
                        map((response: HttpResponse<ITRoute>) => response.body)
                    )
                    .subscribe((res: ITRoute) => (this.route = res));
            }
            if (this.pointId) {
                this.pointInterestService
                    .find(this.pointId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<IPointInterest>) => mayBeOk.ok),
                        map((response: HttpResponse<IPointInterest>) => response.body)
                    )
                    .subscribe((res: IPointInterest) => (this.point = res));
            }
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
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.route) {
            this.tag.tRoute = this.route;
        }
        if (this.point) {
            this.tag.pointInterest = this.point;
        }
        if (this.tag.id !== undefined) {
            this.subscribeToSaveResponse(this.tagService.update(this.tag));
        } else {
            this.subscribeToSaveResponse(this.tagService.create(this.tag));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITag>>) {
        result.subscribe((res: HttpResponse<ITag>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
