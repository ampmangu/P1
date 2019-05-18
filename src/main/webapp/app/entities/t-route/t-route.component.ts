import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { ITRoute } from 'app/shared/model/t-route.model';
import { Account, AccountService } from 'app/core';
import { ITEMS_PER_PAGE } from 'app/shared';
import { TRouteService } from './t-route.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-t-route',
    templateUrl: './t-route.component.html'
})
export class TRouteComponent implements OnInit, OnDestroy {
    tRoutes: ITRoute[];
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
        protected tRouteService: TRouteService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        protected activatedRoute: ActivatedRoute,
        private accountService: AccountService
    ) {
        this.tRoutes = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
    }

    loadAll() {
        this.activatedRoute.params.subscribe(params => {
            const user = params['user'];
            if (user) {
                this.tRouteService
                    .queryByLogin(
                        {
                            page: this.page,
                            size: this.itemsPerPage,
                            sort: this.sort()
                        },
                        user
                    )
                    .subscribe(
                        (res: HttpResponse<ITRoute[]>) => this.paginateTRoutes(res.body, res.headers),
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            } else {
                this.tRouteService
                    .query({
                        page: this.page,
                        size: this.itemsPerPage,
                        sort: this.sort()
                    })
                    .subscribe(
                        (res: HttpResponse<ITRoute[]>) => this.paginateTRoutes(res.body, res.headers),
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            }
        });
    }

    reset() {
        this.page = 0;
        this.tRoutes = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }

    ngOnInit() {
        this.getUser();
        this.loadAll();
        this.registerChangeInTRoutes();
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

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITRoute) {
        return item.id;
    }

    registerChangeInTRoutes() {
        this.eventSubscriber = this.eventManager.subscribe('tRouteListModification', response => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    protected paginateTRoutes(data: ITRoute[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.tRoutes.push(data[i]);
        }
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private saveUser(response) {
        return response.body;
    }
}
