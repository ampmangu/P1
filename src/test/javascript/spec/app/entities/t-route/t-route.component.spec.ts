/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';

import { P1TestModule } from '../../../test.module';
import { TRouteComponent } from 'app/entities/t-route/t-route.component';
import { TRouteService } from 'app/entities/t-route/t-route.service';
import { TRoute } from 'app/shared/model/t-route.model';

describe('Component Tests', () => {
    describe('TRoute Management Component', () => {
        let comp: TRouteComponent;
        let fixture: ComponentFixture<TRouteComponent>;
        let service: TRouteService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [TRouteComponent],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            data: {
                                subscribe: (fn: (value: Data) => void) =>
                                    fn({
                                        pagingParams: {
                                            predicate: 'id',
                                            reverse: false,
                                            page: 0
                                        }
                                    })
                            }
                        }
                    }
                ]
            })
                .overrideTemplate(TRouteComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TRouteComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TRouteService);
        });

        // it('Should call load all on init', () => {
        //     // GIVEN
        //     const headers = new HttpHeaders().append('link', 'link;link');
        //     spyOn(service, 'query').and.returnValue(
        //         of(
        //             new HttpResponse({
        //                 body: [new TRoute(123)],
        //                 headers
        //             })
        //         )
        //     );
        //
        //     // WHEN
        //     comp.ngOnInit();
        //
        //     // THEN
        //     expect(service.query).toHaveBeenCalled();
        //     expect(comp.tRoutes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        // });

        it('should load a page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TRoute(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.tRoutes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('should re-initialize the page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TRoute(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);
            comp.reset();

            // THEN
            expect(comp.page).toEqual(0);
            expect(service.query).toHaveBeenCalledTimes(2);
            expect(comp.tRoutes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,asc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['name,asc', 'id']);
        });
    });
});
