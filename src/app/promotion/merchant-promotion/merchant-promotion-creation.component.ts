import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../promotion.service';
import { Promotion } from '../promotion';
import { UserService } from 'app/core/service/user.service';
import { MessageService } from 'app/shared/services/message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { element } from 'protractor';
import { CustomerPromotion } from '../customer-promotion';
import { User } from 'app/shared/data/user';
import { MerchantPromotion } from './merchant-promotion';

@Component({
  selector: 'app-merchant-promotion-creation',
  templateUrl: './merchant-promotion-creation.component.html',
  styleUrls: ['./merchant-promotion-creation.component.css']
})
export class MerchantPromotionCreationComponent {

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private promotionService: PromotionService,
    private userService: UserService, private messageService: MessageService, private ngxService: NgxUiLoaderService, private router: Router) { }
  promotionForm: FormGroup;

  merchantTableColumns = ['merchantCode', 'merchantName', 'remove'];
  merchants = []
  dataSource = new MatTableDataSource(this.merchants);

  promotionApplicationTypes: string[] = ["Passenger"];
  discountOptions: string[] = ['Free', 'Amount', 'Percentage'];
  deliveryDiscountType: string[] = ['Free delivery', 'Discount'];
  discountTypes: string[] = ['Amount', 'Percentage'];
  promotionId: number;
  promotionTypes = [{ value: 1, type: "Buy & Get Free Item" }, { value: 2, type: "Spend & Save Money" }, { value: 3, type: "Discount" }];
  merchantList: any;
  selectedMerchants = [];
  isMerchantSet: boolean = false;

  ngOnInit(): void {
    this.promotionForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      subType: new FormControl('', [Validators.required]),
      discountOption: new FormControl(''),
      allCustomer: new FormControl(false),
      merchants: new FormControl(),

      buyItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      freeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),

      minOrderAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      maxOrderAmount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      minFreeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),
      maxFreeItemCount: new FormControl('', [Validators.pattern("^([1-9][0-9]*)$")]),

      minDiscountPercentage: new FormControl('', [Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]),
      maxDiscountPercentage: new FormControl('', [Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]),
    });

    this.route.params.subscribe(params => {
      var id = params['id'];
      if (id != null) {
        this.promotionId = id;
        this.ngxService.start();
        this.promotionService.getPromotion(id)
          .subscribe(
            result => {
              this.patchValues(result);
              result.customerPromotionList.forEach(element => {
                this.merchants.push({ id: element.id, mobileNumber: element.user.phoneNumber, customerName: element.user.name, userId: element.user.id });
              });
              this.dataSource = new MatTableDataSource(this.merchants);
              this.ngxService.stop();
            }
          );
      }
      this.promotionService.getAllMerchants().subscribe(
        result => {
          this.merchantList = result;
          // this.merchantList = result.filter(element => element.status === 1);
        }
      )
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

      this.promotionForm.get('minOrderAmount').reset();
      this.promotionForm.get('maxOrderAmount').reset();
      this.promotionForm.get('maxFreeItemCount').reset();
      this.promotionForm.get('minFreeItemCount').reset();
      this.promotionForm.get('minDiscountPercentage').reset();
      this.promotionForm.get('maxDiscountPercentage').reset();
      this.promotionForm.get('buyItemCount').reset();
      this.promotionForm.get('freeItemCount').reset();


      if (value === 1) {
        this.promotionForm.get('buyItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('freeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);



      } else if (value === 2) {
        this.promotionForm.get('minOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxOrderAmount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('maxFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);
        this.promotionForm.get('minFreeItemCount').setValidators([Validators.required, Validators.pattern("^([1-9][0-9]*)$")]);


      } else if (value === 3) {
        this.promotionForm.get('minDiscountPercentage').setValidators([Validators.required, Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]);
        this.promotionForm.get('maxDiscountPercentage').setValidators([Validators.required, Validators.pattern("^[0-9]*(\.[0-9]{1,2})?$")]);
      }
    })
  }

  patchValues(promotion: Promotion) {
    this.promotionForm.patchValue({
      name: promotion.name,
      description: promotion.description,
      type: promotion.subType,
      discountOption: promotion.discountOption,
      registration: promotion.registration == 1 ? true : false,
      allCustomer: promotion.allCustomer == 1 ? true : false,
      minOrderAmount: promotion.minOrderAmount,
      maxOrderAmount: promotion.maxOrderAmount,
      maxDiscountAmount: promotion.maxDiscountAmount
    });
  }

  removeCustomer(email) {
    var element = this.merchants.filter(i => i.id == email)[0];
    console.log(element)
    this.merchantList.unshift(element);
    console.log(this.merchantList)
    var index = this.merchants.indexOf(element);
    this.merchants.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.merchants);
    if (this.merchants.length === 0) {
      this.isMerchantSet = false;
    }
  }

  submitPromotion(promotion) {
    console.log("data", promotion, "valid", this.promotionForm.valid)
    this.ngxService.start();
    if (this.promotionForm.valid) {
      var merchantPromotionList = [];
      this.merchants.forEach(element => {
        var merchantPromotion = new MerchantPromotion();
        merchantPromotion.shop = element;
        merchantPromotion.status = 1;
        merchantPromotion.name = promotion.name;
        merchantPromotionList.push(merchantPromotion);
      });
      if (this.promotionId != null) {
        promotion.id = this.promotionId;
      }
      promotion.merchantPromotionList = merchantPromotionList;
      promotion.id = this.promotionId;
      var allCustomer = promotion.allCustomer == true ? 1 : 0;
      promotion.allCustomer = allCustomer;
      promotion.type = promotion.subType;
      delete promotion.subType;
      promotion.status = 1;
      console.log(promotion)
      this.promotionService.addMerchantPromotion(promotion).subscribe(
        result => {
          this.messageService.snakBarSuccessMessage('You have successfully saved the new promotion template');
          this.ngxService.stop();
          this.router.navigate(['/promotion/merchant']);
        }, error => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('Error in saving the new promotion template')
        }
      );
    }
  }
  ToggleIsMerchantSet() {
    this.isMerchantSet = !this.isMerchantSet;
  }
  getValues(event) {
    if (event.source._selected) {
      this.merchants.push(event.source.value);
      this.dataSource = new MatTableDataSource(this.merchants);
      this.merchantList = this.merchantList.filter(element => element.id !== event.source.value.id);
      this.ToggleIsMerchantSet();
    } else if (!event.source._selected) {
      this.merchants = this.merchants.filter(element => element.id !== event.source.value.id);
      this.dataSource = new MatTableDataSource(this.merchants);
      this.ToggleIsMerchantSet();
    }

    if (this.merchants.length > 0) {
      this.isMerchantSet = true;
    } else if (this.merchants.length === 0) {
      this.isMerchantSet = false;
    }

  }

}
