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

@Component({
  selector: 'app-merchant-promotion-creation',
  templateUrl: './merchant-promotion-creation.component.html',
  styleUrls: ['./merchant-promotion-creation.component.css']
})
export class MerchantPromotionCreationComponent {

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private promotionService: PromotionService,
    private userService: UserService, private messageService: MessageService, private ngxService: NgxUiLoaderService, private router: Router) { }
  promotionForm: FormGroup;

  customerTableColumns = ['mobileNumber', 'customerName', 'remove'];
  customers = []
  dataSource = new MatTableDataSource(this.customers);

  promotionApplicationTypes: string[] = ["Passenger"];
  discountOptions: string[] = ['Free', 'Amount', 'Percentage'];
  deliveryDiscountType: string[] = ['Free delivery', 'Discount'];
  discountTypes: string[] = ['Amount', 'Percentage'];
  promotionId: number;
  promotionTypes = [{ value: 1, type: "Buy & Get Free Item" }, { value: 2, type: "Spend & Save Money" }, { value: 3, type: "Discount" }];

  ngOnInit(): void {
    this.promotionForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      subType: new FormControl('0', [Validators.required]),
      discountOption: new FormControl(''),
      discountAmount: new FormControl(''),
      discountPercentage: new FormControl(''),
      allCustomer: new FormControl(false),
      phoneNumber: new FormControl(),
      registration: new FormControl(),
      minOrderAmount: new FormControl(''),
      maxOrderAmount: new FormControl(''),
      minBuyItemCount: new FormControl(''),
      minFreeItemCount: new FormControl(''),
      maxFreeItemCount: new FormControl(''),
      minDiscountPercentage: new FormControl(''),
      maxDiscountPercentage: new FormControl(''),
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
                this.customers.push({ id: element.id, mobileNumber: element.user.phoneNumber, customerName: element.user.name, userId: element.user.id });
              });
              this.dataSource = new MatTableDataSource(this.customers);
              this.ngxService.stop();
            }
          );
      }
    });

    this.promotionForm.get('subType').valueChanges.subscribe(value => {
      if (value === 1) {
        this.promotionForm.get('minBuyItemCount').setValidators(Validators.required);
        this.promotionForm.get('minFreeItemCount').setValidators(Validators.required);

      } else if (value === 2) {
        this.promotionForm.get('minOrderAmount').setValidators(Validators.required);
        this.promotionForm.get('maxOrderAmount').setValidators(Validators.required);
        this.promotionForm.get('maxFreeItemCount').setValidators(Validators.required);
        this.promotionForm.get('minFreeItemCount').setValidators(Validators.required);
      } else if (value === 3) {
        this.promotionForm.get('minDiscountPercentage').setValidators(Validators.required);
        this.promotionForm.get('maxDiscountPercentage').setValidators(Validators.required);
      }
    })
  }

  patchValues(promotion: Promotion) {
    this.promotionForm.patchValue({
      name: promotion.name,
      description: promotion.description,
      subType: promotion.subType,
      discountOption: promotion.discountOption,
      discountAmount: promotion.discountAmount,
      discountPercentage: promotion.discountPercentage,
      registration: promotion.registration == 1 ? true : false,
      allCustomer: promotion.allCustomer == 1 ? true : false,
      minOrderAmount: promotion.minOrderAmount,
      maxOrderAmount: promotion.maxOrderAmount,
      maxDiscountAmount: promotion.maxDiscountAmount
    });
  }

  addCustomer(mobile) {
    this.userService.getUserByPhoneNumber(mobile)
      .subscribe(
        result => {
          this.customers.push({ userId: result.id, mobileNumber: mobile, customerName: result.name })
          this.dataSource = new MatTableDataSource(this.customers);
          this.promotionForm.get('phoneNumber').setValue(null);
        },
        error => {
          this.messageService.snakBarErrorMessage('Customer Not Found')
        }
      );
  }

  removeCustomer(id) {
    var element = this.customers.filter(i => i.id == id)[0];
    var index = this.customers.indexOf(element);
    this.customers.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.customers);
  }

  submitPromotion(promotion) {
    console.log("data", promotion, "valid", this.promotionForm.valid)
    this.ngxService.start();
    if (this.promotionForm.valid) {
      var customerPromotionList = [];
      this.customers.forEach(element => {
        var customerPromotion = new CustomerPromotion();
        customerPromotion.id = element.id;
        var user = new User();
        user.phoneNumber = element.mobileNumber;
        user.id = element.userId;
        customerPromotion.user = user;
        customerPromotionList.push(customerPromotion);
      });
      if (this.promotionId != null) {
        promotion.id = this.promotionId;
      }
      promotion.customerPromotionList = customerPromotionList;
      promotion.id = this.promotionId;
      var registration = promotion.registration == true ? 1 : 0;
      var allCustomer = promotion.allCustomer == true ? 1 : 0;
      promotion.registration = registration;
      promotion.allCustomer = allCustomer;
      this.promotionService.addPromotion(promotion).subscribe(
        result => {
          if (this.promotionId == null) {
            this.messageService.snakBarSuccessMessage('Promotion Added Successfully');
          }
          else {
            this.messageService.snakBarSuccessMessage('Promotion Updated Successfully');
          }
          this.ngxService.stop();
          this.router.navigate(['/promotion/merchant']);
        }
      );
    }
  }

}
