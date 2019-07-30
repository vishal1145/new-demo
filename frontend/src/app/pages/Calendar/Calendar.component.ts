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
declare var $: any;
declare var AWS: any;
declare var ithours_client: any
declare var xlsExport: any;
declare var encodeURI: any;

export interface CalendarDate {

    mDate: moment.Moment;
    selected?: boolean;
    today?: boolean;
}
@Component({
    selector: 'pages-Calendar-cmp',
    templateUrl: './Calendar.component.html',
    styleUrls: ['./Calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnChanges {
    selectday: any;
    status: any;
    today: Date;
    user: any;
    Date: any;
    userstatus: any;
    user_id: any;
    chooseValue: any;
    quantity: any;
    // Todate: any;
    radiochecked: any;
    complainMessage: any;
    choosedeliverystatus: any;
    viewadAllvanccustomeredorder: any = [];
    DeliveryStatusArray: any = [];
    // viewadvancedorderondate:any=[];
    addadvancedorder: any;
    getuserstatus: any;
    qua: any;
    advancedordercalendar: any;
    selectdya: any;

    getdatestatus: any;
    userdatestatus: any;
    complainHide = false;
    qualityOption: any;
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
        if ((parseInt(nextmonth) - prevmonth) > 1) {
            return false
        }
        else {
            return true;
        }
    }
    displayprev() {
        var prevmonth = new Date().getMonth();
        var nextmonth = this.currentDate.format("M")
        if ((parseInt(nextmonth) - prevmonth) < 2) {
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
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const start = firstDayOfGrid.date();
        return _.range(start, start + 42)
            .map((date: number): CalendarDate => {
                const d = moment(firstDayOfGrid).date(date);
                return {
                    today: this.isToday(d),
                    selected: this.isSelected(d),
                    mDate: d,
                };
            });
    }

    openmodal(event) {
        if (this.user.role == 'CUSTOMER') {
            var clickondate = parseInt(event.target.innerHTML)
            var currdate = parseInt(moment(this.currentDate).format('DD'));

            var selectDD = event.target.innerHTML
            var currentMM = moment(this.currentDate).format("MM")
            var currentYYYY = moment(this.currentDate).format("YYYY")
            this.getdatestatus = currentMM + "-" + selectDD + "-" + currentYYYY;
            this.userdatestatus = moment(this.getdatestatus).format("MM-DD-YYYY")

            var currentMM1 = parseInt(currentMM);
            var currentYYYY1 = parseInt(currentYYYY);
            var clickeddate = clickondate + "-" + currentMM1 + "-" + currentYYYY1;
            var currdateonmonth = currdate + "-" + currentMM1 + "-" + currentYYYY1;

            if (currdateonmonth == clickeddate) {
                $('#exactstatus').modal('show')
            }
            if (currdateonmonth < clickeddate) {
                $('#advancedorder').modal('show')
            }
            if (currdateonmonth > clickeddate) {
                this.GetDeliveryStatus()
            }
        }
        if (this.user.role == 'BUSINESS') {
            var clickondate = parseInt(event.target.innerHTML)
            var currdate = parseInt(moment(this.currentDate).format('DD'));
            var selectDD = event.target.innerHTML
            var currentMM = moment(this.currentDate).format("MM")
            var currentYYYY = moment(this.currentDate).format("YYYY")
            this.getdatestatus = currentMM + "-" + selectDD + "-" + currentYYYY;
            this.userdatestatus = moment(this.getdatestatus).format("MM-DD-YYYY")
            var currentMM1 = parseInt(currentMM);
            var currentYYYY1 = parseInt(currentYYYY);
            var clickeddate = clickondate + "-" + currentMM1 + "-" + currentYYYY1;
            var currdateonmonth = currdate + "-" + currentMM1 + "-" + currentYYYY1;

            if (currdateonmonth == clickeddate) {
                $('#viewstatus').modal('show')
                this.clickondateviewadvord()
            }
            if (currdateonmonth < clickeddate) {
                this.viewadvanccustomeredorder()
            }
            if (currdateonmonth > clickeddate) {
                this.viewdeliverystatus()
            }
        }
    }

    async exactstaus() {
        $('#exactstatus').modal('hide')
        if (this.chooseValue) {
            let saveexatdata = await ithours_client.add("Delivery", { User_Id: this.user._id, Date: new Date(), Status: this.chooseValue, Complaint: this.complainMessage })
            this.exactstaus = saveexatdata.apidata.Data
            this.toastr.success('Data Saved Successfully');
        }
        else {
            alert('Please choose exact status')
            $('#exactstatus').modal('show')
        }
    }
    async GetDeliveryStatus() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        let getstatus = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        this.DeliveryStatusArray = getstatus.apidata.Data
        $('#DeliveryStatus').modal('show')
    }

    async adddeliverystatus() {
        $('#viewstatus').modal('hide')
        if (this.choosedeliverystatus) {
            let viewstatus1 = await ithours_client.add("Delivery", { User_Id: this.user._id, Date: new Date(), Status: this.choosedeliverystatus })
            this.adddeliverystatus = viewstatus1.apidata.Data
            this.toastr.success('Data Saved Successfully');
        }
        else{
            alert('Please choose delivery status')
            $('#viewstatus').modal('show')
        }
    }

    async clickondateviewadvord() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        let getadvancedstatus = await ithours_client.get("AdvancedOrder", { ToDate: { $gte: mygtToday } }, 'User_Id')
        this.viewadAllvanccustomeredorder = getadvancedstatus.apidata.Data        
    }

    async viewdeliverystatus() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        let getstatus = await ithours_client.get("Delivery", { User_Id: this.user._id, Date: { $gte: mygtToday, $lte: mylessToday } })
        this.DeliveryStatusArray = getstatus.apidata.Data
        $('#DeliveryStatus').modal('show')
    }

    async viewadvanccustomeredorder() {
        var today = new Date(this.userdatestatus);
        var mygtToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var mylessToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        //let getadvancedstatus = await ithours_client.get("AdvancedOrder", { ToDate: { $gte: mygtToday, $lte: mylessToday } },'User_Id')
        let getadvancedstatus = await ithours_client.get("AdvancedOrder", { ToDate: { $gte: mygtToday } }, 'User_Id')
        this.viewadAllvanccustomeredorder = getadvancedstatus.apidata.Data
        $('#advanccustomeredorder').modal('show')
    }

    async advancedorder() {
        $('#advancedorder').modal('hide')
        this.quantity = $('#Quantity').val()
        let advancedorder1 = await ithours_client.add("AdvancedOrder", { User_Id: this.user._id, Date: new Date(), Quantity: this.qualityOption, OneDay: this.userdatestatus, ToDate: this.advancedordercalendar })
        this.addadvancedorder = advancedorder1.apidata.Data
        this.toastr.success('Data Saved Successfully');
    }

    showBox(val) {
        this.complainHide = val
    }
}