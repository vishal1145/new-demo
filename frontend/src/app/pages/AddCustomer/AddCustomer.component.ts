import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { Http } from "@angular/http";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { RlTagInputModule } from 'angular2-tag-input';
import { Angular2CsvModule } from 'angular2-csv';
//import { AgmCoreModule } from '@agm/core';
declare var $: any;
declare var AWS: any;
declare var ithours_client: any
declare var xlsExport: any;
declare var encodeURI: any;
declare var google: any;

@Component({
  selector: 'pages-AddCustomer-cmp',
  templateUrl: './AddCustomer.component.html'
})

export class AddCustomerComponent implements OnInit {
  mobileColor = "red"
  username: any;
  location: any;
  flatNo: any;
  landmark: any;
  city: any;
  mobileNo: any;
  userData: any;
  allUsers: any = [];
  lat: number = 51.678418;
  lng: number = 7.809007;
  MapOptions: any;
  Map: any;
  map: any;
  brand: any;
  prize: any;
  quantity: any;
  customerId: any;
  cunsuptionData: any = [];

  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    if (this.route) {
      this.route.params.subscribe(params => {
        this.customerId = params['id']
      })
    }
    this.userData = JSON.parse(localStorage.getItem("USER"));
  
  }

  ngOnInit() {

    var mapProp = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("gmap"), mapProp);
  }

  addCunsuption() {
    debugger
    if (this.quantity && this.prize && this.brand){
      var data = {
        quantity: this.quantity,
        prize: this.prize,
        brand: this.brand
      }
      this.cunsuptionData.push(data)
      this.quantity = ''
      this.prize = ''
      this.brand = ''
    }
   
  }

  deleteCunsuption(index, data) {
    debugger
    this.cunsuptionData.splice(index, 1)
  }

  async saveCustomer() {
    if (this.username && this.location && this.flatNo && this.landmark && this.city && this.mobileNo){
      var data = {
        name: this.username,
        location: this.location,
        flat_no: this.flatNo,
        landmark: this.landmark,
        city: this.city,
        phone: this.mobileNo,
        role: 'CUSTOMER',
        consumption: this.cunsuptionData
      }
      let customerData = await ithours_client.add("User", data)
      if (customerData.apidata.Data) {
        this.username = ''
        this.location = ''
        this.flatNo = ''
        this.city = ''
        this.mobileNo = ''
        this.landmark = ''
        this.cunsuptionData = []
      }
    }
    
  }

  mobileNumberCheck(mobile) {      
  
    this.mobileNo = mobile
    if ((this.mobileNo).toString().length == 10) {
      this.mobileColor = "#5c6873";
    } else {
      this.mobileColor = "red";
    }
  }

   
  }
 

  


