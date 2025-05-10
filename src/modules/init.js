$.init = function(sel, ctx){
    let parsed;
    const that = this;

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

    if (sel === "window" || sel === window) {
        this.push(window);
        return this;
    }
    if (sel === "document" || sel === document) {
        this.push(document);
        return this;
    }
    if (sel === "body" || sel === document.body) {
        this.push(document.body);
        return this;
    }
    if (sel === "html" || sel === document.documentElement) {
        this.push(document.documentElement);
        return this;
    }
    if (sel === "doctype" || sel === document.doctype) {
        this.push(document.doctype);
        return this;
    }
    if (sel && sel.nodeType) {
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
        // console.error("Selector can't be # or .") ;
        return this;
    }

    if (sel[0] === "@") {
        $("[data-role]").each(function(){
            const roles = str2arr($(this).attr("data-role"), ",");
            if (roles.indexOf(sel.slice(1)) > -1) {
                that.push(this);
            }
        });
    } else {
        parsed = $.parseHTML(sel);
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].nodeType === 1) {
                this.push(parsed[i]);
            }
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
                    for(const name in ctx) {
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
