import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResturantHours } from 'app/shared/data/resturent-hours';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';

@Component({
  selector: 'app-add-working-hours',
  templateUrl: './add-working-hours.component.html',
  styleUrls: ['./add-working-hours.component.css']
})
export class AddWorkingHoursComponent implements OnInit {

  newHourForm: FormGroup;
  displayedColumns1: string[] = ['day', 'closed', 'opentime', 'closetime'];
  hoursSet: ResturantHours[] = this.data.hourList.slice();
  displayDays: ResturantHours[] = [];
  dataSource1 = new MatTableDataSource(this.displayDays);
  hourList: ResturantHours[] = [];
  closedAllDay: boolean = false;
  selectedDay: number;
  isUpdated: boolean = false;
  closedWeekDay: boolean = false;
  closedWeekendDay: boolean = false;
  daylist: string[] = ["", 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon - Fri', 'Sat - Sun'];

  disabledAllWeekend: boolean = false;
  disabledAllWeek: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddWorkingHoursComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      hourList: ResturantHours[],
      addHour: (hourlist: ResturantHours[]) => void
    },
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.newHourForm = this.formBuilder.group({
      closedAllDay: new FormControl(false, []),
      daylist: new FormControl("", [Validators.required]),
      startHour: new FormControl("08:00", [Validators.required]),
      endHour: new FormControl("22:00", [Validators.required]),
    });
    this.setDiaplayDays();
  }

  setFullDay() {
    this.closedAllDay = !this.closedAllDay;
    this.newHourForm.patchValue({
      startHour: this.closedAllDay ? null : "08:00",
      endHour: this.closedAllDay ? null : "22:00",
    });

    if (this.closedAllDay) {
      this.newHourForm.get('startHour').clearValidators();
      this.newHourForm.get('endHour').clearValidators();
      this.newHourForm.get('startHour').reset();
      this.newHourForm.get('endHour').reset();
    } else {
      this.newHourForm = this.formBuilder.group({
        closedAllDay: new FormControl(false, []),
        daylist: new FormControl("", [Validators.required]),
        startHour: new FormControl("08:00", [Validators.required]),
        endHour: new FormControl("22:00", [Validators.required]),
      });
    }
  }

  save() {
    this.data.addHour(this.hoursSet);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  add(hour) {
    hour.closedAllDay = this.closedAllDay;
    hour.day = this.selectedDay;

    if (hour.startHour != null && hour.endHour != null) {
      var today = new Date();

      var startHourSplit = hour.startHour.split(":");
      var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHourSplit[0], startHourSplit[1], 0);
      var startTime = this.datePipe.transform(startDate, 'yyyy-MM-ddTHH:mm:ss');

      var endHourSplit = hour.endHour.split(":");
      var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHourSplit[0], endHourSplit[1], 0);
      var endTime = this.datePipe.transform(endDate, 'yyyy-MM-ddTHH:mm:ss');
      if (this.checkValidity(startTime, endTime, hour.day)) this.setDays(hour, startTime, endTime);

    } else {
      if (this.checkValidity(startTime, endTime, hour.day)) this.setDays(hour, startTime, endTime);
    }
    this.isUpdated = true;
    this.newHourForm.reset();
    this.newHourForm.reset();
    this.newHourForm.get('startHour').setValue("08:00");
    this.newHourForm.get('endHour').setValue("22:00");
    this.closedAllDay = false;
  }


  setDays(hour, startTime, endTime) {
    if (hour.day == 8) {
      for (let index = 0; index < 5; index++) {
        this.hoursSet.push({
          id: null,
          day: 1 + index,
          closedAllDay: this.closedAllDay,
          startHour: this.closedAllDay ? null : startTime,
          endHour: this.closedAllDay ? null : endTime,
          dayGroup: 1,
          status: 1,
        });
      }
    } else if (hour.day == 9) {
      for (let index = 0; index < 2; index++) {
        this.hoursSet.push({
          id: null,
          day: 6 + index,
          closedAllDay: this.closedAllDay,
          startHour: this.closedAllDay ? null : startTime,
          endHour: this.closedAllDay ? null : endTime,
          dayGroup: 2,
          status: 1,
        });
      }
    } else {
      this.hoursSet.push({
        id: null,
        day: parseInt(hour.day),
        closedAllDay: this.closedAllDay,
        startHour: this.closedAllDay ? null : startTime,
        endHour: this.closedAllDay ? null : endTime,
        dayGroup: 0,
        status: 1,
      });
    }
    this.setDiaplayDays();
  }


  setDiaplayDays() {
    this.displayDays = this.hoursSet.slice();
    for (let index = 0; index < this.displayDays.length; index++) {
      const element = this.displayDays[index];
      if (element.dayGroup == 1 && element.day < 6) {
        var dateRange = this.displayDays.splice(this.displayDays.indexOf(element), 1).slice();
        index -= 1;
        this.disabledAllWeek = dateRange[0].closedAllDay;
        if (dateRange[0].day == 5)
          this.displayDays.push({
            id: null,
            day: 8,
            closedAllDay: dateRange[0].closedAllDay,
            startHour: dateRange[0].startHour,
            endHour: dateRange[0].endHour,
            dayGroup: 1,
            status: dateRange[0].status
          });
      } else if (element.dayGroup == 2 && element.day < 9) {
        var dateRange = this.displayDays.splice(this.displayDays.indexOf(element), 1).slice();
        index -= 1;
        this.disabledAllWeekend = dateRange[0].closedAllDay;
        if (dateRange[0].day == 6) this.displayDays.push({
          id: null,
          day: 9,
          closedAllDay: dateRange[0].closedAllDay,
          startHour: dateRange[0].startHour,
          endHour: dateRange[0].endHour,
          dayGroup: 1,
          status: dateRange[0].status
        });
      }
    }
    this.displayDays.sort((a, b) => Number(a.day) - Number(b.day));
    this.dataSource1 = new MatTableDataSource(this.displayDays);
  }

  transform(time: any): any {
    if (time != null) {
      let hour = (time.split(':'))[0]
      let min = (time.split(':'))[1]
      let part = hour >= 12 ? 'PM' : 'AM';
      min = (min + '').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour + '').length == 1 ? `0${hour}` : hour;
      return `${hour}:${min} ${part}`
    } else {
      return null;
    }
  }

  checkValidity(starttime, endtime, day2) {
    console.log(new Date(0,0,0));
    var openTime2 = starttime != null ? new Date(new Date(new Date(new Date(Date.parse(starttime)).setFullYear(2020)).setMonth(1)).setDate(1)).getTime() : null;
    var endTime2 = endtime != null ? new Date(new Date(new Date(new Date(Date.parse(endtime)).setFullYear(2020)).setMonth(1)).setDate(1)).getTime() : null;

    if (openTime2 >= endTime2 && openTime2 != null) {
      this.dialog.open(InformationDialogComponent, {
        data: {
          day: this.daylist[day2],
          openTime: null,
          closeTime: null,
          invalid: true
        }
      });
      return false;
    }

    for (let index = 0; index < this.hoursSet.length; index++) {
      var day1 = this.hoursSet[index].day
      if (day2 != day1) if (day2 < 8 || day2 == 8 && day1 > 5 || day2 == 9 && day1 < 6) continue;
      
      var openTime1 = this.hoursSet[index].startHour != null ? new Date(new Date(new Date(new Date(Date.parse(this.hoursSet[index].startHour)).setFullYear(2020)).setMonth(1)).setDate(1)).getTime() : null;
      var endTime1 = this.hoursSet[index].endHour != null ? new Date(new Date(new Date(new Date(Date.parse(this.hoursSet[index].endHour)).setFullYear(2020)).setMonth(1)).setDate(1)).getTime() : null;
      if (openTime1 == null && endTime1 == null || openTime2 == null && endTime2 == null || openTime2 >= openTime1 && openTime2 <= endTime1 ||
        openTime1 >= openTime2 && openTime1 <= endTime2) {

        var dayName;
        switch (this.hoursSet[index].dayGroup) {
          case 0:
            dayName = this.daylist[day1];
            break;
          case 1:
            dayName = this.daylist[8];
            break;
          case 2:
            dayName = this.daylist[9];
            break;
          default:
            break;
        }

        var openTime = this.hoursSet[index].startHour;
        var closeTime = this.hoursSet[index].endHour;
        this.dialog.open(InformationDialogComponent, {
          data: {
            day: dayName,
            openTime: openTime != null ? this.transform(openTime.split("T")[1]) : null,
            closeTime: closeTime != null ? this.transform(closeTime.split("T")[1]) : null,
            invalid: false
          }
        });
        return false;
      }
    };
    return true;
  }

}




