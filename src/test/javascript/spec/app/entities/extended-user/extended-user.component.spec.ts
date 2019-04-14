/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { P1TestModule } from '../../../test.module';
import { ExtendedUserComponent } from 'app/entities/extended-user/extended-user.component';
import { ExtendedUserService } from 'app/entities/extended-user/extended-user.service';
import { ExtendedUser } from 'app/shared/model/extended-user.model';

describe('Component Tests', () => {
    describe('ExtendedUser Management Component', () => {
        let comp: ExtendedUserComponent;
        let fixture: ComponentFixture<ExtendedUserComponent>;
        let service: ExtendedUserService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [P1TestModule],
                declarations: [ExtendedUserComponent],
                providers: []
            })
                .overrideTemplate(ExtendedUserComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ExtendedUserComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExtendedUserService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ExtendedUser(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.extendedUsers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
