/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { P1TestModule } from '../../../test.module';
import { ExtendedUserDetailComponent } from 'app/entities/extended-user/extended-user-detail.component';
import { ExtendedUser } from 'app/shared/model/extended-user.model';

describe('Component Tests', () => {
    describe('ExtendedUser Management Detail Component', () => {
        let comp: ExtendedUserDetailComponent;
        let fixture: ComponentFixture<ExtendedUserDetailComponent>;
        const route = ({ data: of({ extendedUser: new ExtendedUser(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [ExtendedUserDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ExtendedUserDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ExtendedUserDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.extendedUser).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
