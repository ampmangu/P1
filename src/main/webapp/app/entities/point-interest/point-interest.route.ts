import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from './point-interest.service';
import { PointInterestComponent } from './point-interest.component';
import { PointInterestDetailComponent } from './point-interest-detail.component';
import { PointInterestUpdateComponent } from './point-interest-update.component';
import { PointInterestDeletePopupComponent } from './point-interest-delete-dialog.component';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestAddExistingComponent } from 'app/entities/point-interest/point-interest-add-existing.component';
import { RatingComponent } from 'app/entities/rating';

@Injectable({ providedIn: 'root' })
export class PointInterestResolve implements Resolve<IPointInterest> {
    constructor(private service: PointInterestService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPointInterest> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PointInterest>) => response.ok),
                map((pointInterest: HttpResponse<PointInterest>) => pointInterest.body)
            );
        }
        return of(new PointInterest());
    }
}

export const pointInterestRoute: Routes = [
    {
        path: '',
        component: PointInterestComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PointInterestDetailComponent,
        resolve: {
            pointInterest: PointInterestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PointInterestUpdateComponent,
        resolve: {
            pointInterest: PointInterestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'existing/:routeId',
        component: PointInterestAddExistingComponent,
        resolve: {
            pointInterest: PointInterestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'ratings/:pointId',
        component: RatingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.rating.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PointInterestUpdateComponent,
        resolve: {
            pointInterest: PointInterestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pointInterestPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PointInterestDeletePopupComponent,
        resolve: {
            pointInterest: PointInterestResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'p1App.pointInterest.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
