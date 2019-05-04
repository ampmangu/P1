import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRating } from 'app/shared/model/rating.model';
import { Account, AccountService } from 'app/core';
import { HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-rating-detail',
    templateUrl: './rating-detail.component.html'
})
export class RatingDetailComponent implements OnInit {
    rating: IRating;
    account: Account;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        protected jhiAlertService: JhiAlertService
    ) {}

    ngOnInit() {
        this.getUser();
        this.activatedRoute.data.subscribe(({ rating }) => {
            this.rating = rating;
        });
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
    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    previousState() {
        window.history.back();
    }
}
