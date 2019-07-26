import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { ToastrService } from 'ngx-toastr';
import { Angular2CsvModule } from 'angular2-csv';
import * as moment from 'moment';
import * as _ from 'lodash';
import { getDefaultService } from 'selenium-webdriver/opera';
import { getLocaleDateFormat } from '@angular/common';
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
    status: any;
    showloader = true
    today: Date;
    complainHide=false;
   
   




    currentDate = moment();

    dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    weeks: CalendarDate[][] = [];

    sortedDates: CalendarDate[] = [];



    @Input() selectedDates: CalendarDate[] = [];

    @Output() onSelectDate = new EventEmitter<CalendarDate>();



    constructor(private http: Http, private router: Router,
        private route: ActivatedRoute, public toastr: ToastrService) {
            var self  = this
            setTimeout(()=>{
                self.showloader = false
            }, 500)
        // this.getdate();
        this.today=new Date();




    }



    ngOnInit(): void {

        this.generateCalendar();
        

    }
    // async getdate() {

    // }



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

        //     debugger
        //     var check = moment(new Date(), 'YYYY/MM/DD');

        //     var currmonth:any = check.format('M');
        //     var month:any = moment(this.currentDate).add(1, 'months');
        //     if(month == (currmonth + 1)) {
        //   return true
        //     } else {
        //         return false
        //     }

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

        // var check = moment(new Date(), 'YYYY/MM/DD');
        //  var currmonth:any = check.format('M');
        // var date:any = moment(this.currentDate).subtract(1,'months');
        // var month:any = new Date('YYYY/MM/DD');
        // if((month - 1) == currmonth) {
        //     return true
        //       } else {
        //           return false
        //       }
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



    // generate the calendar grid



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
    openmodal(data) {
        debugger
        // alert("hlw")
        // this.status=data.status;
        $('#viewstatus').modal('show')

    }
    Savedetailstatus() {

        $('#viewstatus').modal('hide')
        $('#exactstatus').modal('show')
        // this.toastr.success('Data Saved Successfully');

    }
    exactstaus() {

        $('#exactstatus').modal('hide')
        this.toastr.success('Data Saved Successfully');

    }
    showBox(val)
    { debugger
        this.complainHide=val
    }
    

}