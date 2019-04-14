/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { PointInterestDetailComponent } from 'app/entities/point-interest/point-interest-detail.component';
import { PointInterest } from 'app/shared/model/point-interest.model';

describe('Component Tests', () => {
    describe('PointInterest Management Detail Component', () => {
        let comp: PointInterestDetailComponent;
        let fixture: ComponentFixture<PointInterestDetailComponent>;
        const route = ({ data: of({ pointInterest: new PointInterest(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [PointInterestDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PointInterestDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PointInterestDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.pointInterest).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
