import { ITRoute } from 'app/shared/model/t-route.model';
import {User} from 'app/core';

export interface IDay {
    id?: number;
    title?: string;
    description?: string;
    tRoute?: ITRoute;
    user?: User;
}

export class Day implements IDay {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public tRoute?: ITRoute,
        public user?: User
    ) {}
}
