import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { async } from 'q';
declare var $: any;
declare var ithours_client: any

@Component({
  selector: 'pages-Business-cmp',
  templateUrl: './Business.component.html'
})

export class BusinessComponent implements OnInit {
  userData: any;
  commisiion: any;
  allUsers: any = [];
  customerId: any;
  cunsumptionData: any = [];
  noDataAvailable =false
  showloader: boolean = true;

  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    this.userData = JSON.parse(localStorage.getItem("USER"))
    this.getAllUsers();
   // this.viewTotalQuantity();
  }

  ngOnInit() {
  }
  async getAllUsers() {
    this.showloader = true
    this.allUsers = [];
    let getUser = await ithours_client.get('User', {})
    debugger
    if (getUser.apidata.Data) {
      //this.allUsers = getUser.apidata.Data
      for (var checkUser = 0; checkUser < getUser.apidata.Data.length; checkUser++) {
        if (getUser.apidata.Data[checkUser].role == 'CUSTOMER' && getUser.apidata.Data[checkUser].user_by == this.userData._id) {
          this.allUsers.push(getUser.apidata.Data[checkUser])
          this.showloader = false;
        }
      }
      if(this.allUsers &&  this.allUsers.length == 0){
        this.noDataAvailable =true
      }
      this.showloader = false
    }
    else {
      this.toastr.error("No Data Found");
    }
  }

  addCustomer() {
    this.router.navigate(["/pages/add-customer/" + '-1'])
  }

  gotoEditCustomer(data) {
    debugger
    this.router.navigate(["/pages/add-customer/" + data._id])
  }

  openModalDeleteCustomer(data) {
    this.customerId = data._id
    $('#deleteCustomer').modal('show')
  }

  async deleteUser() {
    let getResponse = await ithours_client.delete("User", {
      id: this.customerId
    });
    debugger
    if (getResponse.apidata.Data) {
      this.toastr.success("Customer delete successfully")
      $('#deleteCustomer').modal('hide')
      this.getAllUsers();
    }

  }
  viewconsumption(value) {
    debugger
    this.commisiion = value.commision
    this.cunsumptionData = value.consumption
    $('#consumptionModal').modal('show')
  }

  viewcahrt(customer){
    this.router.navigate(["/pages/chart/"+ customer._id]);
  }

  // async viewTotalQuantity(){
  //   const totalQuan=await ithours_client.get("AdvancedOrder",{UserId:customer._id})
  //   var getQuantity=totalQuan.apidata.Data;
  //   console.log(getQuantity);
  // }
}
