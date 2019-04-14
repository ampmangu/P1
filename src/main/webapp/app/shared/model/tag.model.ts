import { ITRoute } from 'app/shared/model/t-route.model';
import { IPointInterest } from 'app/shared/model/point-interest.model';

export interface ITag {
    id?: number;
    name?: string;
    premium?: boolean;
    tRoute?: ITRoute;
    pointInterest?: IPointInterest;
}

export class Tag implements ITag {
    constructor(
        public id?: number,
        public name?: string,
        public premium?: boolean,
        public tRoute?: ITRoute,
        public pointInterest?: IPointInterest
    ) {
        this.premium = this.premium || false;
    }
}
