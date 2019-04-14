/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { P1TestModule } from '../../../test.module';
import { TRouteDeleteDialogComponent } from 'app/entities/t-route/t-route-delete-dialog.component';
import { TRouteService } from 'app/entities/t-route/t-route.service';

describe('Component Tests', () => {
    describe('TRoute Management Delete Component', () => {
        let comp: TRouteDeleteDialogComponent;
        let fixture: ComponentFixture<TRouteDeleteDialogComponent>;
        let service: TRouteService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [TRouteDeleteDialogComponent]
            })
                .overrideTemplate(TRouteDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TRouteDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TRouteService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
