import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

import {ITRoute} from 'app/shared/model/t-route.model';
import {Account, AccountService} from 'app/core';
import {JhiAlertService} from 'ng-jhipster';

@Component({
    selector: 'jhi-t-route-detail',
    templateUrl: './t-route-detail.component.html'
})
export class TRouteDetailComponent implements OnInit {
    tRoute: ITRoute;
    account: Account;

    constructor(protected activatedRoute: ActivatedRoute,
                protected jhiAlertService: JhiAlertService,
                private accountService: AccountService) {
    }

    ngOnInit() {
        this.getUser();
        this.activatedRoute.data.subscribe(({tRoute}) => {
            this.tRoute = tRoute;
        });
    }

    previousState() {
        window.history.back();
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

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
