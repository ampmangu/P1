import { ITag } from 'app/shared/model/tag.model';
import { IRating } from 'app/shared/model/rating.model';

export interface IPointInterest {
    id?: number;
    name?: string;
    address?: string;
    city?: string;
    description?: string;
    tagsInPointInterests?: ITag[];
    pointHasRatings?: IRating[];
}

export class PointInterest implements IPointInterest {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public city?: string,
        public description?: string,
        public tagsInPointInterests?: ITag[],
        public pointHasRatings?: IRating[]
    ) {}
}
