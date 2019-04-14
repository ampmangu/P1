import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IExtendedUser } from 'app/shared/model/extended-user.model';
import { ExtendedUserService } from './extended-user.service';

@Component({
    selector: 'jhi-extended-user-delete-dialog',
    templateUrl: './extended-user-delete-dialog.component.html'
})
export class ExtendedUserDeleteDialogComponent {
    extendedUser: IExtendedUser;

    constructor(
        protected extendedUserService: ExtendedUserService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.extendedUserService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'extendedUserListModification',
                content: 'Deleted an extendedUser'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-extended-user-delete-popup',
    template: ''
})
export class ExtendedUserDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ extendedUser }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ExtendedUserDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.extendedUser = extendedUser;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/extended-user', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/extended-user', { outlets: { popup: null } }]);
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
