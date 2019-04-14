import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITRoute } from 'app/shared/model/t-route.model';

type EntityResponseType = HttpResponse<ITRoute>;
type EntityArrayResponseType = HttpResponse<ITRoute[]>;

@Injectable({ providedIn: 'root' })
export class TRouteService {
    public resourceUrl = SERVER_API_URL + 'api/t-routes';

    constructor(protected http: HttpClient) {}

    create(tRoute: ITRoute): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tRoute);
        return this.http
            .post<ITRoute>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(tRoute: ITRoute): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tRoute);
        return this.http
            .put<ITRoute>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITRoute>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITRoute[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(tRoute: ITRoute): ITRoute {
        const copy: ITRoute = Object.assign({}, tRoute, {
            date: tRoute.date != null && tRoute.date.isValid() ? tRoute.date.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((tRoute: ITRoute) => {
                tRoute.date = tRoute.date != null ? moment(tRoute.date) : null;
            });
        }
        return res;
    }
}