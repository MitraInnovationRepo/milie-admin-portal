import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuService } from "app/menu/menu.service";
import { ResturantHours } from "app/shared/data/resturent-hours";
import { MessageService } from "app/shared/services/message.service";
import _ from "lodash";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface DisplayHours {
  startTime: string;
  endTime: string;
  days: Array<ResturantHours>;
}

@Component({
  selector: "app-menu-hours",
  templateUrl: "./menu-hours.component.html",
  styleUrls: ["./menu-hours.component.css"],
})
export class MenuHoursComponent implements OnInit {
  dayList: { id; name }[] = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 7, name: "Sunday" },
  ];
  workingHoursList: ResturantHours[];
  displayHourList: DisplayHours[] = [];
  isEdited: boolean = false;
  shopId: Number;

  constructor(
    private datePipe: DatePipe,
    private messageService: MessageService,
    private ngxService: NgxUiLoaderService,
    private menuService: MenuService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.ngxService.start();
    this.shopId = Number(this.route.parent.parent.snapshot.paramMap.get("id"));
    this.menuService.getShop(this.shopId).subscribe(
      (result) => {
        this.workingHoursList = result.workingHourList;
        console.log(result);

        var helper = {};
        var tempHelper = {};
        this.displayHourList = this.workingHoursList.reduce(function (r, o) {
          var key = o.startHour + "-" + o.endHour;
    
          if (!helper[key]) {
            tempHelper[key] = Object.assign({}, o);
            helper[key] = Object.assign(
              {},
              {
                startTime: o.startHour.split('T')[1],
                endTime: o.endHour.split('T')[1],
                days: [o],
              }
            ); // create a copy of o
            r.push(helper[key]);
          } else {
            helper[key].days.push(o);
          }
    
          return r;
        }, []);
      },
      (error) => {
        this.messageService.snakBarErrorMessage(error.error.message);
      }
    );
    this.ngxService.stop();

    // data = [
    //   {
    //     id: 1,
    //     startHour: "08:00",
    //     endHour: "22:00",
    //     day: 2,
    //     closedAllDay: false,
    //     status: 1,
    //     dayGroup: 0,
    //   },
    //   {
    //     id: 1,
    //     startHour: "08:00",
    //     endHour: "22:00",
    //     day: 1,
    //     closedAllDay: false,
    //     status: 1,
    //     dayGroup: 0,
    //   },
    //   {
    //     id: 1,
    //     startHour: "09:00",
    //     endHour: "22:00",
    //     day: 3,
    //     closedAllDay: false,
    //     status: 1,
    //     dayGroup: 0,
    //   },
    // ];
  }

  onClickDay(index, day) {
    if (this.checkOverlap(index, day)) {
      this.messageService.snakBarErrorMessage(
        `Not allowed to overlap ${this.dayList[day - 1].name} ${
          this.displayHourList[index].startTime
        } - ${this.displayHourList[index].endTime} working hours!`
      );
    } else {
      this.isEdited = true;
    }
  }

  addNewMenuHours() {
    this.displayHourList.push({
      startTime: "08:00",
      endTime: "22:00",
      days: [],
    });
  }

  removeWorkingHours(index) {
    this.isEdited = true;
    this.displayHourList.splice(index, 1);
  }

  updateWorkingHours() {
    if (this.validateMenuHours()) {
      let updatedWorkingHours: ResturantHours[] = [];

      this.displayHourList.forEach((el) => {
        el.days.forEach((workingHour) => {
          workingHour.startHour = this.getDateTime(el.startTime);
          workingHour.endHour = this.getDateTime(el.endTime);
          updatedWorkingHours.push(workingHour);
        });
      });

      console.log(updatedWorkingHours);
    }
  }

  changeInputValue(event, index, fieldName) {
    if (fieldName == "start") {
      this.displayHourList[index].startTime = event.target.value;
    } else {
      this.displayHourList[index].endTime = event.target.value;
    }
  }

  checkDaySelected(day, index) {
    return this.displayHourList[index].days.some((i) => i.day == day);
  }

  validateMenuHours() {
    return true;
  }

  getDateTime(hour) {
    var today = new Date();
    var startHourSplit = hour.split(":");
    var startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      startHourSplit[0],
      startHourSplit[1],
      0
    );
    return this.datePipe.transform(startDate, "yyyy-MM-ddTHH:mm:ss");
  }

  checkOverlap(index, day) {
    if (this.displayHourList.length === 0) return false;

    // let menuHours = [...this.displayHourList];
    let menuHours = _.cloneDeep(this.displayHourList);

    let dayIndex = menuHours[index].days.findIndex((i) => i.day == day);
    if (dayIndex > -1) {
      menuHours[index].days.splice(dayIndex, 1);
    } else {
      menuHours[index].days.push({
        id: null,
        startHour: menuHours[index].startTime,
        endHour: menuHours[index].startTime,
        day: day,
        closedAllDay: false,
        dayGroup: 0,
        status: 1,
      });

      menuHours.sort((timeSegment1, timeSegment2) =>
        timeSegment1.startTime.localeCompare(timeSegment2.startTime)
      );

      for (let i = 0; i < menuHours.length - 1; i++) {
        const currentMenuHour = menuHours[i];
        const nextMenuHour = menuHours[i + 1];

        let currentMenuHourDays = currentMenuHour.days.map(function (day) {
          return day["day"];
        });
        let nextMenuHourDays = nextMenuHour.days.map(function (day) {
          return day["day"];
        });

        if (
          currentMenuHourDays.some((d) => nextMenuHourDays.includes(d)) &&
          currentMenuHour.endTime >= nextMenuHour.startTime
        ) {
          return true;
        }
      }
    }

    this.displayHourList = menuHours;
    return false;
  }
}
