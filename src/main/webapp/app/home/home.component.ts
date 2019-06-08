import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { Account, AccountService, LoginModalService } from 'app/core';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    mySubscription: any;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        protected router: Router,
        protected translate: TranslateService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute
    ) {
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
        this.mySubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
        toastr.toastrConfig.preventDuplicates = true;
        toastr.toastrConfig.maxOpened = 1;
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe(data => {
            if (data.get('refresh') === 'true') {
                window.location.href = window.location.href.split('?refresh=true')[0];
                window.location.reload();
            }
        });
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerPayment();
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
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
        this.router.navigate(['getpremium/']).catch(err => {
            this.alertUnauthenticated();
        });
    }

    alertUnauthenticated() {
        this.translate.get('global.messages.info.register.loginnow').subscribe((res: String) => {
            window.alert(res);
        });
    }

    registerPayment() {
        this.eventManager.subscribe('paymentDone', response => this.processPayment(response));
    }

    processPayment(response: any): any {
        this.toastr.success(response.content);
    }
}
