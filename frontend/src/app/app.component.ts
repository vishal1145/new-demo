import { Component } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  user: any;
  list: any;
  alldata: any = [];
  role: any;
  cityname = { city: "delhi" };

  isLoggedIn() {
    try {
      let obj = localStorage.getItem("USER");
      if (obj && JSON.parse(obj)._id)
        return true;
      else
        return false;
    } catch (err) {
      return false;
    }
  }
  constructor(public router: Router) {
    router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf("login") > 0 || event.url.indexOf("signup") > 0) {
          if (this.isLoggedIn()) {
            let useData = localStorage.getItem("USER")
            window.location.href = "/pages/users";
          }
        }
        else {
          if (!this.isLoggedIn())
            window.location.href = "/auth/login";
          }
        }
    });
  }
}
