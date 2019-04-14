import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITRoute } from 'app/shared/model/t-route.model';
import { TRouteService } from './t-route.service';

@Component({
    selector: 'jhi-t-route-delete-dialog',
    templateUrl: './t-route-delete-dialog.component.html'
})
export class TRouteDeleteDialogComponent {
    tRoute: ITRoute;

    constructor(protected tRouteService: TRouteService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.tRouteService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'tRouteListModification',
                content: 'Deleted an tRoute'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-t-route-delete-popup',
    template: ''
})
export class TRouteDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tRoute }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TRouteDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.tRoute = tRoute;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/t-route', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/t-route', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
