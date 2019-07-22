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

//declare var geocoder: any;

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
      this.getLatLong(this.location);
    }
    else {
      this.showloader = false
    }
  }

  currentMarker = null;
  selectLocation(event) {
    var self = this
    google.maps.event.addListener(self.map, 'click', function (event) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { 'latLng': event.latLng },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              var add = results[0].formatted_address;
              self.location = add
              var value = add.split(",");
              var count = value.length;
              var country = value[count - 1];
              var state = value[count - 2];
              self.city = value[count - 3];
              if (this.currentMarker) this.currentMarker.setMap(null);
              this.currentMarker = new google.maps.Marker({
                position: event.latLng,
                map: self.map,
                title: self.city
              });
            }
          }
       
        }
      );
    });

    
  }

  ngOnInit() {
   var mapProp = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
   this.map = new google.maps.Map(document.getElementById("gmap"), mapProp);
    var self = this;
      var input = document.getElementById('autocomplete');
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        self.cityError = ''
        console.log(place);
        for (var checklocation = 0; checklocation < place.address_components.length; checklocation++){
          if (place.address_components[checklocation].types[0] == "locality") {
            //console.log(place.address_components[checklocation].long_name)
            self.city = place.address_components[checklocation].long_name
          }
        }
        self.lat = place.geometry.location.lat();
        self.lng = place.geometry.location.lng();
        var myLatLng = { lat: self.lat, lng: self.lng };
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: self.map,
          title: self.city
        });

        self.map.setCenter(myLatLng);

      });


      google.maps.event.addListener(
        this.map,
        'drag',
        function (event) {
          //console.log('drag');
        });

      google.maps.event.addListener(
        this.map,
        'dragend',
        function (event) {
          //console.log('drag end');
        });
  }

  getLatLong(address) {
      address = address ;
     var  geocoder = new google.maps.Geocoder();
     if (geocoder) {
       var self = this;
        geocoder.geocode({
          'address': address
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            results[0]
            self.lat = results[0].geometry.location.lat();
            self.lng = results[0].geometry.location.lng();
            var myLatLng = { lat: self.lat, lng: self.lng };
            if (this.currentMarker) this.currentMarker.setMap(null);
            this.currentMarker = new google.maps.Marker({
                position: myLatLng,
                map: self.map,
                title: address
              });
              self.map.setCenter(myLatLng);
          }
        });
     }



     
  }
 
  checkCity() {
    return true;
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
    this.location =(<HTMLInputElement>document.getElementById('autocomplete')).value;
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

    if (this.location){

    } else {
      isError = true
      this.cityError = 'Location is mandatory'
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
    this.location = (<HTMLInputElement>document.getElementById('autocomplete')).value
    let isError = false
    if (this.username) {
    }
    else {
      isError = true
      this.userNameError = "Name is mandatory"
    }
    if (this.location) {

    } else {
      isError = true
      this.cityError = 'Location is mandatory'
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
 

  


