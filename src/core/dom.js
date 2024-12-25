import {each, hasProp, isArrayLike, isPlainObject, parse, uid} from "../helpers/index.js"

export class Dom extends Array {
    static version = "__VERSION__";
    static build_time = "__BUILD_TIME__";

    _uid = null
    _prevObj = null

    get [Symbol.toStringTag]() {
        return "Dom"
    }

    [Symbol.toPrimitive](hint) {
        if (hint === "string") {
            const arr = [...this]
            return JSON.stringify(arr)
        }

        return "[object Dom]"
    }

    constructor(selector, context) {
        super();

        this._uid = uid();

        if (!selector) {
            return this;
        }
        if (selector === "#" || selector === ".") {
            console.warn("Selector can't be # or .");
            return this;
        }
        if (selector instanceof Dom) {
            return selector;
        }
        if (typeof selector === "function") {
            return $.ready(selector);
        }
        if (selector instanceof Element) {
            this.push(selector);
        }
        if (selector === "window") selector = window;
        if (selector === "document") selector = document;
        if (selector === "body") selector = document.body;
        if (selector === "html") selector = document.documentElement;
        if (selector === "doctype") selector = document.doctype;
        if (selector && (selector.nodeType || selector.self === window)) {
            this.push(selector);
            return this;
        }
        if (isArrayLike(selector)) {
            for (const item of selector) {
                this.push(item);
            }
        }
        if (typeof selector !== "string" && (selector.self && selector.self !== window)) {
            return this;
        }
        if (selector[0] === "@") {
            const items = $(`[data-role*=${selector.substring(1)}]`);
            for (const item of items) {
                this.push(item);
            }
        }

        const parsed = parse(selector);
        if (parsed.length === 1 && parsed[0].nodeType === 3 /* text node */) {
            try {
                [].push.apply(this, document.querySelectorAll(selector));
            } catch (e) {
            }
        } else {
            [].push.apply(this, parsed);
        }

        if (context) {
            if (isPlainObject(context)) {
                each(this, function () {
                    for (let key in context) {
                        if (hasProp(context, key))
                            this.setAttribute(key, context[key]);
                    }
                });
            } else {
                const ctx = $(context);
                for (const el of this) {
                    ctx.append(el);
                }
            }
        }
    }

    get uid() {
        return this._uid;
    }
}

export const $ = (selector, context) => new Dom(selector, context);