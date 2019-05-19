import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { ITag } from 'app/shared/model/tag.model';

type EntityResponseType = HttpResponse<IPointInterest>;
type EntityArrayResponseType = HttpResponse<IPointInterest[]>;

@Injectable({ providedIn: 'root' })
export class PointInterestService {
    public resourceUrl = SERVER_API_URL + 'api/point-interests';
    public tagUrl = SERVER_API_URL + 'api/tags/points';

    constructor(protected http: HttpClient) {}

    create(pointInterest: IPointInterest): Observable<EntityResponseType> {
        return this.http.post<IPointInterest>(this.resourceUrl, pointInterest, { observe: 'response' });
    }

    update(pointInterest: IPointInterest): Observable<EntityResponseType> {
        return this.http.put<IPointInterest>(this.resourceUrl, pointInterest, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPointInterest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPointInterest[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    queryPointsNotInRoute(idRoute: number): Observable<EntityArrayResponseType> {
        return this.http.get<IPointInterest[]>(`${this.resourceUrl}/nroute/${idRoute}`, {
            observe: 'response'
        });
    }

    queryByPointId(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<ITag[]>(`${this.tagUrl}/${id}`, { observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByRoute(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IPointInterest[]>(`${this.resourceUrl}/route/${id}`, { observe: 'response' });
    }
}
