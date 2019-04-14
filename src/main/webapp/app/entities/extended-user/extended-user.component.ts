import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { AccountService } from 'app/core';
import { ExtendedUserService } from './extended-user.service';

@Component({
    selector: 'jhi-extended-user',
    templateUrl: './extended-user.component.html'
})
export class ExtendedUserComponent implements OnInit, OnDestroy {
    extendedUsers: IExtendedUser[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected extendedUserService: ExtendedUserService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.extendedUserService
            .query()
            .pipe(
                filter((res: HttpResponse<IExtendedUser[]>) => res.ok),
                map((res: HttpResponse<IExtendedUser[]>) => res.body)
            )
            .subscribe(
                (res: IExtendedUser[]) => {
                    this.extendedUsers = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInExtendedUsers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IExtendedUser) {
        return item.id;
    }

    registerChangeInExtendedUsers() {
        this.eventSubscriber = this.eventManager.subscribe('extendedUserListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
