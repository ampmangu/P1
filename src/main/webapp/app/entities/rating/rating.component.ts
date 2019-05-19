import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IRating } from 'app/shared/model/rating.model';
import { Account, AccountService } from 'app/core';
import { RatingService } from './rating.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['rating.scss']
})
export class RatingComponent implements OnInit, OnDestroy {
    ratings: IRating[];
    currentAccount: any;
    eventSubscriber: Subscription;
    account: Account;
    sub: any;
    back: boolean;
    constructor(
        protected ratingService: RatingService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute
    ) {
        this.back = false;
    }

    loadAll() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            const routeId = params['routeId'];
            const pointId = params['pointId'];
            if (routeId) {
                this.back = true;
                this.ratingService
                    .queryByRoute(routeId)
                    .pipe(
                        filter((res: HttpResponse<IRating[]>) => res.ok),
                        map((res: HttpResponse<IRating[]>) => res.body)
                    )
                    .subscribe(
                        (res: IRating[]) => {
                            this.ratings = res;
                        },
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            } else if (pointId) {
                this.back = true;
                this.ratingService
                    .queryByPoint(pointId)
                    .pipe(
                        filter((res: HttpResponse<IRating[]>) => res.ok),
                        map((res: HttpResponse<IRating[]>) => res.body)
                    )
                    .subscribe(
                        (res: IRating[]) => {
                            this.ratings = res;
                        },
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            } else {
                this.ratingService
                    .query()
                    .pipe(
                        filter((res: HttpResponse<IRating[]>) => res.ok),
                        map((res: HttpResponse<IRating[]>) => res.body)
                    )
                    .subscribe(
                        (res: IRating[]) => {
                            this.ratings = res;
                        },
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            }
        });
    }

    getUser() {
        this.accountService.identifyO().subscribe(
            (response: HttpResponse<Account>) => {
                const account = response.body;
                if (account) {
                    // After retrieve the account info, the language will be changed to
                    // the user's preferred language configured in the account setting
                    this.account = account;
                } else {
                    this.account = account;
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.getUser();
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRatings();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IRating) {
        return item.id;
    }

    registerChangeInRatings() {
        this.eventSubscriber = this.eventManager.subscribe('ratingListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    previousState() {
        window.history.back();
    }
}
