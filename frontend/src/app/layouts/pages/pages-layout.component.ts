import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
//import { Subscription } from 'rxjs/Subscription';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
//import { NavbarComponent } from '../../shared/navbar/navbar.component';

declare const $: any;

@Component({
    selector: 'pages-layout',
    templateUrl: './pages-layout.component.html'
})

export class PagesLayoutComponent implements OnInit {
    //private _router: Subscription;
  url: string;
  userData: any;
    location: Location;
    @ViewChild('sidebar') sidebar: any;
    //@ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor(private router: Router, private activatedRoute: ActivatedRoute,location: Location ) {
      this.location = location;
      this.userData = JSON.parse(localStorage.getItem("USER"));
    }
  
    ngOnInit() {
        //this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
        //  //this.navbar.sidebarClose();
        //});
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
       
    }
   
    gotoUsers() {
      this.router.navigate(["/pages/users"])
    }

    gotoCustomer() {
      this.router.navigate(["/pages/business"])
    }
    gotocalendar()
    {
      this.router.navigate(["/pages/calendar"])
    }
}
