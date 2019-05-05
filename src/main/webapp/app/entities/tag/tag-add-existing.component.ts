import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TRouteService } from 'app/entities/t-route';
import { TagService } from 'app/entities/tag/tag.service';
import { ITRoute } from 'app/shared/model/t-route.model';
import { ITag } from 'app/shared/model/tag.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from 'app/entities/point-interest';

@Component({
    selector: 'jhi-tag-add-existing',
    templateUrl: './tag-add-existing.html'
})
export class TagAddExistingComponent implements OnInit {
    route: ITRoute;
    point: IPointInterest;
    tags: ITag[];
    sub: any;
    isSaving: boolean;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected pointInterestService: PointInterestService,
        protected routeService: TRouteService,
        protected tagService: TagService
    ) {}

    ngOnInit(): void {
        this.isSaving = false;
        this.tagService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITag[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITag[]>) => response.body)
            )
            .subscribe((res: ITag[]) => (this.tags = res));
        this.sub = this.activatedRoute.params.subscribe(params => {
            const routeId = params['routeId'];
            const pointId = params['pointId'];
            if (routeId) {
                this.routeService
                    .find(routeId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<ITRoute>) => mayBeOk.ok),
                        map((response: HttpResponse<ITRoute>) => response.body)
                    )
                    .subscribe((route: ITRoute) => {
                        this.route = route;
                        this.tagService
                            .findWithRoute(routeId)
                            .pipe(
                                filter((mayBeOk: HttpResponse<ITag[]>) => mayBeOk.ok),
                                map((response: HttpResponse<ITag[]>) => response.body)
                            )
                            .subscribe((tags: ITag[]) => {
                                this.route.tagsInRoutes = tags;
                            });
                        this.route = route;
                    });
            }
            if (pointId) {
                this.pointInterestService
                    .find(pointId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<IPointInterest>) => mayBeOk.ok),
                        map((response: HttpResponse<IPointInterest>) => response.body)
                    )
                    .subscribe((point: IPointInterest) => {
                        this.point = point;
                        this.tagService
                            .findWithPoint(pointId)
                            .pipe(
                                filter((mayBeOk: HttpResponse<ITag[]>) => mayBeOk.ok),
                                map((response: HttpResponse<ITag[]>) => response.body)
                            )
                            .subscribe((tags: ITag[]) => {
                                this.point.tagsInPointInterests = tags;
                            });
                    });
            }
        });
    }

    previousState() {
        window.history.back();
    }

    save(form: NgForm) {
        this.isSaving = true;
        const iTags: ITag[] = form.controls['field_tags'].value;
        if (this.route) {
            const route = this.route;
            for (const iTag of iTags) {
                if (iTag.tRoute === null) {
                    iTag.tRoute = route;
                    this.tagService.updateWithRoute(iTag, route.id).subscribe(null);
                } else {
                    const newtag = Object.assign({}, iTag);
                    newtag.tRoute = route;
                    newtag.id = null;
                    this.tagService.createWithRoute(newtag, route.id).subscribe(null);
                }
            }
        } else if (this.point) {
            const point = this.point;
            for (const iTag of iTags) {
                if (iTag.pointInterest === null) {
                    iTag.pointInterest = point;
                    this.tagService.updateWithPoint(iTag, point.id).subscribe(null);
                } else {
                    const newtag = Object.assign({}, iTag);
                    newtag.pointInterest = point;
                    newtag.id = null;
                    this.tagService.createWithPoint(newtag, point.id).subscribe(null);
                }
            }
        }
        this.previousState();
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITag>>) {
        result.subscribe((res: HttpResponse<ITag>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
