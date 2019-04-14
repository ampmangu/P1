/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { PointInterestUpdateComponent } from 'app/entities/point-interest/point-interest-update.component';
import { PointInterestService } from 'app/entities/point-interest/point-interest.service';
import { PointInterest } from 'app/shared/model/point-interest.model';

describe('Component Tests', () => {
    describe('PointInterest Management Update Component', () => {
        let comp: PointInterestUpdateComponent;
        let fixture: ComponentFixture<PointInterestUpdateComponent>;
        let service: PointInterestService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [PointInterestUpdateComponent]
            })
                .overrideTemplate(PointInterestUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointInterestUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointInterestService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new PointInterest(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.pointInterest = entity;
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
                    const entity = new PointInterest();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.pointInterest = entity;
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
