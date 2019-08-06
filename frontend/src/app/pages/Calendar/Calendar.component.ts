import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { ToastrService } from 'ngx-toastr';
import { Angular2CsvModule } from 'angular2-csv';
import * as moment from 'moment';
import * as _ from 'lodash';
import { getDefaultService } from 'selenium-webdriver/opera';
import { getLocaleDateFormat } from '@angular/common';
import { getRandomString } from 'selenium-webdriver/safari';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { advanceActivatedRoute } from '@angular/router/src/router_state';
import { flatten } from '@angular/router/src/utils/collection';
declare var $: any;
declare var AWS: any;
declare var ithours_client: any
declare var xlsExport: any;
declare var encodeURI: any;

export interface CalendarDate {

    mDate: moment.Moment;
    selected?: boolean;
    today?: boolean;
    delivered?: boolean;
    notdelivered?: boolean;
    nextday_Adv_ord?: boolean;
    isAllowed?: boolean;
}
@Component({
    selector: 'pages-Calendar-cmp',
    templateUrl: './Calendar.component.html',
    styleUrls: ['./Calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnChanges {
    selectday = "ONEDAY";
    status: any;
    showloader = true
    today: Date;
    AllDeliveries: any;
    user: any;
    adddeliverystatus: any;
    addcusadvancedord: any;
    Date: any;
    ExtraMilk: any;
    userstatus: any;
    user_id: any;
    Getadvday_order: any;
    chooseValue: any;
    Clickedorderdate:any;
    quantity: any;
    complainMessage: any = "";
    choosedeliverystatus = "DELIVERED";
    viewadAllvanccustomeredorder: any = [];
    DeliveryStatusArray: any = [];
    getadvanced_Or: any = [];
    Getbusideliverysta: any = [];
    qua: any;
    advancedordercalendar: any;
    userdatestatus: any;
    datefordeleivery: any;
    showdeliveryforadd: any;
    complainHide = false;
    displayadvancebox = false;
    UpdateBoxopen=false;
    updateshowbox = false;
    Upshowbox = false;
    morethanoneday = false;
    qualityOption = "1";
    currentDate = moment();
    quantitys = [
        { qua: '1' },
        { qua: '1.5' },
        { qua: '2' },
        { qua: '2.5' },
        { qua: '3' },
        { qua: '3.5' },
        { qua: '4' },
        { qua: '4.5' },
        { qua: '5' },
        { qua: '5.5' },
        { qua: '6' },
        { qua: '6.5' },
        { qua: '7' },
        { qua: '7.5' },
        { qua: '8' },
        { qua: '8.5' },
        { qua: '9' },
        { qua: '9.5' },
        { qua: '10' },
        { qua: '10.5' }
    ];

    dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    weeks: CalendarDate[][] = [];
    sortedDates: CalendarDate[] = [];
    @Input() selectedDates: CalendarDate[] = [];
    @Output() onSelectDate = new EventEmitter<CalendarDate>();

    constructor(private http: Http, private router: Router,
        private route: ActivatedRoute, public toastr: ToastrService) {
        this.today = new Date();
        this.user = JSON.parse(window.localStorage.getItem('USER'));
        this.GetAllDelivery();
        this.Getadv_order();
    }

    ngOnInit(): void {
        this.generateCalendar();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedDates &&
            changes.selectedDates.currentValue &&
            changes.selectedDates.currentValue.length > 1) {
            // sort on date changes for better performance when range checking
            this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
            this.generateCalendar();
        }
    }

    // date checkers
    isToday(date: moment.Moment): boolean {
        return moment().isSame(moment(date), 'day');
    }
    isSelected(date: moment.Moment): boolean {
        return _.findIndex(this.selectedDates, (selectedDate) => {
            return moment(date).isSame(selectedDate.mDate, 'day');
        }) > -1;
    }
    isSelectedMonth(date: moment.Moment): boolean {
        return moment(date).isSame(this.currentDate, 'month');
    }
    selectDate(date: CalendarDate): void {
        this.onSelectDate.emit(date);
    }
    // actions from calendar
    prevMonth(): void {
        this.currentDate = moment(this.currentDate).subtract(1, 'months');
        this.generateCalendar();
    }
    displaynext() {
        var prevmonth = new Date().getMonth();
        var nextmonth = this.currentDate.format("M")
        if ((parseInt(nextmonth) - prevmonth) > 2) {
            return false
        }
        else {
            return true;
        }
    }
    displayprev() {
        var prevmonth = new Date().getMonth();
        var nextmonth = this.currentDate.format("M")
        if ((parseInt(nextmonth) - prevmonth) < -5) {
            return false;
        }
        else {
            return true;
        }
    }
    nextMonth(): void {
        this.currentDate = moment(this.currentDate).add(1, 'months');
        this.generateCalendar();
    }
    firstMonth(): void {
        this.currentDate = moment(this.currentDate).startOf('year');
        this.generateCalendar();
    }
    lastMonth(): void {
        this.currentDate = moment(this.currentDate).endOf('year');
        this.generateCalendar();
    }
    prevYear(): void {
        this.currentDate = moment(this.currentDate).subtract(1, 'year');
        this.generateCalendar();
    }
    nextYear(): void {
        this.currentDate = moment(this.currentDate).add(1, 'year');
        this.generateCalendar();
    }
    generateCalendar(): void {
        const dates = this.fillDates(this.currentDate);
        const weeks: CalendarDate[][] = [];
        while (dates.length > 0) {
            weeks.push(dates.splice(0, 7));
        }
        this.weeks = weeks;

    }

    fillDates(currentMoment: moment.Moment): CalendarDate[] {
        var self = this;
        var self1 = this;
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const start = firstDayOfGrid.date();
        return _.range(start, start + 42)
            .map((date: number): CalendarDate => {
                const d = moment(firstDayOfGrid).date(date);
                var delivered = this.isDelivered(d, self);
                var notdelivered = this.isnotdelivered(d, self);
                var nextday_Adv_ord = this.isnextday_Adv_ord(d, self1);
                var isAllowed = this.isAllowed(d, self1)
                return {
                    today: this.isToday(d),
                    selected: this.isSelected(d),
                    mDate: d,
                    delivered: delivered,
                    notdelivered: notdelivered,
                    nextday_Adv_ord: nextday_Adv_ord,
                    isAllowed: isAllowed
                };
            });
    }

    isAllowed(d, self1) {

        var ma = new Date().getMonth();
        var mb = ma + 2;

        var m1 = d.month();

        if (m1 >= ma && m1 <= mb)
            return true;
        else
            return false;

    }

    isDelivered(date, current) {
        if (current && current.AllDeliveries) {
            var index = current.AllDeliveries.apidata.Data.findIndex((e) => {
                return moment(e.Date).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")
            })
            if (index > -1) {
                if (current.AllDeliveries.apidata.Data[index].Status == "DELIVERED") {
                    return true
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        } return false;
    }

    isnotdelivered(date, currentd) {
        if (currentd && currentd.AllDeliveries) {
            var index = currentd.AllDeliveries.apidata.Data.findIndex((e) => {
                return moment(e.Date).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")
            })
            if (index > -1) {
                if (currentd.AllDeliveries.apidata.Data[index].Status == "NOTDELIVERED") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        } return false;
    }

    isnextday_Adv_ord(date, advancedcurrdate) {
        if (advancedcurrdate && advancedcurrdate.Getadvday_order) {
            var index1 = advancedcurrdate.Getadvday_order.findIndex((e) => {
                return moment(e.ToDate).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")
            })
            if (index1 > -1) {
                // if (advancedcurrdate.Getadvday_order[index1].ExtraRequire == "Extra") {
                //     return true;
                // }
                // else {
                //     return false;
                // }
                 return true;
            }
            else {
                return false;
            }
        } return false;
    }
    mindateforupadte = null;
    async openmodal(day) {
        var current_cldate = moment(new Date()).format("MM-DD-YYYY")
        var clickd_date = moment(day.mDate._d).format("MM-DD-YYYY")
        this.datefordeleivery = moment(clickd_date).format("DD-MMM-YYYY")
        this.Clickedorderdate=moment(day.mDate._d).format("YYYY-MM-DD");
        this.userdatestatus = clickd_date
        var todays = new Date(this.userdatestatus);
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let statusdeli = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        let statuscusdel = await ithours_client.get("Delivery", { User_Id: this.user.user_by, Date: { $gte: mygtToday, $lte: mylessToday } })
        let getadvanced_Order = await ithours_client.get("AdvancedOrder", { User_Id: this.user._id, ToDate: { $gte: mygtToday, $lte: mylessToday } })
        if (this.user.role == 'CUSTOMER') {
            if (clickd_date == current_cldate) {
                if (statuscusdel.apidata.Data[0] == null) {
                    $('#Getbusidelstaforcus').modal('show')
                }
                else {
                    if (statuscusdel.apidata.Data[0].Status == "DELIVERED") {
                        $('#exactstatus').modal('show')
                    }
                    else {
                        $('#busiUsernotdelforcus').modal('show')
                    }
                }
            }
            if (clickd_date > current_cldate) {
                if (getadvanced_Order.apidata.Data[0] == null) {
                    this.mindateforupadte = moment(this.datefordeleivery).format('YYYY-MM-DD')
                    $('#advancedorder').modal('show')
                }
                else {
                    $('#getadva_dorder').modal('show')
                    this.getcustadvord()
                }
            }
            if (clickd_date < current_cldate) {
                this.viewdeliverystatus();
            }
        }
        if (this.user.role == 'BUSINESS') {
            if (clickd_date == current_cldate) {
                if (statusdeli.apidata.Data[0] == null) {
                    $('#viewstatus').modal('show')
                }
                else {
                    if (statusdeli.apidata.Data[0].Status == "DELIVERED") {
                        this.GetBusiDeliveryStatus()
                    }
                    else if (statusdeli.apidata.Data[0].Status == "NOTDELIVERED") {
                        this.GetBusiDeliveryStatus()
                    }
                }
            }
            if (clickd_date > current_cldate) {
                this.viewadvanccustomeredorder()
            }
        }
    }

    getDateOnly(d1) {
        if (d1) {
            var d = new Date(d1);
            var newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return newDate.getTime();
        } else
            return 0;
    }

    fromToday() {
        var d = new Date();
        var newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return newDate.getTime();
    }
    //Add Feedback of Customer User
    async exactstaus() {
        $('#exactstatus').modal('hide')
        if (this.chooseValue) {
            if (this.chooseValue == 'COMPLAINT') {
                if (this.complainMessage == "") {
                    this.toastr.error('Please enter complaint');
                }
            }
            else {
                // FIRST DELTE THE ENTRY FO THE DATE
                var all_order = await ithours_client.get("Delivery", { User_Id: this.user._id });
                var deliveries = all_order.apidata.Data || [];
                for (var i = 0; i < deliveries.length; i++) {
                    if (this.getDateOnly(deliveries[i].Date) == this.fromToday()) {
                        var id = deliveries[i]._id;
                        var idstodelete = [id];
                        await ithours_client.shared("MailerController", "DELETERECORDF", { allIds: idstodelete });
                    }
                }
                let saveexatdata = await ithours_client.add("Delivery", { User_Id: this.user._id, Date: new Date(), Status: this.chooseValue, Complaint: this.complainMessage })
                this.exactstaus = saveexatdata.apidata.Data
                this.toastr.success('Data Saved Successfully');
            }
        }
        else {
            this.toastr.error('Please choose exact status');
            $('#exactstatus').modal('show')
        }
    }

    //Update Feedback of Customer User
    async Update_Cus_feedback() {
        $('#exactstatus').modal('hide')
        if (this.chooseValue) {
            if (this.chooseValue == 'COMPLAINT') {
                if (this.complainMessage == "") {
                    this.toastr.error('Please enter complaint');
                }
            }
            else {
                let saveexatdata = await ithours_client.update("Delivery", { User_Id: this.user._id },
                    {
                        "$set": {
                            Status: this.chooseValue, Complaint: this.complainMessage
                        }
                    })
                this.exactstaus = saveexatdata.apidata.Data
                this.toastr.success('Data Updated');
            }
        }
        else {
            this.toastr.error('Please choose exact status');
            $('#exactstatus').modal('show')
        }
    }

    //Customer_User Get Advanced order for update 
    async  getcustadvord() {
        var todays = new Date(this.userdatestatus);
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let Geadvanced_Order = await ithours_client.get("AdvancedOrder", { User_Id: this.user._id, ToDate: { $gte: mygtToday, $lte: mylessToday } })
        this.getadvanced_Or = Geadvanced_Order.apidata.Data
    }

    //Get Delivery Status for Business User
    async GetBusiDeliveryStatus() {
        var todays = new Date(this.userdatestatus);
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let getstatus = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        this.DeliveryStatusArray = getstatus.apidata.Data
        $('#B_U_viewstatus').modal('show')
    }

    //GetAllDelivery used for changed the date color for Delivery/NoDelivery order. Business User
    async  GetAllDelivery() {
        this.AllDeliveries = await ithours_client.get("Delivery", { User_Id: this.user._id })
        this.generateCalendar();
    }

    //Getadv_order used for changed date color for Advanced order in business User
    async  Getadv_order() {
        var loggedUser = JSON.parse(window.localStorage.getItem('USER'));
        var sd = await ithours_client.get("AdvancedOrder", { user_by: this.user._id })
        this.Getadvday_order = sd.apidata.Data
        this.generateCalendar();
    }

    //Get business delivery status for Customer
    async  customergetdeliverysta() {
        var todays = new Date(this.userdatestatus);
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let getstatus2 = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        this.Getbusideliverysta = getstatus2.apidata.Data
    }

    // Add delivery Status for Business User 
    async adddeliverystat() {
        $('#viewstatus').modal('hide')
        var todays = new Date();
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let getdelsta = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })

        if (this.choosedeliverystatus) {
            let viewstatus1 = await ithours_client.add("Delivery", { User_Id: this.user._id, Date: new Date(), Status: this.choosedeliverystatus })
            this.adddeliverystatus = viewstatus1.apidata.Data
            this.toastr.success('Data Saved Successfully');
        }
        else {
            this.toastr.error('Please choose delivery status');
            $('#viewstatus').modal('show')
        }

    }
    // Update delivery Status for Business User 
    async update_Busi_deliverystatus() {
        var todays = new Date();
        var mygtToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 0, 0, 0);
        var mylessToday = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate(), 23, 59, 59);
        let getdelsta = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        if (getdelsta.apidata.Data[0].Status == "DELIVERED" || getdelsta.apidata.Data[0].Status == "NOTDELIVERED") {
            if (this.choosedeliverystatus) {
                let viewstatus1 = await ithours_client.update("Delivery", { User_Id: this.user._id },
                    {
                        "$set":
                        {
                            Status: this.choosedeliverystatus
                        }
                    })
                this.adddeliverystatus = viewstatus1.apidata.Data
                $('#B_U_viewstatus').modal('hide')
                this.toastr.success('Data Updated ');
            }
            else {
                this.toastr.error('Please choose delivery status');
                $('#viewstatus').modal('show')
            }
        }
    }

    //Viewdeliverystatus used for Open model Delivery Status (Business User)
    async viewdeliverystatus() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        let getstatus = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        this.DeliveryStatusArray = getstatus.apidata.Data
        $('#DeliveryStatus').modal('show')
    }

    //View Customer Advanced order for Business User
    async viewadvanccustomeredorder() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        //let getadvancedstatus = await ithours_client.get("AdvancedOrder", { ToDate: { $gte: mygtToday, $lte: mylessToday } }, 'User_Id')
        let getadvancedstatus = await ithours_client.get("AdvancedOrder", { user_by: this.user._id }, 'User_Id');
        var orders = getadvancedstatus.apidata.Data;

        var filteredorders = orders.filter((e) => {
            return moment(e.ToDate).format("YYYY-MM-DD") == moment(today).format("YYYY-MM-DD")
        })

        // let getadvancedstatus = await ithours_client.get("AdvancedOrder", { ToDate: { $gte: mygtToday } }, 'User_Id')

        this.viewadAllvanccustomeredorder = filteredorders || [];
        $('#advanccustomeredorder').modal('show')
    }

    //Add Advanced order for Customer User
    async addcusadvancedorder() {
        var loggedUser = JSON.parse(window.localStorage.getItem('USER'));
        $('#advancedorder').modal('hide')
        if (this.ExtraMilk) {
            if (this.datefordeleivery && this.advancedordercalendar) {
                var diffdays = moment(this.advancedordercalendar).diff(moment(this.datefordeleivery), 'days');
                for (var i = 0; i <= diffdays; i++) {
                    var todateselect2 = moment(this.datefordeleivery).add(i, 'days');
                    var a = todateselect2
                    this.quantity = $('#Quantity').val()
                    let advancedorder1 = await ithours_client.add("AdvancedOrder", {
                        User_Id: this.user._id,
                        Date: new Date(),
                        ExtraRequire: this.ExtraMilk,
                        Quantity: this.qualityOption,
                        FromDate: this.datefordeleivery,
                        ToDate: a,
                        user_by: loggedUser.user_by
                    })
                    this.addcusadvancedord = advancedorder1.apidata.Data
                }
                this.toastr.success('Data Saved Successfully');
            }
            else {
                this.quantity = $('#Quantity').val()
                let advancedorder2 = await ithours_client.add("AdvancedOrder", {
                    User_Id: this.user._id,
                    Date: new Date(),
                    ExtraRequire: this.ExtraMilk.toString(),
                    Quantity: this.qualityOption.toString(),
                    OneDay: this.datefordeleivery,
                    FromDate: this.datefordeleivery,
                    ToDate:this.Clickedorderdate,
                    user_by: loggedUser.user_by
                })
                this.addcusadvancedord = advancedorder2.apidata.Data
                this.toastr.success('Data Saved Successfully');
            }
        }
        else {
            this.toastr.error('Please choose Extra or No Milk');
            $('#advancedorder').modal('show')
        }
    }

    async addOrUpdateOrder(datefordeleivery, advancedordercalendar) {
        var loggedUser = JSON.parse(window.localStorage.getItem('USER'));
        if (datefordeleivery && advancedordercalendar) {
            var diffdays = moment(advancedordercalendar).diff(moment(datefordeleivery), 'days');
            for (var i = 0; i <= diffdays; i++) {
                var todateselect2 = moment(datefordeleivery).add(i, 'days');
                var a = todateselect2
                this.quantity = $('#Quantity').val()
                let advancedorder1 = await ithours_client.add("AdvancedOrder", {
                    User_Id: this.user._id,
                    Date: new Date(),
                    ExtraRequire: this.ExtraMilk,
                    Quantity: this.qualityOption,
                    FromDate: datefordeleivery,
                    ToDate: a,
                    user_by: loggedUser.user_by
                })
                this.addcusadvancedord = advancedorder1.apidata.Data
            }
            this.toastr.success('Data Saved Successfully');
        }
        else {
            this.quantity = $('#Quantity').val()            
            let advancedorder2 = await ithours_client.add("AdvancedOrder", {
                User_Id: this.user._id,
                Date: new Date(),
                ExtraRequire: this.ExtraMilk.toString(),
                Quantity: this.qualityOption.toString(),
                OneDay: new Date(datefordeleivery),
                FromDate: datefordeleivery,
                ToDate: this.Clickedorderdate,
                user_by: loggedUser.user_by
            })
            this.addcusadvancedord = advancedorder2.apidata.Data
            this.toastr.success('Data Saved Successfully');
        }
    }
    openModalUpdate() {
        $('#getadva_dorder').modal('hide')
        this.mindateforupadte = moment(this.datefordeleivery).format('YYYY-MM-DD')
        $('#Updateadvancedorder').modal('show')
    }
    //Update Advanced order for Customer User
    async Updatecusadvancedorder() {
        var fromdate = new Date(this.datefordeleivery)

        var todate = new Date(this.advancedordercalendar)
        var fromdeliverdate = new Date(fromdate.getFullYear(), fromdate.getMonth(), fromdate.getDate(), 0, 0, 0);
        var toDeliverydate = new Date(todate.getFullYear(), todate.getMonth(), todate.getDate(), 23, 59, 59);
        let all_Order = await ithours_client.get("AdvancedOrder", { User_Id: this.user._id, ToDate: { $gte: fromdeliverdate, $lte: toDeliverydate } });

        if (this.ExtraMilk) {
            var idstodelete = []
            for (var i = 0; i < all_Order.apidata.Data.length; i++) {
                var id = all_Order.apidata.Data[i]._id;
                idstodelete.push(id)
            }
            await ithours_client.shared("MailerController", "DELETEPREVIOUSRECORD", { allIds: idstodelete });
            this.addOrUpdateOrder(this.datefordeleivery, this.advancedordercalendar);
        }
        else {
            this.toastr.error('Please choose Extra or No Milk');
        }
        $('#Updateadvancedorder').modal('hide')
    }

    showBox(val) {
        this.complainHide = val
    }
    showBox1(val) {
        this.displayadvancebox = val
    }
    showBoxforUpdate(val){
        this.UpdateBoxopen=val
    }
    showBox2(val) {
        this.morethanoneday = val
    }
    showdelivery(val) {
        this.showdeliveryforadd = val
    }

    showBoxforupdate(val) {
        this.updateshowbox = val
    }
    showBoxforupdate1(val) {
        this.Upshowbox = val
    }

}