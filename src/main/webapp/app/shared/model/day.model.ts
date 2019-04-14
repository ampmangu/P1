import { ITRoute } from 'app/shared/model/t-route.model';
import { IExtendedUser } from 'app/shared/model/extended-user.model';

export interface IDay {
    id?: number;
    title?: string;
    description?: string;
    tRoute?: ITRoute;
    extendedUser?: IExtendedUser;
}

export class Day implements IDay {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public tRoute?: ITRoute,
        public extendedUser?: IExtendedUser
    ) {}
}
