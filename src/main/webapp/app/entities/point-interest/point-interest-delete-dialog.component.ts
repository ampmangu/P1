import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPointInterest } from 'app/shared/model/point-interest.model';
import { PointInterestService } from './point-interest.service';

@Component({
    selector: 'jhi-point-interest-delete-dialog',
    templateUrl: './point-interest-delete-dialog.component.html'
})
export class PointInterestDeleteDialogComponent {
    pointInterest: IPointInterest;

    constructor(
        protected pointInterestService: PointInterestService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointInterestService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'pointInterestListModification',
                content: 'Deleted an pointInterest'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-point-interest-delete-popup',
    template: ''
})
export class PointInterestDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ pointInterest }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PointInterestDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.pointInterest = pointInterest;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/point-interest', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/point-interest', { outlets: { popup: null } }]);
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
