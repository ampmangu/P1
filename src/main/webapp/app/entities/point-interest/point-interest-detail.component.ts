import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

import {IPointInterest} from 'app/shared/model/point-interest.model';
import {Account, AccountService} from 'app/core';
import {JhiAlertService} from 'ng-jhipster';

@Component({
    selector: 'jhi-point-interest-detail',
    templateUrl: './point-interest-detail.component.html'
})
export class PointInterestDetailComponent implements OnInit {
    pointInterest: IPointInterest;
    account: Account;

    constructor(protected activatedRoute: ActivatedRoute,
                private accountService: AccountService,
                protected jhiAlertService: JhiAlertService) {
    }

    ngOnInit() {
        this.getUser();

        this.activatedRoute.data.subscribe(({pointInterest}) => {
            this.pointInterest = pointInterest;
        });
    }

    getUser() {
        this.accountService.identifyO().subscribe(response => {
            console.log(response.body);
            const account = response.body;
            if (account) {
                this.account = account;
            } else {
                this.account = account;
            }
        }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
