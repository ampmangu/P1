import { IUser } from 'app/core/user/user.model';
import { ITRoute } from 'app/shared/model/t-route.model';
import { IRating } from 'app/shared/model/rating.model';
import { IDay } from 'app/shared/model/day.model';

export interface IExtendedUser {
    id?: number;
    alias?: string;
    user?: IUser;
    createsRoutes?: ITRoute[];
    createsRatings?: IRating[];
    createsDays?: IDay[];
    followsRoutes?: ITRoute[];
}

export class ExtendedUser implements IExtendedUser {
    constructor(
        public id?: number,
        public alias?: string,
        public user?: IUser,
        public createsRoutes?: ITRoute[],
        public createsRatings?: IRating[],
        public createsDays?: IDay[],
        public followsRoutes?: ITRoute[]
    ) {}
}
