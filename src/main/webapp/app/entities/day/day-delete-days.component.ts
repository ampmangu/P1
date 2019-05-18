import { Component, OnInit } from '@angular/core';
import { DayService } from 'app/entities/day/day.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { IDay } from 'app/shared/model/day.model';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';

@Component({
    selector: 'jhi-day-delete-days',
    templateUrl: './day-delete-days.component.html'
})
export class DayDeleteDaysComponent implements OnInit {
    sub: any;
    isSaving: boolean;
    days: IDay[];
    routeId: number;
    route: ITRoute;

    constructor(protected activatedRoute: ActivatedRoute, protected dayService: DayService, protected routeService: TRouteService) {}

    ngOnInit(): void {
        this.sub = this.activatedRoute.params.subscribe(params => {
            const routeId = params['routeId'];
            if (routeId) {
                this.routeId = routeId;
                this.dayService
                    .queryByRoute(routeId)
                    .pipe(
                        filter((res: HttpResponse<IDay[]>) => res.ok),
                        map((res: HttpResponse<IDay[]>) => res.body)
                    )
                    .subscribe((res: IDay[]) => {
                        this.days = res;
                    });
                this.routeService
                    .find(routeId)
                    .pipe(
                        filter((mayBeOk: HttpResponse<ITRoute>) => mayBeOk.ok),
                        map((response: HttpResponse<ITRoute>) => response.body)
                    )
                    .subscribe((route: ITRoute) => {
                        this.route = route;
                    });
            }
        });
    }

    save(form: NgForm) {
        this.isSaving = true;
        const iDays: IDay[] = form.controls['field_tags'].value;
        if (this.route) {
            const route = this.route;
            for (const days of iDays) {
                console.log(days);
                this.dayService.delete(days.id).subscribe(null);
                // if (days.tRoute === null) {
                //     days.tRoute = route;
                //     this.dayService.delete(days).subscribe(null);
                // } else {
                //     const newDay = Object.assign({}, days);
                //     newDay.tRoute = route;
                //     newDay.id = null;
                //     this.dayService.delete(newDay, route.id).subscribe(null);
                // }
            }
        }
        this.previousState();
    }

    previousState() {
        window.history.back();
    }
}
