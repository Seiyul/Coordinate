import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MasksService {

    constructor() { }

    checkNumeric(field: any): void {
        // let value = field.value;
        // value = value.replace(/[^\d]|[\-+\.\,]/g, '');
        // field.setValue(value);
    }

    checkLatitude(field: any): void {
        let value = field.value;
        let cleanedValue = '';

        // 0 --> No tiene '+' / '-' | 1 --> Tiene '+' / '-'
        let hasSymbol = 0;

        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < value.length; i++) {
            const char = value.charAt(i);

            // · Posición 0 --> Número o símbolos '+' / '-'
            if (i === 0) {
                if (numbers.includes(char) || ['-', '+'].includes(char)) {
                    cleanedValue += char;
                    if (['-', '+'].includes(char)) {
                        hasSymbol = 1;
                    }
                }
            }

            // · Posición 1 (con símbolo) --> Solo número (+_)
            // · Posición 1 (sin símbolo) --> Número o punto
            else if (i === 1) {
                if (hasSymbol) {
                    if (numbers.includes(char)) {
                        cleanedValue += char;
                    }
                }
                else {
                    if (numbers.includes(char) || ['.'].includes(char)) {
                        cleanedValue += char;
                    }
                }
            }

            // · Posición 2 (con símbolo) --> Número o punto
            // · Posición 2 (sin símbolo):
            //   - Si no hay punto previo --> Insertar punto
            //   - Si hay punto previo --> Número
            else if (i === 2) {
                if (hasSymbol) {
                    if (numbers.includes(char) || ['.'].includes(char)) {
                        cleanedValue += char;
                    }
                }
                else {
                    if (cleanedValue.includes('.')) {
                        if (numbers.includes(char)) {
                            cleanedValue += char;
                        }
                    }
                    else {
                        cleanedValue += '.';
                    }
                }
            }

            // · Posición 3 (con símbolo):
            //   - Si no hay punto previo --> Insertar punto
            //   - Si hay punto previo --> Número
            // · Posición 3 (sin símbolo) --> Número (a partir de aquí en adelante)
            else if (i === 3) {
                if (hasSymbol) {
                    if (cleanedValue.includes('.')) {
                        if (numbers.includes(char)) {
                            cleanedValue += char;
                        }
                    }
                    else {
                        cleanedValue += '.';
                    }
                }
                else {
                    if (numbers.includes(char)) {
                        cleanedValue += char;
                    }
                }
            }

            // i > 3 --> Sólo números
            else {
                if (numbers.includes(char)) {
                    cleanedValue += char;
                }
            }
        }
        if (cleanedValue.includes('..')) {
            cleanedValue = cleanedValue.replace('..', '.');
        }
        field.setValue(cleanedValue);
    }

    checkLongitude(field: any): void {
        let value = field.value;
        let cleanedValue = '';

        // 0 --> No tiene '+' / '-' | 1 --> Tiene '+' / '-'
        let hasSymbol = 0;

        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < value.length; i++) {
            const char = value.charAt(i);

            // · Posición 0 --> Número o símbolos '+' / '-'
            if (i === 0) {
                if (numbers.includes(char) || ['-', '+'].includes(char)) {
                    cleanedValue += char;
                    if (['-', '+'].includes(char)) {
                        hasSymbol = 1;
                    }
                }
            }

            // · Posición 1 (con símbolo) --> Solo número (+_) 
            // · Posición 1 (sin símbolo) --> Número o punto 
            else if (i === 1) {
                if (hasSymbol) {
                    if (numbers.includes(char)) {
                        cleanedValue += char;
                    }
                }
                else {
                    if (numbers.includes(char) || ['.'].includes(char)) {
                        cleanedValue += char;
                    }
                }
            }

            // · Posición 2:
            //   - Si no hay punto previo --> Número o punto
            //   - Si hay punto previo (debe ser sin símbolo) --> Número
            else if (i === 2) {
                if (cleanedValue.includes('.')) {
                    if (numbers.includes(char)) {
                        cleanedValue += char;
                    }
                }
                else {
                    if (numbers.includes(char) || ['.'].includes(char)) {
                        cleanedValue += char;
                    }
                }
            }

            // · Posición 3:
            //   - Si no tiene símbolo + No hay punto --> Insertar punto
            //   - Si no tiene símbolo + Ya hay punto --> Sólo número
            //   - Si tiene símbolo + No hay punto --> Número / Punto
            //   - Si tiene símbolo + Ya hay punto --> Número
            else if (i === 3) {
                if (hasSymbol) {
                    if (cleanedValue.includes('.')) {
                        if (numbers.includes(char)) {
                            cleanedValue += char;
                        }
                    }
                    else {
                        if (numbers.includes(char) || ['.'].includes(char)) {
                            cleanedValue += char;
                        }
                    }
                }
                else {
                    if (cleanedValue.includes('.')) {
                        if (numbers.includes(char)) {
                            cleanedValue += char;
                        }
                    }
                    else {
                        cleanedValue += '.';
                    }
                }
            }

            // · Posición 4:
            //   - Si tiene símbolo + No hay punto --> Insertar punto
            //   - Si tiene símbolo + Ya hay punto --> Sólo número
            //   - Si no tiene símbolo --> Número
            else if (i === 4) {
                if (hasSymbol) {
                    if (cleanedValue.includes('.')) {
                        if (numbers.includes(char)) {
                            cleanedValue += char;
                        }
                    }
                    else {
                        cleanedValue += '.';
                    }
                }
                else {
                    if (numbers.includes(char)) {
                        cleanedValue += char;
                    }
                }
            }

            // i > 4 --> Sólo números
            else {
                if (numbers.includes(char)) {
                    cleanedValue += char;
                }
            }
        }
        if (cleanedValue.includes('..')) {
            cleanedValue = cleanedValue.replace('..', '.');
        }
        field.setValue(cleanedValue);
    }
}