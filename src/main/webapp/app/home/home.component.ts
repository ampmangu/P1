import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';

import { Account, AccountService, LoginModalService } from 'app/core';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        protected router: Router,
        protected translate: TranslateService
    ) {
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    goToRoutes() {
        this.router.navigate(['t-route/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goToPoI() {
        this.router.navigate(['point-interest/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goToRatings() {
        this.router.navigate(['rating/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goToTags() {
        this.router.navigate(['tag/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goToFollowed() {
        this.router.navigate(['t-route/user/', this.account.login]).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goPremium() {
        this.router.navigate(['t-route/premium/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    goBuyPremium() {
        this.router.navigate(['t-route/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    alertUnauthenticated() {
        this.translate.get('global.messages.info.register.loginnow').subscribe((res: String) => {
            window.alert(res);
        });
    }
}
