"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photo = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    // title: {
    //     type: String
    // },
    // description: {
    //     type: String
    // },
    imagePath: {
        type: String
    }
});
exports.Photo = mongoose_1.model('Photo', schema);
