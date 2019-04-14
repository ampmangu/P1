import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITRoute } from 'app/shared/model/t-route.model';

@Component({
    selector: 'jhi-t-route-detail',
    templateUrl: './t-route-detail.component.html'
})
export class TRouteDetailComponent implements OnInit {
    tRoute: ITRoute;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tRoute }) => {
            this.tRoute = tRoute;
        });
    }

    previousState() {
        window.history.back();
    }
}
