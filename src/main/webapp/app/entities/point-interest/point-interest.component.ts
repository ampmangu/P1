import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IPointInterest } from 'app/shared/model/point-interest.model';
import {Account, AccountService} from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { PointInterestService } from './point-interest.service';

@Component({
    selector: 'jhi-point-interest',
    templateUrl: './point-interest.component.html'
})
export class PointInterestComponent implements OnInit, OnDestroy {
    pointInterests: IPointInterest[];
    currentAccount: any;
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    reverse: any;
    totalItems: number;
    account: Account;

    constructor(
        protected pointInterestService: PointInterestService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        protected accountService: AccountService
    ) {
        this.pointInterests = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
    }

    loadAll() {
        this.pointInterestService
            .query({
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<IPointInterest[]>) => this.paginatePointInterests(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
    getUser() {
        this.accountService.identifyO().subscribe((response: HttpResponse<Account>) => {
            const account = response.body;
            if (account) {
                // After retrieve the account info, the language will be changed to
                // the user's preferred language configured in the account setting
                this.account = account;
            } else {
                this.account = account;
            }
        }, (res: HttpErrorResponse) => this.onError(res.message));
    }
    reset() {
        this.page = 0;
        this.pointInterests = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }

    ngOnInit() {
        this.getUser();
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPointInterests();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPointInterest) {
        return item.id;
    }

    registerChangeInPointInterests() {
        this.eventSubscriber = this.eventManager.subscribe('pointInterestListModification', response => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    protected paginatePointInterests(data: IPointInterest[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.pointInterests.push(data[i]);
        }
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
