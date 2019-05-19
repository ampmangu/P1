import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRating } from 'app/shared/model/rating.model';

type EntityResponseType = HttpResponse<IRating>;
type EntityArrayResponseType = HttpResponse<IRating[]>;

@Injectable({ providedIn: 'root' })
export class RatingService {
    public resourceUrl = SERVER_API_URL + 'api/ratings';

    constructor(protected http: HttpClient) {}

    create(rating: IRating): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(rating);
        return this.http
            .post<IRating>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(rating: IRating): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(rating);
        return this.http
            .put<IRating>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IRating[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    queryByRoute(idRoute: number): Observable<EntityArrayResponseType> {
        return this.http
            .get<IRating[]>(`${this.resourceUrl}/route/${idRoute}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(rating: IRating): IRating {
        const copy: IRating = Object.assign({}, rating, {
            creationDate: rating.creationDate != null && rating.creationDate.isValid() ? rating.creationDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.creationDate = res.body.creationDate != null ? moment(res.body.creationDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((rating: IRating) => {
                rating.creationDate = rating.creationDate != null ? moment(rating.creationDate) : null;
            });
        }
        return res;
    }
}
