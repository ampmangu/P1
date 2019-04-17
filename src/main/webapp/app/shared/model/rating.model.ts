import { Moment } from 'moment';
import { ITRoute } from 'app/shared/model/t-route.model';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import {User} from 'app/core';

export interface IRating {
    id?: number;
    creationDate?: Moment;
    name?: string;
    score?: number;
    belongsToRoutes?: ITRoute[];
    belongsToPoints?: IPointInterest[];
    user?: User;
}

export class Rating implements IRating {
    constructor(
        public id?: number,
        public creationDate?: Moment,
        public name?: string,
        public score?: number,
        public belongsToRoutes?: ITRoute[],
        public belongsToPoints?: IPointInterest[],
        public user?: User
    ) {}
}
