/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { TRouteUpdateComponent } from 'app/entities/t-route/t-route-update.component';
import { TRouteService } from 'app/entities/t-route/t-route.service';
import { TRoute } from 'app/shared/model/t-route.model';

describe('Component Tests', () => {
    describe('TRoute Management Update Component', () => {
        let comp: TRouteUpdateComponent;
        let fixture: ComponentFixture<TRouteUpdateComponent>;
        let service: TRouteService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [TRouteUpdateComponent]
            })
                .overrideTemplate(TRouteUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TRouteUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TRouteService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TRoute(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tRoute = entity;
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
                    const entity = new TRoute();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tRoute = entity;
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
