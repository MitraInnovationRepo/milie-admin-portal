import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'app/menu/menu.service';
import { FileService } from 'app/shared/services/file.service';
import { MessageService } from 'app/shared/services/message.service';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'add-menu-category',
  templateUrl: './add-menu-category.component.html',
  styleUrls: ['./add-menu-category.component.css']
})
export class AddMenuCategoryComponent implements OnInit {
  mainCategory = [];
  categoryForm: FormGroup;
  imageSrc: any;
  files: NgxFileDropEntry[] = [];
  image: any;
  productTypeId = 0;
  buttonText = 'Save';
  categoryData: any;
  selectedProductMainType: any;
  isUploadedImage: boolean = false;
  panelOpenState = false;

  constructor(
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private fileService: FileService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.productTypeId = params.id
      }
    });
  }

  ngOnInit(): void {
    if (this.productTypeId > 0) {
      this.buttonText = 'Update';
      this.getCategoryById(this.productTypeId)
    }
    this.categoryForm = this.formBuilder.group({
      id: [],
      productMainType: [],
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      status: new FormControl(1, [Validators.required]),
      image: new FormControl('', []),
      sortingId: new FormControl('', [Validators.required])
    });

    this.getMainProductTypeList();
    this.categoryForm.patchValue({
      sortingId: 1
    });
  }

  getMainProductTypeList() {
    this.ngxService.start();
    this.menuService.getMainProductTypes()
      .subscribe(
        res => {
          this.ngxService.stop();
          this.mainCategory = res;
        },
        err => {
          this.messageService.snakBarErrorMessage('Something went wrong.')
        }
      )
  }

  getCategoryById(id: number) {
    this.ngxService.start();
    this.menuService.getCategoryById(id)
      .subscribe(
        res => {
          this.ngxService.stop();
          this.categoryData = res;
          this.setFormData(this.categoryData);
        },
        err => {
          this.messageService.snakBarErrorMessage('Something went wrong.')
        }
      )
  }

  setFormData(data: any) {
    this.categoryForm.patchValue({
      productMainType: data.categoryId,
      name: data.name,
      description: data.description,
      status: data.status,
      image: data.image,
      sortingId: data.sortingId
    })
    this.imageSrc = data.image;
    this.image = data.image
    this.selectedProductMainType = data.productMainType?.id;
    this.getProductImage(data.image);
  }


  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
          reader.readAsDataURL(file);
          this.fileUpload(file)
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }


  fileUpload(fileData: any) {
    const formData = new FormData();
    formData.append('file', fileData, fileData.name)
    this.ngxService.start();
    this.fileService.uploadFile(formData)
      .subscribe(
        res => {
          this.ngxService.stop();
          this.image = res;
          this.isUploadedImage = true;
          this.messageService.snakBarSuccessMessage('File Upload Success.')
        },
        err => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage('File Upload Fail.')
        }
      )
  }

  onFormSubmit(data: any) {
    this.ngxService.start();
    data.image = this.image;
    data.productMainType = { id: data.productMainType }
    if (this.productTypeId > 0) {
      this.updateCategoryData(this.productTypeId, data);
    } else {
      this.saveCategoryData(data)
    }
    this.router.navigate(['/products']);
  }

  saveCategoryData(data: any) {
    this.menuService.saveCategory(data)
      .subscribe(
        res => {
          this.ngxService.stopAll();
          this.messageService.snakBarSuccessMessage('Product type successfully saved.')
        }, err => {
          this.ngxService.stopAll();
          this.messageService.snakBarErrorMessage('Failed.')
        }
      )
  }

  updateCategoryData(id: number, data: any) {
    data.id = id;
    this.menuService.updateCategory(data)
      .subscribe(
        res => {
          this.ngxService.stopAll();
          this.messageService.snakBarSuccessMessage('Product type successfully updated.')
        }, err => {
          this.ngxService.stopAll();
          this.messageService.snakBarErrorMessage('Failed.')
        }
      )
  }

  deleteCategoryData(id: number) {
    this.menuService.deleteCategory(id)
      .subscribe(
        response => {
          this.ngxService.stop();
          if (response.operationStatus == 1) {
            this.messageService.snakBarSuccessMessage('Product type successfully deleted');
            this.router.navigate(['/products']);
          }
          else {
            this.messageService.snakBarErrorMessage(response.message);
          }
        }, error => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage(error.error.error_description);
        }
      );
  }

  getProductImage(imageName: string) {
    this.fileService.getFileUrl(imageName)
      .subscribe(
        res => {
          let objectURL = URL.createObjectURL(res);
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        err => {
          this.messageService.snakBarErrorMessage('Something went wrong.')
        }
      )
  }
}

