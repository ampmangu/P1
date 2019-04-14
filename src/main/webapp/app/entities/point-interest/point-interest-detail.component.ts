import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointInterest } from 'app/shared/model/point-interest.model';

@Component({
    selector: 'jhi-point-interest-detail',
    templateUrl: './point-interest-detail.component.html'
})
export class PointInterestDetailComponent implements OnInit {
    pointInterest: IPointInterest;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ pointInterest }) => {
            this.pointInterest = pointInterest;
        });
    }

    previousState() {
        window.history.back();
    }
}
