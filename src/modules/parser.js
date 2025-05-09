$.parseHTML = function(data){
    let base, singleTag, result = [], ctx, _context;
    const regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // eslint-disable-line

    if (typeof data !== "string") {
        return [];
    }

    data = data.trim();

    ctx = document.implementation.createHTMLDocument("");
    base = ctx.createElement( "base" );
    base.href = document.location.href;
    ctx.head.appendChild( base );
    _context = ctx.body;

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        result.push(document.createElement(singleTag[1]).cloneNode(true));
    } else {
        _context.innerHTML = data;
        for(let i = 0; i < _context.childNodes.length; i++) {
            // Клонируем узел, чтобы удалить parentNode
            result.push(_context.childNodes[i].cloneNode(true));
        }
    }

    return result;
};
