"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBusinessHourConstraint = void 0;
exports.IsBusinessHour = IsBusinessHour;
const class_validator_1 = require("class-validator");
let IsBusinessHourConstraint = class IsBusinessHourConstraint {
    validate(value, _args) {
        if (!value)
            return false;
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return false;
        const day = date.getDay();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const isWeekday = day >= 1 && day <= 5;
        const isOnHour = minutes === 0 && seconds === 0;
        const isBusinessHour = hour >= 9 && hour <= 17;
        return isWeekday && isOnHour && isBusinessHour;
    }
    defaultMessage(_args) {
        return 'Agendamentos só podem ser feitos de segunda a sexta, em horários cheios entre 09:00 e 17:00 (último slot termina às 18:00).';
    }
};
exports.IsBusinessHourConstraint = IsBusinessHourConstraint;
exports.IsBusinessHourConstraint = IsBusinessHourConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false, name: 'isBusinessHour' })
], IsBusinessHourConstraint);
function IsBusinessHour(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBusinessHourConstraint,
        });
    };
}
//# sourceMappingURL=business-hour.validator.js.map