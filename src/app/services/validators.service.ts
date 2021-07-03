import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidatorsService {

    constructor() { }

    static minDate(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const dateToValidate = new Date(control.value + ':00.000');
            const today = new Date();

            if (control.value === null || control.value === undefined || control.value === '') {
                return { 'errors': true };
            }
            if (isNaN(dateToValidate.getTime())) {
                return { 'errors': true };
            } else {
                if (dateToValidate.getTime() > today.getTime()) {
                    return null;
                }
            }
            return { 'errors': true };
        };
    }

    static pasteCoordinate(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const valueToTest = control.value;
            const pattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
            if (valueToTest === null || valueToTest === undefined || valueToTest === '') {
                return { 'errors': true };
            }
            if (valueToTest.match(pattern)) {
                return null;
            }
            return { 'errors': true };
        };
    }
}
