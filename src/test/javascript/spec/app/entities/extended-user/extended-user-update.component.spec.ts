/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { ExtendedUserUpdateComponent } from 'app/entities/extended-user/extended-user-update.component';
import { ExtendedUserService } from 'app/entities/extended-user/extended-user.service';
import { ExtendedUser } from 'app/shared/model/extended-user.model';

describe('Component Tests', () => {
    describe('ExtendedUser Management Update Component', () => {
        let comp: ExtendedUserUpdateComponent;
        let fixture: ComponentFixture<ExtendedUserUpdateComponent>;
        let service: ExtendedUserService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [ExtendedUserUpdateComponent]
            })
                .overrideTemplate(ExtendedUserUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ExtendedUserUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExtendedUserService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ExtendedUser(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.extendedUser = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ExtendedUser();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.extendedUser = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
