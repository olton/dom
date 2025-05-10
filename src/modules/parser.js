$.parseHTML = function(data){
    let base, singleTag, result = [], ctx, _context;
    const regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // eslint-disable-line

    if (typeof data !== "string" || data.trim() === '') {
        return [];
    }

    data = data.trim();

    singleTag = regexpSingleTag.exec(data);
    
    if (singleTag) {
        result.push(document.createElement(singleTag[1]));
    } else {
        if ($.isSelector(data)) {
            const elements = document.querySelectorAll(data);
            if (elements.length) {
                for (const el of elements) {
                    result.push(el);
                }
            }
            if (result.length === 0) {
                result.push(document.createTextNode(data));   
            }
            return result;
        } 

        ctx = document.implementation.createHTMLDocument("");
        base = ctx.createElement( "base" );
        base.href = document.location.href;
        ctx.head.appendChild( base );
        _context = ctx.body;
        _context.innerHTML = data;

        for(let i = 0; i < _context.childNodes.length; i++) {
            // Клонируем узел, чтобы удалить parentNode
            result.push(_context.childNodes[i].cloneNode(true));
        }
    }

    return result;
};
