import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FileService } from "app/shared/services/file.service";
import { MessageService } from "app/shared/services/message.service";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from "ngx-file-drop";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MenuService } from "../../menu.service";
import { Merchant } from "app/shared/data/merchant";
import { MatDialog } from "@angular/material/dialog";
import { ResturantHours } from "app/shared/data/resturent-hours";
import { AddItemHoursComponent } from "../add-item-hours/add-item-hours.component";

@Component({
  selector: "app-add-menu-item",
  templateUrl: "./add-menu-item.component.html",
  styleUrls: ["./add-menu-item.component.css"],
})
export class AddMenuItemComponent implements OnInit {
  mainCategory = [];
  productForm: FormGroup;
  fileDrop = true;
  imageSrc: any;
  files: NgxFileDropEntry[] = [];
  unit = [
    { id: 1, name: "gram" },
    { id: 2, name: "Kilo gram" },
    { id: 3, name: "Pac" },
  ];
  imageUrl: string;
  productData: any;
  productId = 0;
  buttonText = "Save";
  productType: any;
  productUnit: any;
  selectedProductType: any;
  selectedUnit: any;
  isImageEmpty: boolean = true;
  isPackingRequired = false;
  shop: Merchant;
  shopId: Number;
  itemHourList: ResturantHours[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private menuService: MenuService,
    private dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params) {
        this.productId = params.id;
      }
    });
  }

  ngOnInit(): void {
    this.shopId = Number(
      this.activatedRoute.parent.parent.snapshot.paramMap.get("id")
    );
    this.getCategoryList();
    this.ngxService.start();

    if (this.productId > 0) {
      this.buttonText = "Update";
      this.getProductById(this.productId);
    }

    this.productForm = this.formBuilder.group({
      description: new FormControl("", [Validators.required]),
      imageUrl: new FormControl("", []),
      minOrderQuantity: new FormControl("", [
        Validators.required,
        Validators.min(0),
      ]),
      maxOrderQuantity: new FormControl("", [
        Validators.required,
        Validators.min(0),
      ]),
      productType: new FormControl("", [Validators.required]),
      productUnit: new FormControl("", []),
      shop: [],
      title: new FormControl("", [Validators.required]),
      rawPrice: new FormControl("", [Validators.required, Validators.min(0)]),
      commission: new FormControl("", [Validators.required, Validators.min(0)]),
      unitPrice: new FormControl("", [Validators.required, Validators.min(0)]),
      unitSize: [],
      status: new FormControl("", []),
      // productAdditional: new FormControl(''),
      productAddonList: this.formBuilder.array([]),
      productAdditionalList: this.formBuilder.array([]),
      toppingsControl: new FormControl([], []),
    });

    this.menuService.getShop(this.shopId).subscribe((result) => {
      this.shop = result;
      if (this.productId == null || this.productId <= 0 || this.productId) {
        this.productForm.patchValue({
          commission: this.shop.commission,
        });
        this.totalPrice();
      }
      this.ngxService.stop();
    });
  }

  getCategoryList() {
    this.ngxService.start();
    this.menuService.getProductTypeList(this.shopId).subscribe(
      (res) => {
        this.ngxService.stop();
        this.mainCategory = res;
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  getProductById(id: number) {
    this.ngxService.start();
    this.menuService.getProductById(id).subscribe(
      (res) => {
        this.ngxService.stop();
        this.productData = res;
        this.setFormData(this.productData);
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  totalPrice() {
    const formData = this.productForm.value;
    this.productForm.patchValue({
      unitPrice: formData.rawPrice * (formData.commission + 1),
    });
  }

  setFormData(data: any) {
    // if (data.productAdditionalList.length > 0) {
    //   var productAdditional = data.productAdditionalList[0];
    //   if (productAdditional.status == 1) {
    //     this.isPackingRequired = true;
    //   }
    // }

    this.productForm.patchValue({
      description: data.description,
      imageUrl: data.imageUrl,
      minOrderQuantity: data.minOrderQuantity,
      maxOrderQuantity: data.maxOrderQuantity,
      productType: data.productType,
      productUnit: data.productUnit,
      title: data.title,
      unitPrice: data.unitPrice,
      unitSize: data.unitSize,
      commission: data.commission,
      status: data.status,
      rawPrice: data.rawPrice,
      productAddonList: data.productAddonList ? data.productAddonList : [],
      productAdditionalList: data.productAdditionalList
        ? data.productAdditionalList
        : [],
      // productAdditional: this.isPackingRequired
    });

    if (data.commission == null) {
      this.productForm.patchValue({
        commission: this.shop.commission,
      });
      this.totalPrice();
    }

    if (data.rawPrice == null) {
      this.productForm.patchValue({
        rawPrice: data.unitPrice,
      });
      this.totalPrice();
    }

    const url = data.imageUrl.split(":");
    if (url.length > 0) {
      this.imageSrc = data.imageUrl;
    } else {
      this.getProductImage(data.imageUrl);
    }

    this.selectedProductType = data.productType.id;
    this.selectedUnit = data.productUnit ? data.productUnit.id : "";
    data.productAddonList.forEach((addon) => {
      this.productAddonArray.push(
        this.formBuilder.group({
          id: addon.id,
          name: addon.name,
          price: addon.price,
          status: addon.status,
        })
      );
    });

    data.productAdditionalList.forEach((additional) => {
      this.productAdditionalArray.push(
        this.formBuilder.group({
          id: additional.id,
          name: additional.name,
          price: additional.price,
          isMandatory: additional.isMandatory,
          status: additional.status,
        })
      );
    });
  }

  // public dropped(files: NgxFileDropEntry[]) {
  //   this.files = files;
  //   for (const droppedFile of files) {
  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {
  //         const reader = new FileReader();
  //         reader.onload = (e) => (this.imageSrc = reader.result);
  //         reader.readAsDataURL(file);
  //         this.fileUpload(file);
  //       });
  //     } else {
  //       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //     }
  //   }
  // }

  // fileUpload(fileData: any) {
  //   const formData = new FormData();
  //   formData.append("file", fileData, fileData.name);
  //   this.ngxService.start();
  //   this.fileService.uploadFile(formData).subscribe(
  //     (res) => {
  //       this.ngxService.stop();
  //       this.imageUrl = res;
  //       this.productForm.patchValue({
  //         imageUrl: res,
  //       });
  //       if (this.productForm.get("imageUrl").value) {
  //         this.isImageEmpty = true;
  //       }
  //       this.imageSrc = res;
  //       this.messageService.snakBarSuccessMessage("File Upload Success.");
  //     },
  //     (err) => {
  //       this.ngxService.stop();
  //       this.messageService.snakBarErrorMessage("File Upload Fail.");
  //     }
  //   );
  // }

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
        this.imageSrc = res;
        if (this.productForm.get("imageUrl").value) {
          this.isImageEmpty = true;
        }
        this.messageService.snakBarSuccessMessage("Image Uploaded");
      },
      (err) => {
        this.ngxService.stop();
        this.messageService.snakBarErrorMessage("Image Upload Fail.");
      }
    );
  }

  getProductId(id: number) {
    this.menuService.getCategoryById(id).subscribe(
      (res) => {
        this.productType = res;
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  onFormSubmit(data: any) {
    for (let index = 0; index < data.productAddonList.length; index++) {
      const element = data.productAddonList[index];
      if (
        element.name === "" ||
        element.price === "" ||
        element.name === null ||
        element.price === null
      ) {
        this.messageService.snakBarErrorMessage("Fill Empty Add-on Fields");
        return;
      }
    }

    for (let index = 0; index < data.productAdditionalList.length; index++) {
      const element = data.productAdditionalList[index];
      if (
        element.name === "" ||
        element.price === "" ||
        element.name === null ||
        element.price === null
      ) {
        this.messageService.snakBarErrorMessage(
          "Fill Empty Additional Charge Fields"
        );
        return;
      }
    }

    this.getProductId(data.productType);
    data.image = this.imageUrl;
    data.productType = { id: data.productType };
    const unitData = this.unit.filter((unit) => {
      return unit.id === data.productUnit ? unit : null;
    });
    data.productUnit = this.productUnit;
    data.taxPrice = 0;
    // data.packingRequired = data.productAdditional;
    if (this.productId > 0) {
      this.updateProductData(this.productId, data);
    } else {
      this.saveProductData(data);
    }
    this.router.navigate(["/products"]);
  }

  saveProductData(data: any) {
    this.ngxService.start();
    this.menuService.saveProduct(data).subscribe(
      (res) => {
        this.ngxService.stop();
        this.messageService.snakBarSuccessMessage(
          "Product successfully saved."
        );
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Failed.");
      }
    );
  }

  updateProductData(id: number, data: any) {
    data.id = id;
    this.ngxService.start();
    this.menuService.updateProduct(data).subscribe(
      (res) => {
        this.ngxService.stop();
        this.messageService.snakBarSuccessMessage(
          "Product successfully updated."
        );
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Failed.");
      }
    );
  }

  deleteProductData(id: number) {
    this.menuService.deleteProduct(id).subscribe(
      (res) => {
        this.ngxService.stop();
        this.messageService.snakBarSuccessMessage(
          "Product successfully deleted."
        );
        this.router.navigate(["/products"]);
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Failed.");
      }
    );
  }

  get productAddonArray() {
    return <FormArray>this.productForm.get("productAddonList");
  }

  addAddonList() {
    this.productAddonArray.push(
      this.formBuilder.group({
        name: [],
        price: [],
        status: [1],
      })
    );
  }

  removeAddonList(index: number) {
    this.productAddonArray.removeAt(index);
  }

  get productAdditionalArray() {
    return <FormArray>this.productForm.get("productAdditionalList");
  }

  removeAdditionalList(index: number) {
    this.productAdditionalArray.removeAt(index);
  }

  addAdditionalList() {
    this.productAdditionalArray.push(
      this.formBuilder.group({
        name: [],
        price: [],
        isMandatory: [],
        status: [1],
      })
    );
  }

  onAddWorkingHours() {
    const dialogRef = this.dialog.open(AddItemHoursComponent, {
      width: "60%",
      data: {
        itemHourList: this.itemHourList,
        addHour: (hourList: ResturantHours[]) => {
          console.log(hourList);
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  getProductImage(imageName: string) {
    this.fileService.getFileUrl(imageName).subscribe(
      (res) => {
        let objectURL = URL.createObjectURL(res);
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }

  // toppingsControl = new FormControl([]);
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato",
  ];

  onToppingRemoved(topping: string) {
    const toppings = this.productForm.controls["toppingsControl"].value;
    this.removeFirst(toppings, topping);
    this.productForm.patchValue({
      toppingsControl: toppings,
    });
    // this.toppingsControl.setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
