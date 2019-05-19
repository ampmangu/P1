import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { IPointInterest } from 'app/shared/model/point-interest.model';
import { Account, AccountService } from 'app/core';
import { JhiAlertService, JhiParseLinks } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from 'app/entities/rating';
import { filter, map } from 'rxjs/operators';
import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from 'app/entities/t-route';
import { ITEMS_PER_PAGE } from 'app/shared';
import { ITag } from 'app/shared/model/tag.model';
import { PointInterestService } from 'app/entities/point-interest/point-interest.service';

@Component({
    selector: 'jhi-point-interest-detail',
    templateUrl: './point-interest-detail.component.html',
    styleUrls: ['point-interest-detail.scss']
})
export class PointInterestDetailComponent implements OnInit {
    pointInterest: IPointInterest;
    account: Account;
    ratings: any[];
    average: number;
    routesIn: ITRoute[];
    page: any;
    links: any;
    itemsPerPage: number;
    predicate: any;
    totalItems: number;
    tags: ITag[];

    reverse: any;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        protected jhiAlertService: JhiAlertService,
        protected routesService: TRouteService,
        protected ratingService: RatingService,
        protected parseLinks: JhiParseLinks,
        protected pointService: PointInterestService,
        protected router: Router
    ) {
        this.links = {
            last: 0
        };
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.predicate = 'id';
        this.reverse = true;
        this.tags = [];
    }

    loadAll() {
        this.routesService
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

    protected paginateTRoutes(data: ITRoute[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.routesIn.push(data[i]);
        }
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    addTag() {
        this.router.navigate(['/tag/pnew', this.pointInterest.id]);
    }

    addExistingTag() {
        this.router.navigate(['/tag/pexisting', this.pointInterest.id]);
    }

    ngOnInit() {
        this.getUser();
        this.ratings = [];
        this.activatedRoute.data.subscribe(({ pointInterest }) => {
            this.pointInterest = pointInterest;
            this.routesService
                .queryByPointId(this.pointInterest.id)
                .pipe(
                    filter((mayBeOk: HttpResponse<ITRoute[]>) => mayBeOk.ok),
                    map((response: HttpResponse<ITRoute[]>) => response.body)
                )
                .subscribe((res: ITRoute[]) => (this.routesIn = res), (res: HttpErrorResponse) => this.onError(res.message));
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
                                this.ratings.push(rating);
                            }
                        }
                    }
                    if (this.ratings.length > 1) {
                        const sum = this.ratings.reduce(function(a, b) {
                            return a.score + b.score;
                        });
                        this.average = sum / this.ratings.length;
                    } else {
                        this.average = this.ratings[0].score;
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.pointService
            .queryByPointId(this.pointInterest.id)
            .pipe(
                filter((res: HttpResponse<ITag[]>) => res.ok),
                map((res: HttpResponse<ITag[]>) => res.body)
            )
            .subscribe((res: ITag[]) => {
                this.tags = res;
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

    reset() {
        this.page = 0;
        this.routesIn = [];
        // this.loadAll();
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
    goRatings() {
        this.router.navigate(['point-interest/ratings', this.pointInterest.id]);
    }
}
