import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { element } from '@angular/core/src/render3';

declare let CanvasJS: any;
declare var ithours_client: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  quan: any = [];
  TotalQuan: any = 0;
  calendar: any;
  user: any;
  ToQuantity: any = [];
  customer: any = [];
  delivery: any = [];
  totalquantity: any;
  ToDateAdvOrd: any = [];
  mon: any;
  chartmonth = moment(new Date).format("MMMM");
  months: any
  orders: any = [];
  graphdate = new Date();
  showloader= false;

  constructor(private route: ActivatedRoute) {
    this.user = JSON.parse(window.localStorage.getItem('User'));
    this.loadOrders();
    this.isChartMonth();
  }

  ngOnInit() {
  }

  async loadOrders() {
    this.showloader = true;
    var self = this;
    this.graphdate = new Date();
    this.orders = await this.getQuantity();
    this.showloader = false;
    setTimeout(() => {
      self.renderChart();
    }, 500);
  }

  DisplayGraph() {
    console.log(this.chartmonth);

    var a1 = moment(new Date).format("YYYY");

    var selectmonth = new Date("" + this.chartmonth + " 1 " + a1 + "");

    var d = new Date(selectmonth);
    this.graphdate = d;//new Date(d.getFullYear(), d.getMonth(), 1);
    this.renderChart();
  }

  renderChart() {
    var datatoshow = this.getData();
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "ltr Price"
      },
      axisX: {
        valueFormatString: "DD MMM",
        includeZero: true
      },
      axisY: {
        title: "Quantity",
        includeZero: true,
        // scaleBreaks: {
        //   autoCalculate: true
        // }
      },

      data: [{
        type: "line",
        xValueFormatString: "DD MMM",
        color: "#F08080",
        dataPoints: datatoshow
      }]
    });
    chart.render();
  }

  isChartMonth() {
    var m = new Date().getMonth();
    var months1 = [
      { mon: "January" },
      { mon: "February" },
      { mon: "March" },
      { mon: "April" },
      { mon: "May" },
      { mon: "June" },
      { mon: "July" },
      { mon: "August" },
      { mon: "September" },
      { mon: "October" },
      { mon: "November" },
      { mon: "December" },
    ]
    this.months = months1.splice(0, m + 1);
  }


  getData() {
    var datelist = [];
    var today = this.graphdate;
    var m = moment(today);
    var total = 0;
    const startOfMonth = m.clone().startOf('month');
    const endOfMonth = m.clone().endOf('month');
    var days = endOfMonth.diff(startOfMonth, 'days');

    let quantity = 0;
    for (var i1 = 0; i1 < this.customer.consumption.length; i1++) {
      quantity = quantity + parseInt(this.customer.consumption[i1].quantity);
    }

    for (var i = 0; i <= days; i++) {
      var dnew = startOfMonth.clone().add(i, 'day');
      var xaxis = dnew.toDate();

      var index = this.delivery.findIndex(function (element: any) {
        // return new Date(element.Date).getTime() == xaxis.getTime()
        return moment(element.Date).format("DD MM YYYY") == moment(xaxis).format("DD MM YYYY")
      })

      if (index > -1) {
        var adv_index = this.advanceOrder.findIndex(function (element: any) {
          //return new Date(element.ToDate).getTime() == xaxis.getTime()
          return moment(element.ToDate).format("DD MM YYYY") == moment(xaxis).format("DD MM YYYY")
        })

        if (adv_index > -1) {
          var element = this.advanceOrder[adv_index];
          if (element.ExtraRequire == "Extra") {
            quantity = quantity + parseInt(element.Quantity);
            datelist.push({ x: xaxis, y: quantity })
            total= total+ quantity;
          } else {
            datelist.push({ x: xaxis, y: 0 })
          }
        }
        else {
          datelist.push({ x: xaxis, y: quantity })
          total= total+ quantity;
        }
      }
      else {
        datelist.push({ x: xaxis, y: 0 })
      }
      //datelist[datelist.length -1] = {x:xaxis, y: 100 };
    }

    this.TotalQuan = total;
    return datelist;
  }

  customerid = "-1";
  advanceOrder = [];
  async getQuantity() {
    this.route.params.subscribe(params => {
      this.customerid = params['customerid']
    });

    let customer = await ithours_client.getOne("User", { _id: this.customerid });
    this.customer = customer.apidata.Data;

    let alldelivery = await ithours_client.get("Delivery", { User_Id: this.customer.user_by, Status: "DELIVERED" });
    this.delivery = alldelivery.apidata.Data;

    let getquan = await ithours_client.get("AdvancedOrder", { User_Id: this.customerid });
    this.advanceOrder = getquan.apidata.Data;
  }
};