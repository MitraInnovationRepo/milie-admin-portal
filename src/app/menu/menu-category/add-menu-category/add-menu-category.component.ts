import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DisplayHours } from "app/menu/menu-hours/menu-hours/menu-hours.component";
import { MenuService } from "app/menu/menu.service";
import { ResturantHours } from "app/shared/data/resturent-hours";
import { FileService } from "app/shared/services/file.service";
import { MessageService } from "app/shared/services/message.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import _ from "lodash";

@Component({
  selector: "add-menu-category",
  templateUrl: "./add-menu-category.component.html",
  styleUrls: ["./add-menu-category.component.css"],
})
export class AddMenuCategoryComponent implements OnInit {
  mainCategory = [];
  categoryForm: FormGroup;
  imageSrc: any;
  image: any;
  productTypeId = 0;
  buttonText = "Save";
  categoryData: any;
  selectedProductMainType: any;
  isUploadedImage: boolean = false;
  panelOpenState = false;

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
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private fileService: FileService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params) {
        this.productTypeId = params.productTypeId;
      }
    });
  }

  ngOnInit(): void {
    this.shopId = Number(this.route.parent.parent.snapshot.paramMap.get("id"));
    if (this.productTypeId > 0) {
      this.buttonText = "Update";
      this.getCategoryById(this.productTypeId);
    }
    this.categoryForm = this.formBuilder.group({
      id: [],
      productMainType: [],
      name: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      status: new FormControl(1, [Validators.required]),
      image: new FormControl("", []),
      sortingId: new FormControl(""),
      availability: new FormControl(true),
    });

    // this.getMainProductTypeList();
    this.categoryForm.patchValue({
      sortingId: 1,
    });
  }

  getMainProductTypeList() {
    this.ngxService.start();
    this.menuService.getMainProductTypes().subscribe(
      (res) => {
        this.ngxService.stop();
        this.mainCategory = res;
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  getCategoryById(id: number) {
    this.ngxService.start();
    this.menuService.getCategoryById(id).subscribe(
      (res) => {
        this.ngxService.stop();
        this.categoryData = res;
        this.setFormData(this.categoryData);

        this.workingHoursList = res.productTypeHourList;
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
      },

      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  setFormData(data: any) {
    this.categoryForm.patchValue({
      productMainType: data.categoryId,
      name: data.name,
      description: data.description,
      status: data.status,
      image: data.image,
      sortingId: data.sortingId,
      availability: !data.availability,
    });
    this.imageSrc = data.image;
    this.image = data.image;
    this.selectedProductMainType = data.productMainType?.id;
  }

  handleFileInput(files: FileList) {
    var file = files.item(0);
    console.log(files);
    if (
      !file.name.toLowerCase().endsWith(".jpg") &&
      !file.name.toLowerCase().endsWith(".jpeg") &&
      !file.name.toLowerCase().endsWith(".png")
    ) {
      this.messageService.snakBarErrorMessage("Invalid Image File");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    this.ngxService.start();
    this.fileService.uploadFile(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        this.image = res;
        this.imageSrc = res;
        this.isUploadedImage = true;
        this.messageService.snakBarSuccessMessage("Image Uploaded");
      },
      (err) => {
        this.ngxService.stop();
        this.messageService.snakBarErrorMessage("Image Upload Fail.");
      }
    );
  }

  onFormSubmit(data: any, duplicate: boolean) {
    this.ngxService.start();
    data.image = this.image;
    data.availability = !data.availability;
    data.productMainType = null;
    data.productTypeHourList = data.availability
      ? this.updateWorkingHours()
      : null;
    if (
      (data.availability && data.productTypeHourList == null) ||
      data.productTypeHourList?.length == 0
    ) {
      this.messageService.snakBarErrorMessage("Invalid Category Hours!");
      this.ngxService.stop();
      this.updatedWorkingHours = [];
      data.availability = !data.availability;
    } else {
      if (this.productTypeId > 0 && duplicate) {
        if (this.categoryData.name == data.name) {
          this.messageService.snakBarErrorMessage(
            "Please Change Category Name!"
          );
          this.ngxService.stop();
        } else {
          data.id = null;
          data.productTypeHourList.forEach(workingHour => {
            workingHour.id = null;
          });
          this.saveCategoryData(data);
        }
      } else if (this.productTypeId > 0) {
        this.updateCategoryData(this.productTypeId, data);
      } else {
        this.saveCategoryData(data);
      }
    }
  }

  saveCategoryData(data: any) {
    this.menuService.saveCategory(this.shopId, data).subscribe(
      (res) => {
        this.ngxService.stopAll();
        this.messageService.snakBarSuccessMessage(
          "Category successfully saved."
        );
        this.router.navigate([`/menu/edit/${this.shopId}/category/edit/${res}`]);
      },
      (err) => {
        this.ngxService.stopAll();
        this.messageService.snakBarErrorMessage("Failed.");
      }
    );
  }

  updateCategoryData(id: number, data: any) {
    data.id = id;
    this.menuService.updateCategory(this.shopId, data).subscribe(
      (res) => {
        this.ngxService.stopAll();
        this.messageService.snakBarSuccessMessage(
          "Category successfully updated."
        );
        this.router.navigate([`/menu/edit/${this.shopId}/category`]);
      },
      (err) => {
        this.ngxService.stopAll();
        this.messageService.snakBarErrorMessage("Failed.");
      }
    );
  }

  deleteCategoryData(id: number) {
    this.ngxService.stop();
    this.menuService.deleteCategory(id).subscribe(
      (response) => {
        this.ngxService.stop();
        if (response.operationStatus == 1) {
          this.messageService.snakBarSuccessMessage(
            "Category successfully deleted"
          );
          this.router.navigate([`/menu/edit/${this.shopId}/category`]);
        } else {
          this.messageService.snakBarErrorMessage(response.message);
        }
      },
      (error) => {
        this.ngxService.stop();
        this.messageService.snakBarErrorMessage(error.error.error_description);
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
      return this.updatedWorkingHours;
    } else {
      return null;
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
        !currentMenuHour.startTime ||
        !currentMenuHour.endTime ||
        currentMenuHour.startTime >= currentMenuHour.endTime ||
        (currentMenuHourDays.some((d) => nextMenuHourDays.includes(d)) &&
          currentMenuHour.endTime >= nextMenuHour.startTime)
      ) {
        return true;
      }
    }

    if (menuHours.length == 1) {
      return menuHours[0].startTime >= menuHours[0].endTime;
    } else if (menuHours != 0) {
      return (
        menuHours[menuHours.length - 1].startTime >=
        menuHours[menuHours.length - 1].endTime
      );
    } else {
      return true;
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
