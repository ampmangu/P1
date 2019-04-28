import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ITRoute } from 'app/shared/model/t-route.model';
import { Account, AccountService } from 'app/core';
import { JhiAlertService } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from 'app/entities/rating';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'jhi-t-route-detail',
    templateUrl: './t-route-detail.component.html',
    styleUrls: ['t-route-detail.scss']
})
export class TRouteDetailComponent implements OnInit {
    tRoute: ITRoute;
    account: Account;
    ratings: number[];
    average: number;
    constructor(
        protected activatedRoute: ActivatedRoute,
        protected jhiAlertService: JhiAlertService,
        private accountService: AccountService,
        protected ratingService: RatingService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.ratings = [];
        this.getUser();
        this.activatedRoute.data.subscribe(({ tRoute }) => {
            this.tRoute = tRoute;
        });
        this.ratingService
            .query()
            .pipe(
                filter((res: HttpResponse<IRating[]>) => res.ok),
                map((res: HttpResponse<IRating[]>) => res.body)
            )
            .subscribe(
                (res: IRating[]) => {
                    for (const rating of res) {
                        for (const routeInList of rating.belongsToRoutes) {
                            if (this.tRoute.id === routeInList.id) {
                                this.ratings.push(rating.score);
                            }
                        }
                    }
                    if (this.ratings.length) {
                        const sum = this.ratings.reduce(function(a, b) {
                            return a + b;
                        });
                        this.average = sum / this.ratings.length;
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    getUser() {
        this.accountService.identifyO().subscribe(
            response => {
                console.log(response.body);
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

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    goRate() {
        this.router.navigate(['rating/new', this.tRoute.id, this.tRoute.title, this.account.login]);
    }
}
