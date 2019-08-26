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
  allUserId: any;
  customerId: any;
  cunsumptionData: any = [];
  noDataAvailable = false
  showloader: boolean = true;

  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    this.userData = JSON.parse(localStorage.getItem("USER"))
    this.getAllUsers();
    //this.getQuantity();
  }

  ngOnInit() {
  }
  async getAllUsers() {
    this.showloader = true
    this.allUsers = [];
    let getUser = await ithours_client.get('User', {})
    if (getUser.apidata.Data) {
      for (var checkUser = 0; checkUser < getUser.apidata.Data.length; checkUser++) {
        if (getUser.apidata.Data[checkUser].role == 'CUSTOMER' && getUser.apidata.Data[checkUser].user_by == this.userData._id) {
          this.allUsers.push(getUser.apidata.Data[checkUser])
          this.showloader = false;
        }
      }
      this.getQuantity();
      if (this.allUsers && this.allUsers.length == 0) {
        this.noDataAvailable = true
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
    this.router.navigate(["/pages/add-customer/" + data._id])
  }

  openModalDeleteCustomer(data) {
    this.customerId = data._id
    $('#deleteCustomer').modal('show')
  }

  async deleteUser() {
    let getResponse = await ithours_client.delete("User", { id: this.customerId });
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

  viewcahrt(customer) {
    this.router.navigate(["/pages/chart/" + customer._id]);
  }

  customerlist: any = [];
  deliverylist: any = [];
  advanceOrderlist = [];
  ShowTotalQuan: any;
  ShowTotalPrice: any;

  getChartData(customer, delivery,advanceOrder) {
    var total = 0;
    var totalPrice = 0;
    let quantity = 0;
    let quantityPrice = 0;

    var m = moment(new Date());
    const startOfMonth = m.clone().startOf('month');
    const endOfMonth = m.clone();
    var days = endOfMonth.diff(startOfMonth, 'days');

    for (var i1 = 0; i1 < customer.consumption.length; i1++) {
      quantity = quantity + parseInt(customer.consumption[i1].quantity);
      quantityPrice = quantityPrice + parseInt(customer.consumption[i1].prize);
    }

    for (var i = 0; i <= days; i++) {
      var dnew = startOfMonth.clone().add(i, 'day');
      var iscurrentdate = dnew.toDate();
      var index = delivery.findIndex(function (element: any) {
        return moment(element.Date).format("DD MM YYYY") == moment(iscurrentdate).format("DD MM YYYY")
      })
      if (index > -1) {
        var adv_index = advanceOrder.findIndex(function (element: any) {
          return moment(element.ToDate).format("DD MM YYYY") == moment(iscurrentdate).format("DD MM YYYY")
        })
        if (adv_index > -1) {
          var element = advanceOrder[adv_index];
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
    // this.ShowTotalQuan = total;
    // this.ShowTotalPrice = totalPrice;

    return {total, totalPrice}
  }

  async getQuantity() {

    debugger;
    var cids = (this.allUsers || []).map((c) => c._id);
    let customer = await ithours_client.get("User", { _id: { $in : cids  } });
    this.customerlist = customer.apidata.Data || [];

    let alldelivery = await ithours_client.get("Delivery", { User_Id: this.userData._id, Status: "DELIVERED" });
    this.deliverylist = alldelivery.apidata.Data;

    let getquan = await ithours_client.get("AdvancedOrder", { User_Id: { $in : cids  } });
    this.advanceOrderlist = getquan.apidata.Data || [];

   // this.getChartData();

   for(var i = 0;i < this.customerlist.length;i++){
     var corder = this.advanceOrderlist.filter((adv) => adv.User_Id == this.customerlist[i]._id);
     var output = this.getChartData(this.customerlist[i],this.deliverylist, corder || [])
     console.log(output);

     var index = this.allUsers.findIndex((u) => u._id == this.customerlist[i]._id);
     this.allUsers[index].pricing = output;
   }
  }

}
