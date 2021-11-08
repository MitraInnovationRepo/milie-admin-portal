import { Component, OnInit } from "@angular/core";
import { Merchant } from "app/shared/data/merchant";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "app/shared/services/message.service";
import { MenuService } from "./menu.service";

export interface TabItem {
  label: string;
  route: string;
  disabled: boolean;
}

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  constructor(
    private ngxService: NgxUiLoaderService,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  shopId: Number;
  shop: Merchant;

  ngOnInit(): void {
    // this.ngxService.start();
    // this.shopId = Number(this.route.snapshot.paramMap.get("id"));
    // this.menuService.getShop(this.shopId).subscribe(
    //   (result) => {
    //     this.shop = result;
    //     console.log(this.shop);
    //   },
    //   (error) => {
    //     this.messageService.snakBarErrorMessage(error.error.message);
    //   }
    // );
    // this.ngxService.stop();
  }

  tabs: TabItem[] = [
    {
      label: "Overview",
      route: "overview",
      disabled: true,
    },
    {
      label: "Menu",
      route: "hours",
      disabled: false,
    },
    {
      label: "Category",
      route: "category",
      disabled: true,
    },
    {
      label: "New Item",
      route: "new-item",
      disabled: true,
    },
    {
      label: "Modifier Group",
      route: "modifier-group",
      disabled: true,
    },
  ];
}
