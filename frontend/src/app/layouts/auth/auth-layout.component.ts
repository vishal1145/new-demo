import { Component } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, NavigationExtras, Params,NavigationEnd } from '@angular/router';
declare var $: any;

@Component({
    selector: 'auth-layout',
    templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
    hideImagePanel = false;
    constructor(private router: Router) {
    }
}
