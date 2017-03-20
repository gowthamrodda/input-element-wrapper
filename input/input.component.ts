import { Component, OnInit, Input, Output, EventEmitter, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'my-input',
    templateUrl: 'input.component.html',
    styleUrls: ['input.component.scss']
})

/*
 * Class InputComponent
 * @Input control: FormControl - form control object specific to this input
 * @Input label: string - text for the label
 * @Input labelClass: string - optional class can be passed in to set styles on the label. See input.component.scss for available classes
 * @Input name: string - name of the input
 * @Input type: string - type of the input such as 'text'
 * @Input model: string - value of the input and model we are two-way data binding to
 * @Input pattern: RegExp - optional. If provided, will prevent all characters from being entered that do not match this RegExp
 * @Output modelChange: EventEmitter - fires an event when the model is changed
 */
export class InputComponent implements OnInit {
    private _placeholder = '';

    @Input() control: FormControl;
    @Input() label: string;
    @Input() labelClass: string;
    @Input() name: string;
    @Input() type = 'text';
    @Input() model: string;
    @Input() pattern: RegExp;
    @Input() pipe: PipeTransform;
    private focused = false;

    @Output() modelChange: EventEmitter<{}>;

    /*
     * custom setter/getter that forces placeholder text to be an empty string if it is null or undefined
     */
    @Input()
    set placeholder(placeholder: string) {
        this._placeholder = placeholder || '';
    }
    get placeholder(): string {
        return this._placeholder;
    }

    constructor() {
        this.modelChange = new EventEmitter();
    }

    /*
     * Init sets default values
     */
    ngOnInit() {
        this.control.setValue(this.model);
    }

    // updates the model and fires the modelChange event when input is updated
    pushValue(value): void {
        this.model = this.pipe ? this.pipe.transform(value) : value;
        this.modelChange.emit(this.model);
    }

    /*
     * this prevents characters not included in our pattern RegExp from being entered into the input
     */
    filterInput(event: any) {
        if (this.pattern) {
            let inputChar = String.fromCharCode(event.charCode);
            if (!this.pattern.test(inputChar)) {
                // invalid character, prevent input
                event.preventDefault();
            }
        }
    }

    /*
     * control state of this.focused
     */
    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
    }
}
