import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { IPointInterest } from 'app/shared/model/point-interest.model';
import { Account, AccountService } from 'app/core';
import { JhiAlertService } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from 'app/entities/rating';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'jhi-point-interest-detail',
    templateUrl: './point-interest-detail.component.html',
    styleUrls: ['point-interest-detail.scss']
})
export class PointInterestDetailComponent implements OnInit {
    pointInterest: IPointInterest;
    account: Account;
    ratings: number[];
    average: number;
    constructor(
        protected activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        protected jhiAlertService: JhiAlertService,
        protected ratingService: RatingService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.getUser();

        this.activatedRoute.data.subscribe(({ pointInterest }) => {
            this.pointInterest = pointInterest;
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
                        for (const pointInList of rating.belongsToPoints) {
                            if (this.pointInterest.id === pointInList.id) {
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

    previousState() {
        window.history.back();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    goRate() {
        this.router.navigate(['rating/new', this.pointInterest.id, this.account.login]);
    }
}
