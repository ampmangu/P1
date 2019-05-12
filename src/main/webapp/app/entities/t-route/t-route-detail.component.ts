import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ITRoute } from 'app/shared/model/t-route.model';
import { Account, AccountService } from 'app/core';
import { JhiAlertService, JhiParseLinks } from 'ng-jhipster';
import { IRating } from 'app/shared/model/rating.model';
import { RatingService } from 'app/entities/rating';
import { filter, map } from 'rxjs/operators';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { ITEMS_PER_PAGE } from 'app/shared';
import { PointInterestService } from 'app/entities/point-interest';
import { ITag } from 'app/shared/model/tag.model';
import { TRouteService } from 'app/entities/t-route/t-route.service';

@Component({
    selector: 'jhi-t-route-detail',
    templateUrl: './t-route-detail.component.html',
    styleUrls: ['t-route-detail.scss']
})
export class TRouteDetailComponent implements OnInit {
    tRoute: ITRoute;
    account: Account;
    ratings: number[];
    average: number;
    page: any;
    links: any;
    itemsPerPage: number;
    predicate: any;
    totalItems: number;
    pointInterests: IPointInterest[];
    pointsInRoute: IPointInterest[];
    reverse: any;
    tags: ITag[];
    followed: any;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected jhiAlertService: JhiAlertService,
        private accountService: AccountService,
        protected ratingService: RatingService,
        protected pointInterestService: PointInterestService,
        protected parseLinks: JhiParseLinks,
        protected routeService: TRouteService,
        protected router: Router
    ) {
        this.pointInterests = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
        this.tags = [];
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

    reset() {
        this.page = 0;
        this.pointInterests = [];
        this.loadAll();
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

    protected paginatePointInterests(data: IPointInterest[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.pointInterests.push(data[i]);
        }
    }

    ngOnInit() {
        this.loadAll();
        this.ratings = [];
        this.getUser();
        this.activatedRoute.data.subscribe(({ tRoute }) => {
            this.tRoute = tRoute;
        });
        this.routeService
            .queryByRouteId(this.tRoute.id)
            .pipe(
                filter((res: HttpResponse<ITag[]>) => res.ok),
                map((res: HttpResponse<ITag[]>) => res.body)
            )
            .subscribe((res: ITag[]) => {
                this.tags = res;
            });
        this.pointInterestService
            .findByRoute(this.tRoute.id)
            .pipe(
                filter((res: HttpResponse<IPointInterest[]>) => res.ok),
                map((res: HttpResponse<IPointInterest[]>) => res.body)
            )
            .subscribe((res: IPointInterest[]) => {
                this.pointsInRoute = res;
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
                        if (rating.belongsToRoutes) {
                            for (const routeInList of rating.belongsToRoutes) {
                                if (this.tRoute.id === routeInList.id) {
                                    this.ratings.push(rating.score);
                                }
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

    addTag() {
        this.router.navigate(['/tag/new', this.tRoute.id]);
    }

    addExistingTag() {
        this.router.navigate(['/tag/existing', this.tRoute.id]);
    }

    contained(id) {
        if (this.tRoute.pointsInterests) {
            for (const point of this.tRoute.pointsInterests) {
                if (point.id === id) {
                    return true;
                }
            }
        }
        return false;
    }

    previousState() {
        window.history.back();
    }

    addDays() {
        this.router.navigate(['/day/route', this.tRoute.id]);
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
                this.routeService
                    // @ts-ignore
                    .isFollowed(this.tRoute.id, this.account.id)
                    .pipe(
                        filter((res: HttpResponse<Account[]>) => res.ok),
                        map((res: HttpResponse<Account[]>) => res.body)
                    )
                    .subscribe((res: Account[]) => {
                        for (const acc of res) {
                            // @ts-ignore
                            if (acc.id === this.account.id) {
                                this.followed = true;
                            }
                        }
                        if (this.followed !== true) {
                            this.followed = false;
                        }
                    });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    goRate() {
        this.router.navigate(['rating/new', this.tRoute.id, this.tRoute.title, this.account.login]);
    }

    follow() {
        // @ts-ignore
        this.routeService.follow(this.tRoute.id, this.account.id).subscribe(data => {
            location.reload();
        });
    }
}
