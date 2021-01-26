import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'app/shared/services/message.service';
import { ShopService } from './shop.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShopType } from './shop-type';
import { Shop } from './shop';
import { FileService } from 'app/shared/services/file.service';
import { UserCreation } from 'app/shared/data/user-creation';
import { UserService } from 'app/core/service/user.service';
import { Address } from 'app/shared/data/address';

@Component({
    selector: 'app-shop-creation',
    templateUrl: './shop-creation.component.html',
    styleUrls: ['./shop-creation.component.css']
})
export class ShopCreationComponent implements OnInit {
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private shopService: ShopService,
        private messageService: MessageService, private ngxService: NgxUiLoaderService, private router: Router, private fileService: FileService,
        private userService: UserService) { }
    shopForm: FormGroup;
    shopTypeList: ShopType[];
    shopId: number;
    imageSrc: String;
    shopType: ShopType;
    address: Address;
    fileUploaded: boolean = false;

    ngOnInit(): void {
        this.shopService.getShopType()
            .subscribe(
                result => {
                    this.shopTypeList = result;
                }
            );

        this.shopForm = this.formBuilder.group({
            phoneNumber: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            shopType: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            displayCity: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            slogan: new FormControl(''),
            latitude: new FormControl('', [Validators.required]),
            longitude: new FormControl('', [Validators.required]),
            openingHour: new FormControl('', [Validators.required]),
            closingHour: new FormControl('', [Validators.required]),
            bank: new FormControl(''),
            branch: new FormControl(''),
            accountNumber: new FormControl(''),
            priceRange: new FormControl('', [Validators.required]),
            minimumOrderAmount: new FormControl('', [Validators.required]),
            billingAddress: new FormControl('', [Validators.required]),
            image: new FormControl('', [Validators.required]),
            commission: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(\.[0-9]{1,4})?$")]),
            primaryPhoneNumber: new FormControl('', [Validators.required]),
            secondaryPhoneNumber: new FormControl(''),
            businessRegistrationNumber: new FormControl(''),
        });

        this.route.params.subscribe(params => {
            var id = params['id'];
            if (id != null) {
                this.shopId = id;
                this.ngxService.start();
                this.shopService.getShop(id)
                    .subscribe(
                        result => {
                            this.patchValues(result);
                            this.ngxService.stop();
                        }
                    );
            }
        });

    }

    patchValues(shop: Shop) {
        this.imageSrc = shop.imageName;
        this.shopForm.patchValue({
            phoneNumber: shop.user.phoneNumber,
            firstName: shop.user.firstName,
            lastName: shop.user.lastName,
            email: shop.user.email,
            shopType: shop.shopType.id,
            name: shop.name,
            displayCity: shop.displayCity,
            description: shop.description,
            slogan: shop.slogan,
            latitude: shop.latitude,
            longitude: shop.longitude,
            openingHour: shop.openingHour,
            closingHour: shop.closingHour,
            priceRange: shop.priceRange,
            minimumOrderAmount: shop.minimumOrderAmount,
            bank: shop.bank,
            branch: shop.branch,
            accountNumber: shop.accountNumber,
            billingAddress: shop.address.billingAddress,
            commission: shop.commission,
            primaryPhoneNumber: shop.primaryPhoneNumber,
            secondaryPhoneNumber: shop.secondaryPhoneNumber,
            businessRegistrationNumber: shop.businessRegistrationNumber
        });
    }

    handleFileInput(files: FileList) {
        this.ngxService.start();
        var file = files.item(0);
        const formData = new FormData();
        formData.append('file', file, file.name)
        this.ngxService.start();
        this.fileService.uploadFile(formData)
            .subscribe(
                res => {
                    this.ngxService.stop();
                    this.imageSrc = res;
                    this.messageService.snakBarSuccessMessage('Image Uploaded');
                    this.fileUploaded = true;
                },
                err => {
                    this.ngxService.stop();
                    this.messageService.snakBarErrorMessage('Image Upload Fail.')
                }
            );
    }

    submitShop(shop) {
        if (this.shopForm.valid) {
            this.ngxService.start();
            var userCreation = new UserCreation();
            userCreation.countryCode = "+94";
            userCreation.phoneNumber = shop.phoneNumber;
            userCreation.firstName = shop.firstName;
            userCreation.lastName = shop.lastName;
            userCreation.email = shop.email;
            userCreation.name = shop.firstName + " " + shop.lastName;
            this.userService.initializeUser(userCreation)
                .subscribe(result => {
                    this.shopType = new ShopType();
                    this.shopType.id = shop.shopType;
                    shop.shopType = this.shopType;
                    delete this.shopType.id;


                    this.address = new Address();
                    this.address.billingAddress = shop.billingAddress;
                    shop.address = this.address;
                    shop.imageName = this.imageSrc;

                    this.shopService.createShop(shop)
                        .subscribe(
                            result => {
                                this.messageService.snakBarSuccessMessage("shop created successfully");
                                this.router.navigate(['/shop']);
                                this.ngxService.stop();
                            },
                            error => {
                                this.ngxService.stop();
                                error.status === 400 ?
                                    this.messageService.snakBarErrorMessage("Fill inputs as given sample values") :
                                    this.messageService.snakBarErrorMessage(error.error.message)
                            }
                        );
                },
                    error => {
                        this.ngxService.stop();
                        if (error.status == 400) {
                            this.messageService.snakBarErrorMessage("Input Value Error");
                        }
                        else {
                            this.messageService.snakBarErrorMessage(error.error.message);
                        }
                    });
        }
    }

    updateShop(shop) {
        this.shopType = new ShopType();
        this.shopType.id = shop.shopType;
        shop.shopType = this.shopType;
        shop.imageName = this.imageSrc;
        shop.id = this.shopId;
        this.ngxService.start();
        this.shopService.updateShop(shop)
            .subscribe(
                result => {
                    this.messageService.snakBarSuccessMessage("shop updated successfully");
                    this.router.navigate(['/shop']);
                    this.ngxService.stop();
                },
                error => {
                    this.ngxService.stop();
                    if (error.status == 400) {
                        this.messageService.snakBarErrorMessage("Input Value Error");
                    }
                    else {
                        this.messageService.snakBarErrorMessage(error.error.error);
                    }
                }
            );
    }
}