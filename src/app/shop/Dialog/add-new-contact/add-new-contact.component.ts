import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContactactPerson } from 'app/shared/data/contact-person';

@Component({
  selector: 'app-add-new-contact',
  templateUrl: './add-new-contact.component.html',
  styleUrls: ['./add-new-contact.component.css']
})
export class AddNewContactComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddNewContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{
      contactList : ContactactPerson[],
      addContact : (contactlist : ContactactPerson[]) => void
  } 
  , private formBuilder: FormBuilder
  ) {}

  newContactForm: FormGroup;
  displayedColumns: string[] = ['type', 'name', 'mobile', 'email'];
  contactSet : ContactactPerson[] = this.data.contactList.slice();
  dataSource = new MatTableDataSource(this.contactSet);
  primaryUser : boolean = false;
  isUpdated : boolean  = false;
  
  ngOnInit(): void {
    this.newContactForm = this.formBuilder.group({
      primaryContact : new FormControl('' , [Validators.required]),
      firstName:new FormControl('', [Validators.required]),
      phoneNumber:new FormControl('', [Validators.required , Validators.pattern("^[0-9]{9}")]),
      email:new FormControl('', []),
    });
  
    this.isExistingPrimary();
    if (this.contactSet.length>2) {
      this.newContactForm.disable();
    }
  }

  isExistingPrimary(){
    for (const contact of this.contactSet) {
      if (contact.primaryContact==1) {
        this.primaryUser=contact.primaryContact==1;
        break;
      }
    }
  }

  saveContactList(){
    this.data.addContact(this.contactSet);
    this.dialogRef.close();
  }

  closeAddContact(){
    this.contactSet = this.data.contactList;
    this.dialogRef.close();
  }

  addContact(contact : ContactactPerson){
    this.contactSet.push(contact);
    this.dataSource = new MatTableDataSource(this.contactSet);
    this.isExistingPrimary();
    this.newContactForm.reset();
    if (this.contactSet.length>2) {
      this.newContactForm.disable();
    }
    this.isUpdated = true;
  }
}
