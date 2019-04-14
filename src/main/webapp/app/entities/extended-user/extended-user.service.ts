import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IExtendedUser } from 'app/shared/model/extended-user.model';

type EntityResponseType = HttpResponse<IExtendedUser>;
type EntityArrayResponseType = HttpResponse<IExtendedUser[]>;

@Injectable({ providedIn: 'root' })
export class ExtendedUserService {
    public resourceUrl = SERVER_API_URL + 'api/extended-users';

    constructor(protected http: HttpClient) {}

    create(extendedUser: IExtendedUser): Observable<EntityResponseType> {
        return this.http.post<IExtendedUser>(this.resourceUrl, extendedUser, { observe: 'response' });
    }

    update(extendedUser: IExtendedUser): Observable<EntityResponseType> {
        return this.http.put<IExtendedUser>(this.resourceUrl, extendedUser, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IExtendedUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IExtendedUser[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
