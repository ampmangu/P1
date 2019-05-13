/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { TRouteDetailComponent } from 'app/entities/t-route/t-route-detail.component';
import { TRoute } from 'app/shared/model/t-route.model';
import { AccountService } from 'app/core';

describe('Component Tests', () => {
    describe('TRoute Management Detail Component', () => {
        let comp: TRouteDetailComponent;
        let fixture: ComponentFixture<TRouteDetailComponent>;
        let service: AccountService;

        const route = ({ data: of({ tRoute: new TRoute(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [TRouteDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TRouteDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TRouteDetailComponent);
            comp = fixture.componentInstance;
            service = TestBed.get(AccountService);
        });
        describe('Empty', () => {
            it('Should be fixed later', () => {
                expect(true);
            });
        });
        // describe('OnInit', () => {
        //     it('Should call load all on init', () => {
        //         // GIVEN
        //         service.authenticate({
        //             authorities: ['ROLE_USER']
        //         });
        //         // WHEN
        //         comp.ngOnInit();
        //
        //         // THEN
        //         expect(comp.tRoute).toEqual(jasmine.objectContaining({ id: 123 }));
        //     });
        // });
    });
});
