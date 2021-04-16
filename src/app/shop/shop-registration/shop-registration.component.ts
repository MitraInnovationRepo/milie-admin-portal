import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddNewContactComponent } from '../Dialog/add-new-contact/add-new-contact.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantDeleteDialogComponent } from '../Dialog/merchant-delete-dialog/merchant-delete-dialog.component';
import { ShopService } from '../shop.service';
import { ShopType } from '../shop-type';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileService } from 'app/shared/services/file.service';
import { MessageService } from 'app/shared/services/message.service';
import { MatTableDataSource } from '@angular/material/table';
import { ContactactPerson } from 'app/shared/data/contact-person';
import { ResturantHours } from 'app/shared/data/resturent-hours';
import { AddWorkingHoursComponent } from '../Dialog/add-working-hours/add-working-hours.component';
import { Address } from 'app/shared/data/address';
import { DocumentDetails } from 'app/shared/data/document-details';
import { Merchant } from 'app/shared/data/merchant';
import { District } from 'app/shared/data/district';
import { DistrictService } from '../district.service';
import { City } from 'app/shared/data/city';
import { Bank } from 'app/shared/data/bank';
import { BankService } from '../bank.service';
import { Branch } from 'app/shared/data/branch';
import { MerchantCuisine } from 'app/shared/data/merchant-cuisine';
import { ApproveConfirmationDialogComponent } from '../Dialog/approve-confirmation-dialog/approve-confirmation-dialog.component';
import { MapsAPILoader } from '@agm/core';
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { UserService } from 'app/core/service/user.service';
import { User } from 'app/shared/data/user';
import { of } from 'rxjs';
declare var google: any;

const DOCUMENTS: DocumentDetails[] = [
  { id: null, documentType: 'Business Registration Doc', url: null },
  { id: null, documentType: 'Other', url: null }
];

@Component({
  selector: 'app-shop-registration',
  templateUrl: './shop-registration.component.html',
  styleUrls: ['./shop-registration.component.css']
})

export class ShopRegistrationComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private ngxService: NgxUiLoaderService,
    private fileService: FileService,
    private messageService: MessageService,
    private router: Router,
    private districtService: DistrictService,
    private bankService: BankService,
    private mapAPILoader: MapsAPILoader,
    private userService: UserService
  ) {
  }

  @ViewChild('search')
  public searchElementRef: ElementRef

  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;
  geocoder: any

  options: string[] = [];
  districtList: District[];
  cityList: City[] = [];
  bankList: Bank[] = [];
  branchList: Branch[] = [];

  filteredOptions: Observable<District[]>;
  filteredOptions2: Observable<City[]>;
  filteredOptions3: Observable<Bank[]>;
  filteredOptions4: Observable<Branch[]>;
  filteredOptions5: Observable<User[]>;
  filteredOptions6: Observable<User[]>;

  datalist: ContactactPerson[] = [];
  datalist1: ResturantHours[] = [];
  datalist2: DocumentDetails[] = DOCUMENTS;

  dataSource = new MatTableDataSource(this.datalist);
  dataSource2 = new MatTableDataSource(this.datalist2);
  displayedColumns: string[] = ['type', 'firstname', 'lastname', 'mobile', 'email', 'action'];
  displayedColumns1: string[] = ['day', 'closed', 'opentime', 'closetime', 'action'];
  displayedColumns2: string[] = ['docname', 'upload', 'document', 'action'];
  daylist: string[] = ["", 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon - Fri', 'Sat - Sun']

  displayDays: ResturantHours[] = [];
  dataSource1 = new MatTableDataSource(this.displayDays);

  shopForm: FormGroup;
  fileUploaded: boolean = false;
  fileUploaded1: boolean = false;
  fileUploaded2: boolean = false;

  contactUploaded: boolean;

  imageSrc: String;
  imageSrc1: String;
  documnet1: String;
  documnet2: String;
  isExisting: boolean;
  status: number;
  shopTypeList: ShopType[];
  selectedTypes: ShopType[] = [];
  selectedManager: User;
  selectedDistrict: District;
  selectedBank: Bank;
  selectedCity: City;
  selectedBranch: Branch;
  shopId: number;
  shopType: ShopType;
  id: number;
  isUpdate: boolean = true;
  isNotApprow: boolean = true;
  shopCuisineList: MerchantCuisine[] = [];
  title: string = "Add Merchant";

  prices: string[] = ['Budget', 'Average', 'Expensive'];

  ngOnInit(): void {
    this.ngxService.start();
    this.shopForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      shopCode: new FormControl({ value: '', disabled: true }, []),
      businessRegistrationNumber: new FormControl('', []),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      secondaryPhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{9}")]),
      primaryPhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{9}")]),
      email: new FormControl('', [Validators.email]),
      imageName: new FormControl('', [Validators.required]),
      shopType: new FormControl('', [Validators.required]),
      priceRange: new FormControl('', [Validators.required]),
      commission: new FormControl('', [Validators.required, Validators.pattern("^([1-9][0-9]*)$"), Validators.min(0), Validators.max(100)]),
      minimumOrderAmount: new FormControl('', [Validators.required, Validators.pattern("^([1-9][0-9]*)$")]),
      // preparationTime: new FormControl('', [Validators.required, Validators.pattern("^([1-9][0-9]*)$")]),
      minute: new FormControl(0, [Validators.required, Validators.pattern("^([0-9][0-9]*)$"), Validators.min(0), Validators.max(59)]),
      hour: new FormControl(0, [Validators.required, Validators.pattern("^([0-9][0-9]*)$")]),
      accountName: new FormControl('', []),
      accountNumber: new FormControl('', []),
      accountPassbookImage: new FormControl('', []),
      bank: new FormControl('', []),
      branch: new FormControl('', []),
      district: new FormControl('', [Validators.required]),
      accountManager: new FormControl('', [Validators.required]),
      document1: new FormControl(this.datalist2[0].documentType),
      document2: new FormControl(this.datalist2[1].documentType),
    },
    );

    this.datalist2.forEach(element => {
      element.url = null;
    });

    this.route.params.subscribe(params => {
      var data = history.state.data;
      this.isUpdate = history.state.update;
      // this.isExisting = params['id'] != null ? false : true;
    })


    this.shopService.getShopType()
      .subscribe(
        result => {
          this.shopTypeList = result;
        }
      ).add(() => {
        this.route.params.subscribe(params => {
          var id = history.state.data;
          // var id = params['id'];
          if (id != null) {
            this.shopId = id;
            this.shopService.getShop(id)
              .subscribe(
                result => {
                  this.patchValues(result);
                  this.fileUploaded = true;
                }
              );
          }
        });
      }).add(() => {
        this.districtService.getDistricts().subscribe(result => {
          this.districtList = result;
          this.districtList.sort((a, b) => Number(a.id) - Number(b.id));
          this.filteredOptions = this.shopForm.get('district').valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        })
      }).add(() => {
        this.bankService.getBanks().subscribe(result => {
          this.bankList = result;
          this.filteredOptions3 = this.shopForm.get('bank').valueChanges.pipe(
            startWith(''),
            map(value => this._filter3(value))
          );
        });
      }).add(() => {
        if (history.state.data == null) {
          this.ngxService.stop();
        }
      });

    this.filteredOptions6 = this.shopForm.get('accountManager').valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filter6(val || '')
        })
      );
  }

  findAddressByCoordinates() {
    this.geocoder.geocode(
      {
        location: {
          lat: this.latitude,
          lng: this.longitude
        }
      },
      (results, status) => {
        this.onAutocompleteSelected(results[0]);
        this.shopForm.get('location').setValue(results[0]);
        this.searchElementRef.nativeElement.value = results[0].formatted_address;
      }
    );
  }

  onAutocompleteSelected(result: PlaceResult) {
    // console.log('onAutocompleteSelected: ', result);
  }
  onLocationSelected(location: Location) {
    // console.log('onLocationSelected: ', location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

  private _filter(value: string): District[] {
    const filterValue = value != undefined ? value.toLowerCase() : '';
    return this.districtList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter2(value: string): City[] {
    const filterValue = value != undefined ? value.toLowerCase() : '';
    return this.cityList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter3(value: string): Bank[] {
    const filterValue = value != undefined ? value.toLowerCase() : '';
    return this.bankList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter4(value: string): Branch[] {
    const filterValue = value != undefined ? value.toLowerCase() : '';
    return this.branchList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter6(val: string): Observable<User[]> {
    if (!val) {
      return of();
    } else {
      return this.userService.getAllUsersByName(val)
        .pipe(
          map(response => response.filter(option => {
            return option.name.toLowerCase() != null ? option.name.toLowerCase().includes(val.toLowerCase()) : ""
          }))
        )
    }
  }

  setManager(value) {
    this.selectedManager = value;
  }
  setBranch(value) {
    this.selectedBranch = value;
  }
  setCity(value) {
    this.selectedCity = value;
  }
  setDistrict(value) {
    this.selectedDistrict = value;
    this.loadDisplayCity();
  }
  setBank(value) {
    this.selectedBank = value;
    this.loadBranch();
  }
  loadDisplayCity() {
    this.shopForm.get('city').reset();
    this.ngxService.start();
    this.districtService.getCityByDistrict(this.selectedDistrict.id).subscribe(
      result => {
        this.cityList = result;
        this.cityList.sort((a,b) => Number(a.id) - Number(b.id))
        this.filteredOptions2 = this.shopForm.get('city').valueChanges.pipe(
          startWith(''),
          map(value => this._filter2(value))
        );
        this.ngxService.stop();
      }
    );
  }

  loadBranch() {
    this.shopForm.get('branch').reset();
    this.ngxService.start();
    this.bankService.getBranchByBank(this.selectedBank.id).subscribe(
      result => {
        this.branchList = result;
        this.filteredOptions4 = this.shopForm.get('branch').valueChanges.pipe(
          startWith(''),
          map(value => this._filter4(value))
        );
        this.ngxService.stop();
      }
    );
  }


  patchValues(merchant: Merchant) {
    this.ngxService.start();
    this.title = "Update Merchant"
    if (!this.isUpdate) {
      this.title = "Merchants - Activation"
      this.isNotApprow = false;
      this.shopForm.disable();
    }
    this.id = merchant.id;
    this.status = merchant.status;
    this.imageSrc = merchant.imageName;
    this.shopForm.get('imageName').clearValidators();
    this.shopForm.get('imageName').reset();

    if (merchant.accountPassbookImage != null) {
      this.imageSrc1 = merchant.accountPassbookImage;
      this.fileUploaded1 = true;
    }
    this.datalist = merchant.contactList;
    this.contactUploaded = this.datalist.length > 0;
    this.dataSource = new MatTableDataSource(this.datalist);
    this.datalist1 = merchant.workingHourList;
    this.setDiaplayDays();

    this.latitude = merchant.latitude;
    this.longitude = merchant.longitude;
    this.mapAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    }).then(() => {
      this.findAddressByCoordinates();
    });

    if (merchant.documentList.length != 0) {
      this.datalist2 = merchant.documentList;
      this.datalist2.sort((a, b) => Number(a.id) - Number(b.id));
      this.shopForm.get('document1').setValue(this.datalist2[0].documentType);
      this.shopForm.get('document2').setValue(this.datalist2[1].documentType);
      this.dataSource2 = new MatTableDataSource(this.datalist2);
    }

    this.shopCuisineList = merchant.shopCuisine;
    var x = [];
    merchant.shopCuisine.forEach(element => {
      this.selectedTypes.push(element.shopType);
    });
    this.selectedTypes.forEach(index => {
      this.shopTypeList.forEach(element => {
        if (index.id == element.id) {
          x.push(element);
        }
      });
    });
    this.shopForm.get('shopType').setValue(x);
    if (merchant.district != null && merchant.city != null) {
      this.shopForm.get('district').setValue(merchant.district.name);
      this.selectedDistrict = merchant.district;
      this.loadDisplayCity();
      this.selectedCity = merchant.city;
      this.shopForm.get('city').setValue(merchant.city.name);
    }
    if (merchant.bank != null && merchant.branch != null) {
      this.shopForm.get('bank').setValue(merchant.bank.name);
      this.selectedBank = merchant.bank;
      this.loadBranch();
      this.selectedBranch = merchant.branch;
      this.shopForm.get('branch').setValue(merchant.branch.name);
    }
    if (merchant.accountManager != null) {
      this.shopForm.get('accountManager').setValue(merchant.accountManager.name);
      this.selectedManager = merchant.accountManager;
    }
    if (merchant.address != null) {
      this.shopForm.get('address').setValue(merchant.address.billingAddress);
    }
    this.shopForm.patchValue({
      name: merchant.name,
      displayCity: merchant.city,
      priceRange: merchant.priceRange,
      minimumOrderAmount: merchant.minimumOrderAmount,
      accountNumber: merchant.accountNumber,
      commission: merchant.commission * 100,
      primaryPhoneNumber: merchant.primaryPhoneNumber,
      businessRegistrationNumber: merchant.businessRegistrationNumber,
      shopCode: merchant.shopCode,
      secondaryPhoneNumber: merchant.secondaryPhoneNumber,
      email: merchant.email,
      // preparationTime: merchant.preparationTime,
      hour: Math.floor(merchant.preparationTime / 60),
      minute: merchant.preparationTime % 60,
      accountName: merchant.accountName,
    });
    this.ngxService.stop();
  }


  onSave(shop) {
    if (this.shopId != null) {
      shop.id = this.shopId;
    }

    if (shop.district == "") {
      shop.district = null;
    } else {
      shop.district = this.selectedDistrict;
    }

    if (shop.city == "") {
      shop.city = null
    } else {
      shop.city = this.selectedCity;
    }

    if (shop.bank == "") {
      shop.bank = null;
    } else {
      shop.bank = this.selectedBank;
    }


    if (shop.branch == "") {
      shop.branch = null;
    } else {
      shop.branch = this.selectedBranch;
    }

    if (shop.accountManager == "") {
      shop.accountManager = null;
    } else {
      shop.accountManager = this.selectedManager;
    }

    this.shopCuisineList.forEach(element => {
      element.status = 0;
    });

    if (shop.shopType == "") {
      shop.shopType = [];
    } else {
      shop.shopType.forEach(element => {
        if (!this.include(this.shopCuisineList, element)) {
          this.shopCuisineList.push({ id: null, shopType: element, status: 1 });
        }
      });
    }
    shop.preparationTime = shop.hour * 60 + shop.minute;
    shop.shopCuisine = this.shopCuisineList;
    shop.longitude = this.longitude;
    shop.latitude = this.latitude;
    shop.contactList = this.datalist;
    shop.workingHourList = this.datalist1;

    this.datalist2.sort((a, b) => Number(a.id) - Number(b.id));
    this.datalist2[0].documentType = this.shopForm.get('document1').value;
    this.datalist2[1].documentType = this.shopForm.get('document2').value ;
    shop.documentList = this.datalist2;

    shop.commission = shop.commission / 100;
    var addresstemp = new Address();
    addresstemp.billingAddress = shop.address;
    shop.address = addresstemp;
    shop.imageName = this.imageSrc;
    shop.accountPassbookImage = this.imageSrc1;

    this.ngxService.start();
    if (shop.id) {
      this.shopService.updateShop(shop).subscribe(
        result => {
          this.messageService.snakBarSuccessMessage('You have successfully updated the merchant');
          this.router.navigate(['/shop/registration']);
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in updating the merchant") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      )
    } else {
      this.shopService.createShop(shop).subscribe(
        result => {
          this.messageService.snakBarSuccessMessage("shop created successfully");
          this.router.navigate(['/shop/registration']);
          this.ngxService.stop();
        },
        error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Fill inputs as given sample values") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      );
    }

  }

  onCancel() {
    this.router.navigate(['/shop/registration']);
  }

  include(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].shopType.id == obj.id) {
        this.shopCuisineList[i].status = 1;
        return true;
      }
    }
  }

  onRejectOrApprove(isApprove: boolean) {
    this.ngxService.start();
    if (isApprove) {
      this.shopService.approveShop(this.id).subscribe(
        result => {
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('You have successfully approved the merchant');
          this.router.navigate(['/shop/activation']);
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in approving the merchant") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      )
    } else {
      this.shopService.rejectShop(this.id).subscribe(
        result => {
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('You have successfully rejected the merchant');
          this.router.navigate(['/shop/activation']);
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in rejecting the merchant") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      )
    }
  }

  handleFileInput(files: FileList) {
    console.log("Called");
    // this.fileUploaded = !this.fileUploaded;
    var file = files.item(0);
    if (!file.name.toLowerCase().endsWith('.jpg') &&
      !file.name.toLowerCase().endsWith('.jpeg') &&
      !file.name.toLowerCase().endsWith('.png')) {
      this.messageService.snakBarErrorMessage('Invalid Image File');
      return false;
    }

    const formData = new FormData();
    formData.append('file', file, file.name)
    this.ngxService.start();
    this.fileService.uploadFile(formData)
      .subscribe(
        res => {
          this.imageSrc = res;
          this.fileUploaded = true;
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('Image Uploaded');
        },
        err => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('Image Upload Fail.')
        }
      );
  }

  handleFileInput1(files: FileList) {
    // this.fileUploaded1 = !this.fileUploaded1;
    var file = files.item(0);

    if (!file.name.toLowerCase().endsWith('.jpg') &&
      !file.name.toLowerCase().endsWith('.jpeg') &&
      !file.name.toLowerCase().endsWith('.png')) {
      this.messageService.snakBarErrorMessage('Invalid Image File');
      return false;
    }

    const formData = new FormData();
    formData.append('file', file, file.name)
    this.ngxService.start();
    this.fileService.uploadFile(formData)
      .subscribe(
        res => {
          this.imageSrc1 = res;
          this.fileUploaded1 = true;
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('Image Uploaded');
        },
        err => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('Image Upload Fail.')
        }
      );
  }

  handleFileInput2(files: FileList, element: DocumentDetails) {
    var file = files.item(0);
    const formData = new FormData();
    formData.append('file', file, file.name)
    this.ngxService.start();
    this.fileService.uploadFile(formData)
      .subscribe(
        res => {
          if (element.documentType == this.datalist2[0].documentType) {
            element.url = res;
            this.documnet1 = res;
          } else {
            element.url = res;
            this.documnet2 = res;
          }
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('File Uploaded');
        },
        err => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('File Upload Fail.')
        }
      );
    this.dataSource2 = new MatTableDataSource(this.datalist2);
  }

  onAddNewContact() {
    const dialogRef = this.dialog.open(AddNewContactComponent, {
      width: '60%',
      data: {
        contactList: this.datalist,
        addContact: (contactlist: ContactactPerson[]) => {
          this.updateContactTable(contactlist);
        }
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  updateContactTable(contactlist: ContactactPerson[]) {
    this.datalist = contactlist;
    this.contactUploaded = this.datalist.length > 0;
    this.dataSource = new MatTableDataSource(this.datalist);
  }


  onAddWorkingHours() {
    const dialogRef = this.dialog.open(AddWorkingHoursComponent, {
      width: '60%',
      data: {
        hourList: this.datalist1,
        addHour: (hourlist: ResturantHours[]) => {
          this.updateHoursTable(hourlist);
        }
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  updateHoursTable(hourList: ResturantHours[]) {
    this.datalist1 = hourList;
    // this.dataSource1 = new MatTableDataSource(this.datalist1);
    this.setDiaplayDays();
  }

  confirmationAction(isApprove: boolean) {
    this.dialog.open(ApproveConfirmationDialogComponent, {
      data: {
        approve: isApprove,
        execute: () => {
          this.onRejectOrApprove(isApprove);
        }
      }
    });
  }


  deleteContact(contact) {
    this.dialog.open(MerchantDeleteDialogComponent, {
      data: {
        list: this.datalist,
        target: 1,
        delete: () => {
          this.deleteSelectedContact(contact);
        }
      }
    });
  }

  deleteSelectedContact(contact: ContactactPerson) {
    this.datalist.forEach((item, index) => {
      if (item === contact) this.datalist.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.datalist);
      this.contactUploaded = this.datalist.length > 0
    });
  }

  deleteHours(hourDetails) {
    this.dialog.open(MerchantDeleteDialogComponent, {
      data: {
        list: this.displayDays,
        target: 2,
        delete: () => {
          this.deleteSelectedHours(hourDetails);
        }
      }
    });
  }

  deleteSelectedHours(hours) {
    for (let index = 0; index < this.datalist1.length; index++) {
      const element = this.datalist1[index];
      if (element.dayGroup === hours.dayGroup && element.startHour === hours.startHour && element.endHour === hours.endHour && element.dayGroup != 0 && element.dayGroup != null) {
        this.datalist1.splice(index, 1);
        index--;
      } else if (element.day === hours.day && element.startHour === hours.startHour && element.endHour === hours.endHour) {
        this.datalist1.splice(index, 1);
      }
    }
    this.setDiaplayDays();
  }

  deleteDocument(documentDetails) {
    this.datalist2[0].documentType = this.shopForm.get('document1').value;
    this.datalist2[1].documentType = this.shopForm.get('document2').value;
    this.dialog.open(MerchantDeleteDialogComponent, {
      data: {
        list: this.datalist2,
        target: 3,
        delete: () => {
          this.deleteSelectedDocument(documentDetails);
        }
      }
    });
  }
  deleteSelectedDocument(document: DocumentDetails) {
    if (document.url != null) {
      document.url = null;
      if (document.documentType === this.datalist2[0].documentType) {
        this.datalist2[0].documentType = "Business Registration Doc";
        this.shopForm.get('document1').setValue("Business Registration Doc");
      } else {
        this.datalist2[1].documentType = "Other";
        this.shopForm.get('document2').setValue("Other");
      }
      this.dataSource2 = new MatTableDataSource(this.datalist2);
      this.messageService.snakBarSuccessMessage('File removed');
    } else {
      if (this.datalist2[0].url == null && document.documentType == this.shopForm.get('document1').value) {
        this.datalist2[0].documentType = "Business Registration Doc";
        this.shopForm.get('document1').setValue("Business Registration Doc");
      }
      if (this.datalist2[1].url == null && document.documentType == this.shopForm.get('document2').value) {
        this.datalist2[1].documentType = "Other";
        this.shopForm.get('document2').setValue("Other");
      }
      this.messageService.snakBarErrorMessage('No added file');
    }
  }

  setDiaplayDays() {
    this.displayDays = this.datalist1.slice();
    for (let index = 0; index < this.displayDays.length; index++) {
      const element = this.displayDays[index];
      if (element.dayGroup == 1 && element.day < 6) {
        var dateRange = this.displayDays.splice(this.displayDays.indexOf(element), 1).slice();
        index -= 1;
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
        if (dateRange[0].day == 6) this.displayDays.push({
          id: null,
          day: 9,
          closedAllDay: dateRange[0].closedAllDay,
          startHour: dateRange[0].startHour,
          endHour: dateRange[0].endHour,
          dayGroup: 2,
          status: dateRange[0].status
        })
      }
    }
    this.displayDays.sort((a,b) => Number(a.day)-Number(b.day));
    this.dataSource1 = new MatTableDataSource(this.displayDays);
  }

  transform(time: any): any {
    if (time != null) {
      let hour = (time.split(':'))[0]
      let min = (time.split(':'))[1]
      let part = hour > 12 ? 'PM' : 'AM';
      min = (min + '').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour + '').length == 1 ? `0${hour}` : hour;
      return `${hour}:${min} ${part}`
    } else {
      return null;
    }
  }
}

