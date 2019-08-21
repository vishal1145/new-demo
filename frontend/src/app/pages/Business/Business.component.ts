import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { async } from 'q';
import * as moment from 'moment';
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
    // this.getChartData();

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

  customer: any = [];
  delivery: any = [];
  advanceOrder = [];
  ShowTotalQuan: any;
  ShowTotalPrice: any;

  getChartData() {
      var total = 0;
      var totalPrice = 0;
      let quantity = 0;
      let quantityPrice = 0;

      var m = moment(new Date());
      const startOfMonth = m.clone().startOf('month');
      const endOfMonth = m.clone();
      var days = endOfMonth.diff(startOfMonth, 'days');

      for (var i1 = 0; i1 < this.customer.consumption.length; i1++) {
          quantity = quantity + parseInt(this.customer.consumption[i1].quantity);
          quantityPrice = quantityPrice + parseInt(this.customer.consumption[i1].prize);
      }

      for (var i = 0; i <= days; i++) {
          var dnew = startOfMonth.clone().add(i, 'day');
          var iscurrentdate = dnew.toDate();
          var index = this.delivery.findIndex(function (element: any) {
              return moment(element.Date).format("DD MM YYYY") == moment(iscurrentdate).format("DD MM YYYY")
          })
          if (index > -1) {
              var adv_index = this.advanceOrder.findIndex(function (element: any) {
                  return moment(element.ToDate).format("DD MM YYYY") == moment(iscurrentdate).format("DD MM YYYY")
              })
              if (adv_index > -1) {
                  var element = this.advanceOrder[adv_index];
                  if (element.ExtraRequire == "Extra") {
                      quantity = quantity + parseInt(element.Quantity);
                      total = total + quantity;
                      totalPrice = totalPrice + quantityPrice;
                  }
              }
              else {
                  total = total + quantity;
                  totalPrice = totalPrice + quantityPrice;
              }
          }
      }
      this.ShowTotalQuan = total;
      this.ShowTotalPrice = totalPrice;
  }

  async getQuantity() {

      // let customer = await ithours_client.getOne("User", { _id: this.user._id });
      // this.customer = customer.apidata.Data;

      // let alldelivery = await ithours_client.get("Delivery", { User_Id: this.customer.user_by, Status: "DELIVERED" });
      // this.delivery = alldelivery.apidata.Data;

      // let getquan = await ithours_client.get("AdvancedOrder", { User_Id: this.user._id });
      // this.advanceOrder = getquan.apidata.Data;
      // this.getChartData();
  }

}
