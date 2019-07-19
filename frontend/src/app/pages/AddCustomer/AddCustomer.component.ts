import { Component, OnInit, NgModule, Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { Http } from "@angular/http";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { NgModel } from '@angular/forms';
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
  key: any;
  cunsuptionData: any = [];
  edit: boolean = false;
  showloader: boolean = true;
  cityError: any;
  flatNoError: any;
  userNameError: any;
  mobileError: any;
  cunsuptionError: any;
  join: any;



  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    if (this.route) {
      this.route.params.subscribe(params => {
        this.key = params['id']
      })
    }
   
    this.userData = JSON.parse(localStorage.getItem("USER"));
    if (this.key == '-1') {
      this.edit = false
      this.showloader = false
    }
    else {
      this.edit = true
      this.getCustomerDetails();
      //this.customerId = this.key
    }
  
  }

  async getCustomerDetails() {
    let customerData = await ithours_client.get("User", { _id: this.key })
    if (customerData.apidata.Data[0]) {
      this.username = customerData.apidata.Data[0].name
      this.location = customerData.apidata.Data[0].location
      this.flatNo = customerData.apidata.Data[0].flat_no
      this.landmark = customerData.apidata.Data[0].landmark
      this.city = customerData.apidata.Data[0].city
      this.mobileNo = customerData.apidata.Data[0].phone
      this.mobileColor = "#5c6873";
      this.cunsuptionData = customerData.apidata.Data[0].consumption
      this.showloader = false
    }
    else {
      this.showloader = false

    }
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
    this.cunsuptionError =''
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
    this.cunsuptionData.splice(index, 1)
  }

  async saveCustomer() {
    let isError = false
    if (this.username) {
    }
    else {
      isError = true
      this.userNameError = "Name is mandatory"
    }
    if (this.mobileNo) {
      if ((this.mobileNo).toString().length == 10) {
      }
      else {
        isError = true
        this.mobileError = "Please enter 10 digit mobile no"
      }
    }
    else {
      isError = true
      this.mobileError = "Mobile no is mandatory"
    }
    if (this.flatNo) {
    } else {
      isError = true
      this.flatNoError = 'Flat / Building name / Street name  is mandatory'
    }

    if (this.cunsuptionData.length == 0) {
      isError = true
      this.cunsuptionError = "At least one cunsuption is add"
    }
    else {
    }
    if (isError) return;
  
      if (this.username  && this.flatNo  && this.mobileNo) {
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
          this.toastr.success("", 'Customer added Successfully');
          this.router.navigate(["/pages/business"])
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
    this.mobileError = ''
    this.mobileNo = mobile
    if ((this.mobileNo).toString().length == 10) {
      this.mobileColor = "#5c6873";
    } else {
      this.mobileColor = "red";
    }
  }

  changeUserName() {
    this.userNameError = ''
  }
  changeFlatNo() {
    this.flatNoError = ''
  }
 
  changeCunsumption() {
    this.cunsuptionError = ''
  }

  async updateCustomerDetails() {
    let isError = false
    if (this.username) {
    }
    else {
      isError = true
      this.userNameError = "Name is mandatory"
    }
    if (this.mobileNo) {
      if ((this.mobileNo).toString().length == 10) {
      }
      else {
        isError = true
        this.mobileError = "Please enter 10 digit mobile no"
      }
    }
    else {
      isError = true
      this.mobileError = "Mobile no is mandatory"
    }
    if (this.flatNo) {
    } else {
      isError = true
      this.flatNoError = 'Flat / Building name / Street name  is mandatory'
    }
    
    if (this.cunsuptionData.length == 0) {
      isError = true
      this.cunsuptionError = "At least one cunsuption is add"
    }
    else {
    }
    if (isError) return;
   
    if (this.username && this.mobileNo && this.flatNo) {
        let adduser = await ithours_client.update(
          "User",
          {
            _id: this.key
          },
          {
            $set: {
              name: this.username,
              location: this.location,
              flat_no: this.flatNo,
              landmark: this.landmark,
              city: this.city,
              phone: this.mobileNo,
              consumption: this.cunsuptionData
            }
          }
        );
        if (adduser.apidata.Data) {
          this.toastr.success("", 'Customer updated Successfully');
          this.router.navigate(["/pages/business"])

        }
      }
  }
  }
 

  


