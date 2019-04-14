import { Moment } from 'moment';
import { ITRoute } from 'app/shared/model/t-route.model';
import { IPointInterest } from 'app/shared/model/point-interest.model';
import { IExtendedUser } from 'app/shared/model/extended-user.model';

export interface IRating {
    id?: number;
    creationDate?: Moment;
    name?: string;
    score?: number;
    belongsToRoutes?: ITRoute[];
    belongsToPoints?: IPointInterest[];
    extendedUser?: IExtendedUser;
}

export class Rating implements IRating {
    constructor(
        public id?: number,
        public creationDate?: Moment,
        public name?: string,
        public score?: number,
        public belongsToRoutes?: ITRoute[],
        public belongsToPoints?: IPointInterest[],
        public extendedUser?: IExtendedUser
    ) {}
}
