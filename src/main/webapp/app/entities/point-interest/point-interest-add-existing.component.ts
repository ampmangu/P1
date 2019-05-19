import { Component, OnInit } from '@angular/core';
import { PointInterestService } from 'app/entities/point-interest/point-interest.service';
import { TRouteService } from 'app/entities/t-route';
import { ActivatedRoute } from '@angular/router';
import { ITRoute } from 'app/shared/model/t-route.model';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ITag } from 'app/shared/model/tag.model';

@Component({
    selector: 'jhi-point-interest-add-existing',
    templateUrl: './point-interest-add-existing.component.html',
    styleUrls: ['point-interest-add-existing.scss']
})
export class PointInterestAddExistingComponent implements OnInit {
    route: ITRoute;
    points: IPointInterest[];
    sub: any;
    isSaving: boolean;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected pointInterestService: PointInterestService,
        protected routeService: TRouteService
    ) {}

    ngOnInit(): void {
        this.isSaving = false;
        this.sub = this.activatedRoute.params.subscribe(params => {
            const routeId = params['routeId'];
            if (routeId) {
                this.routeService
                    .find(routeId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<ITRoute>) => mayBeOk.ok),
                        map((response: HttpResponse<ITRoute>) => response.body)
                    )
                    .subscribe((route: ITRoute) => {
                        this.route = route;
                    });
                this.pointInterestService
                    .queryPointsNotInRoute(routeId)
                    .pipe(
                        filter((res: HttpResponse<IPointInterest[]>) => res.ok),
                        map((res: HttpResponse<IPointInterest[]>) => res.body)
                    )
                    .subscribe((res: IPointInterest[]) => {
                        this.points = res;
                    });
            }
        });
    }
    previousState() {
        window.history.back();
    }

    save(form: NgForm) {
        this.isSaving = true;
        const iPoints: IPointInterest[] = form.controls['field_tags'].value;
        if (this.route) {
            const route = this.route;
            for (const point of iPoints) {
                if (point.route === null) {
                    point.route = route;
                    this.pointInterestService.update(point).subscribe(null);
                } else {
                    const newpoint = Object.assign({}, point);
                    newpoint.route = route;
                    newpoint.id = null;
                    this.pointInterestService.create(newpoint).subscribe(null);
                }
            }
        }
        this.previousState();
    }
}
