"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Province = exports.UpdateFrequency = void 0;
// Update frequencies for data synchronization
var UpdateFrequency;
(function (UpdateFrequency) {
    UpdateFrequency["REAL_TIME"] = "real-time";
    UpdateFrequency["HOURLY"] = "hourly";
    UpdateFrequency["DAILY"] = "daily";
    UpdateFrequency["WEEKLY"] = "weekly";
    UpdateFrequency["MONTHLY"] = "monthly";
    UpdateFrequency["ANNUALLY"] = "annually"; // Every year
})(UpdateFrequency || (exports.UpdateFrequency = UpdateFrequency = {}));
var Province;
(function (Province) {
    Province["ALBERTA"] = "ALBERTA";
    Province["BRITISH_COLUMBIA"] = "BRITISH_COLUMBIA";
    Province["MANITOBA"] = "MANITOBA";
    Province["NEW_BRUNSWICK"] = "NEW_BRUNSWICK";
    Province["NEWFOUNDLAND_AND_LABRADOR"] = "NEWFOUNDLAND_AND_LABRADOR";
    Province["NOVA_SCOTIA"] = "NOVA_SCOTIA";
    Province["ONTARIO"] = "ONTARIO";
    Province["PRINCE_EDWARD_ISLAND"] = "PRINCE_EDWARD_ISLAND";
    Province["QUEBEC"] = "QUEBEC";
    Province["SASKATCHEWAN"] = "SASKATCHEWAN";
    Province["NORTHWEST_TERRITORIES"] = "NORTHWEST_TERRITORIES";
    Province["NUNAVUT"] = "NUNAVUT";
    Province["YUKON"] = "YUKON";
})(Province || (exports.Province = Province = {}));
//# sourceMappingURL=types.js.map