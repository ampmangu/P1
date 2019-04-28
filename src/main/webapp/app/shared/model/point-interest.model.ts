import { ITag } from 'app/shared/model/tag.model';
import { IRating } from 'app/shared/model/rating.model';
import {ITRoute} from 'app/shared/model/t-route.model';

export interface IPointInterest {
    id?: number;
    name?: string;
    address?: string;
    city?: string;
    description?: string;
    tagsInPointInterests?: ITag[];
    pointHasRatings?: IRating[];
    route?: ITRoute;
}

export class PointInterest implements IPointInterest {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public city?: string,
        public description?: string,
        public tagsInPointInterests?: ITag[],
        public pointHasRatings?: IRating[],
        public route?: ITRoute
    ) {}
}
