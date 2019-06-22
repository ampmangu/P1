import { Component, OnInit } from '@angular/core';
import { Account, AccountService } from 'app/core';
import { ActivatedRoute } from '@angular/router';
import { ITRoute } from 'app/shared/model/t-route.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { ITag } from 'app/shared/model/tag.model';

@Component({
    selector: 'jhi-search-results',
    templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
    searchValue: string;
    routesSearch: ITRoute[];
    pointsSearch: IPointInterest[];
    tagsSearch: ITag[];
    account: Account;

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute) {
        this.routesSearch = [];
        this.pointsSearch = [];
        this.tagsSearch = [];
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.searchValue = params['searchValue'];
            if (this.searchValue) {
                this.accountService
                    .searchRoute(this.searchValue)
                    .pipe(
                        filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                        map((response: HttpResponse<ITRoute[]>) => response.body)
                    )
                    .subscribe(
                        (result: ITRoute[]) => {
                            this.routesSearch = result;
                        },
                        error => {
                            console.log(error);
                        }
                    );
                this.accountService
                    .searchPoint(this.searchValue)
                    .pipe(
                        filter((mayBeOk: HttpResponse<IPointInterest[]>) => mayBeOk.ok),
                        map((response: HttpResponse<IPointInterest[]>) => response.body)
                    )
                    .subscribe((result: IPointInterest[]) => {
                        this.pointsSearch = result;
                    });
                this.accountService.searchTags(this.searchValue);
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
            (res: HttpErrorResponse) => console.log(res)
        );
    }

    trackRouteId(index: number, item: ITRoute) {
        return item.id;
    }

    trackPointId(index: number, item: IPointInterest) {
        return item.id;
    }

    trackTagId(index: number, item: ITag) {
        return item.id;
    }
}
