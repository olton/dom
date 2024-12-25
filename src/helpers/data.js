import not from "./not.js";

export function acceptData(owner){
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
}

export function getData(data){
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

export function dataAttr(elem, key, data, dataset){
    let name;

    if ( not(data) && elem.nodeType === 1 ) {
        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            data = getData( data );
            if (dataset) {
                dataset.set(elem, key, data);
            }
        } else {
            data = undefined;
        }
    }
    return data;
}