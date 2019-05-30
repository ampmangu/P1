import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ITRoute, TRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from './t-route.service';
import { TRouteComponent } from './t-route.component';
import { TRouteDetailComponent } from './t-route-detail.component';
import { TRouteUpdateComponent } from './t-route-update.component';
import { TRouteDeletePopupComponent } from './t-route-delete-dialog.component';
import { RatingComponent } from 'app/entities/rating';
import { RatingRouteComponent } from 'app/entities/rating/rating-route.component';

@Injectable({ providedIn: 'root' })
export class TRouteResolve implements Resolve<ITRoute> {
    constructor(private service: TRouteService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITRoute> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TRoute>) => response.ok),
                map((tRoute: HttpResponse<TRoute>) => tRoute.body)
            );
        }
        return of(new TRoute());
    }
}

export const tRouteRoute: Routes = [
    {
        path: '',
        component: TRouteComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user/:user',
        component: TRouteComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TRouteDetailComponent,
        resolve: {
            tRoute: TRouteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'ratings/:routeId',
        component: RatingRouteComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.rating.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TRouteUpdateComponent,
        resolve: {
            tRoute: TRouteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TRouteUpdateComponent,
        resolve: {
            tRoute: TRouteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const tRoutePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TRouteDeletePopupComponent,
        resolve: {
            tRoute: TRouteResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.tRoute.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
