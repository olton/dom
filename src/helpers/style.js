import {numProps} from "./consts.js";
import camelCase from "./camel-case.js";

export function setStyleProp(el, key, val){
    key = camelCase(key);

    if (["scrollLeft", "scrollTop"].includes(key)) {
        el[key] = (parseInt(val));
    } else {
        el.style[key] = isNaN(val) || numProps.includes(""+key) ? val : val + 'px';
    }
}

export function getStyleProp(el, prop, pseudo){
    return ["scrollLeft", "scrollTop"].includes(prop) ? el[prop]() : getComputedStyle(el, pseudo)[prop];
}