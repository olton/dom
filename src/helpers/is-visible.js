export default (elem) => !!( 
    elem.offsetWidth 
    || elem.offsetHeight 
    || elem.getClientRects().length 
)