import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
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
  range: FormControl;
}

@Component({
  selector: "app-menu-hours",
  templateUrl: "./menu-hours.component.html",
  styleUrls: ["./menu-hours.component.css"],
})
export class MenuHoursComponent implements OnInit {
  dayList: { id; name; disabled }[] = [
    { id: 1, name: "Monday", disabled: false },
    { id: 2, name: "Tuesday", disabled: false },
    { id: 3, name: "Wednesday", disabled: false },
    { id: 4, name: "Thursday", disabled: false },
    { id: 5, name: "Friday", disabled: false },
    { id: 6, name: "Saturday", disabled: false },
    { id: 7, name: "Sunday", disabled: false },
  ];
  workingHoursList: ResturantHours[];
  displayHourList: DisplayHours[] = [];
  updatedWorkingHours: ResturantHours[] = [];
  isEdited: boolean = false;
  shopId: Number;

  constructor(
    private datePipe: DatePipe,
    private messageService: MessageService,
    private ngxService: NgxUiLoaderService,
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.shopId = Number(this.route.parent.parent.snapshot.paramMap.get("id"));
    this.menuService.getShop(this.shopId).subscribe(
      (result) => {
        this.workingHoursList = result.workingHourList;
        for (var i = 0; i < this.workingHoursList.length; i++) {
          if (this.workingHoursList[i].closedAllDay) {
            this.updatedWorkingHours.push(this.workingHoursList[i]);
            this.dayList[this.workingHoursList[i].day - 1].disabled = true;
          }
        }

        this.workingHoursList = this.workingHoursList.filter(
          (workingHour) => !workingHour.closedAllDay
        );

        var helper = {};
        var tempHelper = {};
        this.displayHourList = this.workingHoursList.reduce(function (r, o) {
          if (!o.closedAllDay) {
            var key = o.startHour + "-" + o.endHour;

            if (!helper[key]) {
              let splitStartHour = o.startHour.split("T")[1];
              let splitEndHour = o.endHour.split("T")[1];

              let deepSplitStartHour = splitStartHour.split(":");
              let deepSplitEndHour = splitEndHour.split(":");

              let startHourSeconds =
                +deepSplitStartHour[0] * 60 * 60 + +deepSplitStartHour[1] * 60;

              let endHourSeconds =
                +deepSplitEndHour[0] * 60 * 60 + +deepSplitEndHour[1] * 60;

              tempHelper[key] = Object.assign({}, o);
              helper[key] = Object.assign(
                {},
                {
                  startTime: splitStartHour,
                  endTime: splitEndHour,
                  days: [o],
                  range: new FormControl([startHourSeconds, endHourSeconds]),
                }
              ); // create a copy of o
              r.push(helper[key]);
            } else {
              helper[key].days.push(o);
            }

            return r;
          }
        }, []);

        if (this.displayHourList == undefined) {
          this.displayHourList = [];
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.messageService.snakBarErrorMessage(error.error.message);
      }
    );
  }

  onClickDay(index, day) {
    if (!this.dayList[index].disabled) {
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
  }

  addNewMenuHours() {
    this.displayHourList.push({
      startTime: "08:00",
      endTime: "22:00",
      days: [],
      range: new FormControl([28800, 79200]),
    });
  }

  removeWorkingHours(index) {
    this.isEdited = true;
    this.displayHourList.splice(index, 1);
  }

  updateWorkingHours() {
    if (!this.validateMenuHours(this.displayHourList)) {
      this.displayHourList.forEach((el) => {
        el.days.forEach((workingHour) => {
          workingHour.startHour = this.getDateTime(el.startTime);
          workingHour.endHour = this.getDateTime(el.endTime);
          this.updatedWorkingHours.push(workingHour);
        });
      });

      this.ngxService.start();
      this.menuService
        .updateMenuHours(this.shopId, this.updatedWorkingHours)
        .subscribe(
          (result) => {
            this.ngxService.stop();
            this.messageService.snakBarSuccessMessage(
              "You have successfully updated the menu hours"
            );
            this.isEdited = false;
          },
          (error) => {
            this.ngxService.stop();
            error.status === 400
              ? this.messageService.snakBarErrorMessage(
                  "Error in updating the menu hours"
                )
              : this.messageService.snakBarErrorMessage(error.error.message);
          }
        );
    } else {
      this.messageService.snakBarErrorMessage("Invalid Time Slots!");
    }
  }

  changeInputValue(index) {
    let deepSplitStartHour = this.displayHourList[index].startTime.split(":");
    let deepSplitEndHour = this.displayHourList[index].endTime.split(":");

    let startHourSeconds =
      +deepSplitStartHour[0] * 60 * 60 + +deepSplitStartHour[1] * 60;

    let endHourSeconds =
      +deepSplitEndHour[0] * 60 * 60 + +deepSplitEndHour[1] * 60;
    this.displayHourList[index].range = new FormControl([
      startHourSeconds,
      endHourSeconds,
    ]);

    if (this.displayHourList[index].days.length > 0) {
      this.isEdited = true;
    }
  }

  checkDaySelected(day, index) {
    return this.displayHourList[index].days.some((i) => i.day == day);
  }

  validateMenuHours(menuHoursArray) {
    let menuHours = _.cloneDeep(menuHoursArray);

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
        currentMenuHour.startTime >= currentMenuHour.endTime ||
        (currentMenuHourDays.some((d) => nextMenuHourDays.includes(d)) &&
          currentMenuHour.endTime >= nextMenuHour.startTime)
      ) {
        return true;
      }
    }

    if (menuHours.length == 1) {
      return menuHours[0].startTime >= menuHours[0].endTime;
    } else {
      return (
        menuHours[menuHours.length - 1].startTime >=
        menuHours[menuHours.length - 1].endTime
      );
    }
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

      if (this.validateMenuHours(menuHours)) {
        return true;
      }
    }
    this.displayHourList = menuHours;
    return false;
  }
}
