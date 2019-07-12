import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { RlTagInputModule } from 'angular2-tag-input';
import { Angular2CsvModule } from 'angular2-csv';
declare var $: any;
declare var AWS: any;
declare var ithours_client: any
declare var xlsExport: any;
declare var encodeURI: any;

@Component({
  selector: 'pages-Users-cmp',
  templateUrl: './Users.component.html'
})

export class UsersComponent implements OnInit {
  userData: any;
  allUsers: any = [];

  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    this.userData = JSON.parse(localStorage.getItem("USER"));
    this.getAllUsers();
  }

  ngOnInit() {
    
  }

  async getAllUsers() {
    let getUser = await ithours_client.get('User', {})
    debugger
    if (getUser.apidata.Data) {
      this.allUsers = getUser.apidata.Data
    }
  }
  

}
