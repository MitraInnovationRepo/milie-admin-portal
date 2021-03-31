import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../promotion.service';
import { UserService } from 'app/core/service/user.service';
import { MessageService } from 'app/shared/services/message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MerchantPromotion } from './merchant-promotion';
import { PromotionDuplicateDialogComponent } from './dialog/promotion-duplicate-dialog/promotion-duplicate-dialog.component';
import { FileService } from 'app/shared/services/file.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-merchant-promotion-creation',
  templateUrl: './merchant-promotion-creation.component.html',
  styleUrls: ['./merchant-promotion-creation.component.css']
})
export class MerchantPromotionCreationComponent {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private userService: UserService,
    private messageService: MessageService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private fileService: FileService,
    private dialog: MatDialog
  ) { }
  promotionForm: FormGroup;

  merchantTableColumns = ['merchantCode', 'merchantName', 'remove'];
  merchants = []
  dataSource = new MatTableDataSource(this.merchants);

  promotionApplicationTypes: string[] = ["Passenger"];
  discountOptions: string[] = ['Free', 'Amount', 'Percentage'];
  deliveryDiscountType: string[] = ['Free delivery', 'Discount'];
  discountTypes: string[] = ['Amount', 'Percentage'];
  promotionId: number;
  promotionTypes = [{ value: 1, type: "Buy & Get Free Item" }, { value: 2, type: "Spend & Save Money" }, { value: 4, type: "Discount" }];
  merchantList: any;
  isMerchantSet: boolean = false;
  isUpdate: boolean = false;
  isNotView: boolean = true;
  selectedMerchant: number[];

  imageSrc: String;
  fileUploaded: boolean = false;

  discountPercentageRange: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  ngOnInit(): void {
    this.promotionForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      subType: new FormControl('', [Validators.required]),
      allShop: new FormControl(false),
      merchants: new FormControl(),
      imageUrl: new FormControl('', [Validators.required]),

      buyItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      freeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),

      minOrderAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      maxOrderAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      minFreeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      maxFreeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      minDiscountAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      maxDiscountAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),

      minDiscountPercentage: new FormControl('', [Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]),
      maxDiscountPercentage: new FormControl('', [Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]),
    });

    this.getAllMerchants();

    this.route.params.subscribe(params => {
      var data = history.state.data;
      this.isUpdate = history.state.update;
      if (data && data.id) {
        this.ngxService.start();
        this.patchValues(data, this.isUpdate);
        this.fileUploaded = true;
        this.promotionId = data.id;
        this.promotionService.getPromotionMerchants(data.id).subscribe(
          result => {
            var patchResult = [];
            for (var i in result) {
              patchResult.push(result[i]);
            }
            this.dataSource = new MatTableDataSource(patchResult);
            this.merchants = patchResult;
            this.promotionForm.patchValue({ 'merchants': this.merchants });
          },
          error => {
            this.messageService.snakBarErrorMessage('Error in getting merchants list')
          });

        this.promotionService.getPromotionMerchantsDifferenece(data.id).subscribe(
          result => {
            var patchResult = [];
            for (var i in result) {
              patchResult.push(result[i]);
            }
            this.merchantList = patchResult;
          },
          error => {
            this.messageService.snakBarErrorMessage('Error in getting merchants list')

          })
      }
    });

    this.promotionForm.get('subType').valueChanges.subscribe(value => {
      this.promotionForm.get('minOrderAmount').clearValidators();
      this.promotionForm.get('maxOrderAmount').clearValidators();
      this.promotionForm.get('maxFreeItemCount').clearValidators();
      this.promotionForm.get('minFreeItemCount').clearValidators();
      this.promotionForm.get('minDiscountPercentage').clearValidators();
      this.promotionForm.get('maxDiscountPercentage').clearValidators();

      this.promotionForm.get('buyItemCount').clearValidators();
      this.promotionForm.get('freeItemCount').clearValidators();

      this.promotionForm.get('minDiscountAmount').clearValidators();
      this.promotionForm.get('maxDiscountAmount').clearValidators();


      this.promotionForm.get('minOrderAmount').reset();
      this.promotionForm.get('maxOrderAmount').reset();
      this.promotionForm.get('maxFreeItemCount').reset();
      this.promotionForm.get('minFreeItemCount').reset();
      this.promotionForm.get('minDiscountPercentage').reset();
      this.promotionForm.get('maxDiscountPercentage').reset();
      this.promotionForm.get('buyItemCount').reset();
      this.promotionForm.get('freeItemCount').reset();
      this.promotionForm.get('minDiscountAmount').reset();
      this.promotionForm.get('maxDiscountAmount').reset();



      if (value === 1) {
        this.promotionForm.get('buyItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('freeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);

      } else if (value === 2) {
        this.promotionForm.get('minOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('minDiscountAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxDiscountAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);

      } else if (value === 3) {
        this.promotionForm.get('minOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('minFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);

      } else if (value === 4) {
        this.promotionForm.get('minDiscountPercentage').setValidators([Validators.required]);
        this.promotionForm.get('maxDiscountPercentage').setValidators([Validators.required]);

      }
    })
  }

  patchValues(promotion, isUpdate) {
    if (!isUpdate) {
      this.isNotView = false;
      this.promotionForm.disable();
    }
    this.imageSrc = promotion.imageUrl;
    this.isMerchantSet = true;

    if (promotion.type === 1) {
      this.promotionForm.get('buyItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('freeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);

    } else if (promotion.type === 2) {
      this.promotionForm.get('minOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('maxOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('minDiscountAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('maxDiscountAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);

    } else if (promotion.type === 3) {
      this.promotionForm.get('minOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('maxOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('minFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionForm.get('maxFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
      this.promotionTypes = [{ value: 1, type: "Buy & Get Free Item" }, { value: 3, type: "Spend & Save Money" }, { value: 4, type: "Discount" }];

    } else if (promotion.type === 4) {
      this.promotionForm.get('minDiscountPercentage').setValidators([Validators.required, Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]);
      this.promotionForm.get('maxDiscountPercentage').setValidators([Validators.required, Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]);
    } else if (promotion.type === 5) {
      this.promotionTypes = [{ value: 1, type: "Buy & Get Free Item" }, { value: 3, type: "Spend & Save Money" }, { value: 5, type: "Discount" }];
    }

    this.promotionForm.patchValue({
      name: promotion.name,
      description: promotion.description,
      subType: promotion.type,
      discountOption: promotion.discountOption,
      allShop: promotion.allShop == 1 ? true : false,
      imageUrl: promotion.imageUrl,

      buyItemCount: promotion.buyItemCount,
      freeItemCount: promotion.freeItemCount,

      minOrderAmount: promotion.minOrderAmount,
      maxOrderAmount: promotion.maxOrderAmount,
      minFreeItemCount: promotion.minFreeItemCount,
      maxFreeItemCount: promotion.maxFreeItemCount,
      minDiscountAmount: promotion.minDiscountAmount,
      maxDiscountAmount: promotion.maxDiscountAmount,

      minDiscountPercentage: promotion.minDiscountPercentage,
      maxDiscountPercentage: promotion.maxDiscountPercentage,
    });
  }

  getAllMerchants() {
    this.ngxService.start();
    this.promotionService.getAllMerchants().subscribe(
      result => {
        this.merchantList = result;
        this.ngxService.stop();

      }
    )
  }

  removeCustomer(id) {
    var element = this.merchants.filter(i => i.id == id)[0];
    this.merchantList.unshift(element);
    this.selectedMerchant = [];

    var index = this.merchants.indexOf(element);
    this.merchants.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.merchants);
    if (this.merchants.length === 0) {
      this.isMerchantSet = false;
    }
  }

  duplicatePromotion(promotion) {
    this.ngxService.start();
    promotion.id = 0;
    this.promotionService.addMerchantPromotion(promotion).subscribe(
      result => {
        this.ngxService.stop();
        this.messageService.snakBarSuccessMessage('You have successfully saved the new promotion template');
        this.router.navigate(['/promotion/merchant']);
      }, error => {
        this.ngxService.stop();
        this.messageService.snakBarErrorMessage('Error in saving the new promotion template')
      }
    )
  }

  submitPromotion(promotion) {
    this.ngxService.start();
    if (this.promotionForm.valid || this.promotionId != null) {
      var merchantPromotionList = [];
      this.merchants.forEach(element => {
        var merchantPromotion = new MerchantPromotion();
        merchantPromotion.shop = element;
        merchantPromotion.status = 1;
        merchantPromotion.isTemplate = true;
        merchantPromotion.name = promotion.name;
        merchantPromotionList.push(merchantPromotion);
      });
      if (this.promotionId != null) {
        promotion.id = this.promotionId;
      }
      promotion.merchantPromotionList = merchantPromotionList;
      promotion.id = this.promotionId;
      var allShop = 0;
      if (promotion.allShop) {
        var allShop = 1;
        promotion.merchantPromotionList = [];
      }
      promotion.allShop = allShop;
      promotion.type = promotion.subType;
      delete promotion.subType;

      promotion.status = 1;
      promotion.imageUrl = this.imageSrc;



      if (promotion.id) {
        this.promotionService.verifyRunningPromotions(promotion.id).subscribe(
          result => {
            debugger
            let hasExistingShopPromotions = result;
            if (hasExistingShopPromotions) {
              this.ngxService.stop();
              let dialogDeletePromotionRef = this.dialog.open(PromotionDuplicateDialogComponent, {
                width: '400px',
                data: {
                  promotion: promotion,
                  duplicatePromotion: (promotion: any) => {
                    this.duplicatePromotion(promotion)
                  }
                }
              });
            }
            else {
              this.promotionService.updateMerchantPromotion(promotion).subscribe(
                result => {
                  this.messageService.snakBarSuccessMessage('You have successfully edited and saved the promotion');
                  this.router.navigate(['/promotion/merchant']);
                }, error => {
                  this.ngxService.stop();
                  this.messageService.snakBarErrorMessage('Error in updating the new promotion template')
                }
              )
            }
          }, error => {
            console.log('log verify: '+ error);
            this.ngxService.stop();
            this.messageService.snakBarErrorMessage('Error in updating the new promotion template')
          }
        )


      } else {
        this.promotionService.addMerchantPromotion(promotion).subscribe(
          result => {
            this.ngxService.stop();
            this.messageService.snakBarSuccessMessage('You have successfully saved the new promotion template');
            this.router.navigate(['/promotion/merchant']);
          }, error => {
            this.ngxService.stop();
            this.messageService.snakBarErrorMessage('Error in saving the new promotion template')
          }
        )
      }
    }

  }

  ToggleIsMerchantSet() {
    this.isMerchantSet = !this.isMerchantSet;
    if (this.merchants.length !== 0) {
      this.isMerchantSet = true;
    }
  }

  getValues(event) {
    if (event.source._selected && event.isUserInput) {
      this.merchants.push(event.source.value);
      this.dataSource = new MatTableDataSource(this.merchants);
      this.merchantList = this.merchantList.filter(element => element.id !== event.source.value.id);
      if (this.merchants.length > 0) {
        this.isMerchantSet = true;
      } else if (this.merchants.length === 0) {
        this.isMerchantSet = false;
      }
    } else if (!event.source._selected) {
      this.merchants = this.merchants.filter(element => element.id !== event.source.value.id);
      this.dataSource = new MatTableDataSource(this.merchants);
      if (this.merchants.length > 0) {
        this.isMerchantSet = true;
      } else if (this.merchants.length === 0) {
        this.isMerchantSet = false;
      }
    }
  }

  handleFileInput(files: FileList) {
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
          this.ngxService.stop();
          this.imageSrc = res;
          this.promotionForm.patchValue({ imageUrl: this.imageSrc });
          this.messageService.snakBarSuccessMessage('Image Uploaded');
          this.fileUploaded = true;
        },
        err => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('Image Upload Fail.')
        }
      );
  }

  cancelUpdate() {
    this.router.navigate(['promotion/merchant']);
  }
}
