export default (string) => {
    return string.replace( /-([a-z])/g, function(all, letter){
        return letter.toUpperCase();
    });
}