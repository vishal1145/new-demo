import {  Component,ViewContainerRef} from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-navbar-cmp",
  templateUrl: "navbar.component.html"
})
export class NavbarComponent  {
  
  constructor(private router: Router,
    public toastr:ToastrService
  ) {
        
    }
  signOut() {
    debugger
  this.toastr.success("", 'Logout successfully');
  var self = this
 // setTimeout(()=> {
    window.localStorage.setItem("USER",null)
    window.location.href = "/auth/login";
    //self.router.navigate[("auth/login")]
  //},500)
  
 
}
}
