"use strict";
exports.__esModule = true;
var extractProps = function (obj1, obj2) {
    var res = {};
    var key1 = Object.keys(obj1);
    var key2 = Object.keys(obj2);
    var commonKeys = key1.filter(function (el) { return key2.includes(el); });
    console.log('commonKeys', commonKeys);
    commonKeys.forEach(function (key) { res[key] = obj2[key]; });
    return res;
};
var obj1 = {
    a: '1',
    b: '2',
    c: '3'
};
var obj2 = {
    a: '11',
    b: '22',
    d: '44'
};
console.log(extractProps(obj1, obj2));
exports["default"] = extractProps;
