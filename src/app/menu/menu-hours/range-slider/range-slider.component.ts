import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  HostListener,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  FormBuilder,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";
import { Subject } from "rxjs";
import { first } from "rxjs/operators";

export type RangeSliderValue = [number, number];

@Component({
  selector: "app-range-slider",
  templateUrl: "./range-slider.component.html",
  styleUrls: ["./range-slider.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RangeSliderComponent,
    },
  ],
})
export class RangeSliderComponent implements OnInit, ControlValueAccessor {
  @Input() min = 0;

  @Input() max = 200;

  @Input() formControl = new FormControl([0, 0]);

  public form = this.fb.group({
    firstThumb: [],
    secondThumb: [],
  });

  /** Calculating this every cd will cause layout trashing, future improvement could be updating on window resize  */
  public cachedBoundingClientRectWidth = null;

  private onTouchedCallback;

  private cachedBoundingClientRectWidthCalculated$ = new Subject();

  @HostListener("blur")
  onBlur() {
    this.onTouchedCallback();
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Every thumb can maximally go to the width of the parent minus its width
    //
    console.log(this.elementRef.nativeElement.getBoundingClientRect());

    setTimeout(() => {
      // Expression has changed after it was checked fix
      //
      this.cachedBoundingClientRectWidth =
        this.elementRef.nativeElement.getBoundingClientRect().width;

      this.cachedBoundingClientRectWidthCalculated$.next(true);
    });
  }

  private transformPixelToValue(pixelValue: number) {
    if (this.cachedBoundingClientRectWidth === null) {
      return 0;
    }

    const value = (pixelValue * this.max) / this.cachedBoundingClientRectWidth;

    const roundedValue = Math.ceil((value * 100) / 100).toFixed(2);

    return roundedValue;
  }

  /** Consumer won't talk in pixels, but we do, so this will transform a given value to pixel values */
  private async transformValueToPixel(value: number) {
    if (this.cachedBoundingClientRectWidth == null) {
      await this.cachedBoundingClientRectWidthCalculated$
        .pipe(first(Boolean))
        .toPromise();
    }

    const pixelValue = (this.cachedBoundingClientRectWidth * value) / this.max;
    return pixelValue;
  }

  async writeValue(newValue: RangeSliderValue) {
    const [firstThumbValue, secondThumbValue] = newValue;

    const firstThumb = await this.transformValueToPixel(firstThumbValue);

    const secondThumb = await this.transformValueToPixel(secondThumbValue);

    this.form.setValue({ firstThumb, secondThumb });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe((newValue) => {
      const pixelValueInverted = (pixels) => {
        return (pixels * this.max) / this.cachedBoundingClientRectWidth;
      };

      console.log(
        "secondThumb from " +
          newValue.secondThumb +
          " = " +
          pixelValueInverted(newValue.secondThumb)
      );
      fn([
        pixelValueInverted(newValue.firstThumb),
        pixelValueInverted(newValue.secondThumb),
      ] as RangeSliderValue);
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log("isDisabled", isDisabled);
    isDisabled ? this.form.disable() : this.form.enable();
  }

  getTime(second) {
    var roundedSeconds = Math.round(second);

    var date = new Date(0);
    date.setSeconds(roundedSeconds);
    var timeString = date.toISOString().substr(11, 8);
    return this.transform(timeString);
  }

  transform(time: any): any {
    if (time != null) {
      let hour = time.split(":")[0];
      let min = time.split(":")[1];
      let part = hour >= 12 ? "PM" : "AM";
      min = (min + "").length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour + "").length == 1 ? `0${hour}` : hour;
      return `${hour}:${min} ${part}`;
    } else {
      return null;
    }
  }
}
