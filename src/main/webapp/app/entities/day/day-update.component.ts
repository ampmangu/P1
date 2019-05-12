import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDay } from 'app/shared/model/day.model';
import { DayService } from './day.service';
import { ITRoute, TRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { Account, AccountService, User, UserService } from 'app/core';

@Component({
    selector: 'jhi-day-update',
    templateUrl: './day-update.component.html'
})
export class DayUpdateComponent implements OnInit {
    day: IDay;
    isSaving: boolean;

    troutes: ITRoute[];

    users: User[];
    sub: any;
    routeId: any;
    route: ITRoute;
    account: Account;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected dayService: DayService,
        private accountService: AccountService,
        protected tRouteService: TRouteService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ day }) => {
            this.day = day;
        });
        this.getUser();
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.routeId = params['routeId'];
            if (this.routeId) {
                this.tRouteService
                    .find(this.routeId)
                    .pipe(
                        filter((response: HttpResponse<TRoute>) => response.ok),
                        map((tRoute: HttpResponse<TRoute>) => tRoute.body)
                    )
                    .subscribe((res: TRoute) => (this.route = res));
            }
        });
        this.tRouteService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITRoute[]>) => response.body)
            )
            .subscribe((res: ITRoute[]) => (this.troutes = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<User[]>) => mayBeOk.ok),
                map((response: HttpResponse<User[]>) => response.body)
            )
            .subscribe((res: User[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    getUser() {
        this.accountService.identifyO().subscribe(
            response => {
                const account = response.body;
                if (account) {
                    this.account = account;
                } else {
                    this.account = account;
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    save() {
        this.isSaving = true;
        if (this.day.tRoute === undefined) {
            this.day.tRoute = this.route;
        }
        if (this.day.user === undefined) {
            this.day.user = this.account;
        }
        console.log(this.day);
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

    trackUserById(index: number, item: User) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        console.log(selectedVals);
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
