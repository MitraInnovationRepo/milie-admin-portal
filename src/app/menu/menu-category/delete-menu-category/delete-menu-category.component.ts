import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-menu-category",
  templateUrl: "./delete-menu-category.component.html",
  styleUrls: ["./delete-menu-category.component.css"],
})
export class DeleteMenuCategoryComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      target: number;
      delete: () => void;
    }
  ) {}

  ngOnInit(): void {}

  delete() {
    this.data.delete();
  }

  getMessage() {
    return "Are you sure you want to delete this menu-category?";
  }
}
