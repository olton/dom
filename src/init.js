/* global $, isArrayLike, isPlainObject, hasProp, str2arr */

$.init = function(sel, ctx){
    var parsed;
    var that = this;

    if (typeof sel === "string") {
        sel = sel.trim();
    }

    this.uid = $.uniqueId();

    if (!sel) {
        return this;
    }

    if (typeof sel === "function") {
        return $.ready(sel);
    }

    if (sel instanceof Element) {
        this.push(sel);
        return this;
    }

    if (sel instanceof $) {
        $.each(sel, function(){
            that.push(this);
        });
        return this;
    }

    if (sel === "window") sel = window;
    if (sel === "document") sel = document;
    if (sel === "body") sel = document.body;
    if (sel === "html") sel = document.documentElement;
    if (sel === "doctype") sel = document.doctype;
    if (sel && (sel.nodeType || sel.self === window)) {
        this.push(sel);
        return this;
    }

    if (isArrayLike(sel)) {
        $.each(sel, function(){
            $(this).each(function(){
                that.push(this);
            });
        });
        return this;
    }

    if (typeof sel !== "string" && (sel.self && sel.self !== window)) {
        return this;
    }

    if (sel === "#" || sel === ".") {
        console.error("Selector can't be # or .") ;
        return this;
    }

    if (sel[0] === "@") {

        $("[data-role]").each(function(){
            var roles = str2arr($(this).attr("data-role"), ",");
            if (roles.indexOf(sel.slice(1)) > -1) {
                that.push(this);
            }
        });

    } else {

        parsed = $.parseHTML(sel);

        if (parsed.length === 1 && parsed[0].nodeType === 3) { // Must be a text node -> css sel
            try {
                [].push.apply(this, document.querySelectorAll(sel));
            } catch (e) {
                //console.error(sel + " is not a valid selector");
            }
        } else {
            $.merge(this, parsed);
        }
    }

    if (ctx !== undefined) {
        if (ctx instanceof $) {
            this.each(function () {
                $(ctx).append(that);
            });
        } else if (ctx instanceof HTMLElement) {
            $(ctx).append(that);
        } else {
            if (isPlainObject(ctx)) {
                $.each(this,function(){
                    for(var name in ctx) {
                        if (hasProp(ctx, name))
                            this.setAttribute(name, ctx[name]);
                    }
                });
            }
        }
    }

    return this;
};

$.init.prototype = $.fn;
