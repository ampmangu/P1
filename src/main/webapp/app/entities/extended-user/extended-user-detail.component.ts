import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExtendedUser } from 'app/shared/model/extended-user.model';

@Component({
    selector: 'jhi-extended-user-detail',
    templateUrl: './extended-user-detail.component.html'
})
export class ExtendedUserDetailComponent implements OnInit {
    extendedUser: IExtendedUser;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ extendedUser }) => {
            this.extendedUser = extendedUser;
        });
    }

    previousState() {
        window.history.back();
    }
}
