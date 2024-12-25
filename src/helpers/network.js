export function isLocalhost(host = globalThis.location.hostname){
    return (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "[::1]" ||
        host === "" ||
        host.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    );
}

export function isPrivateAddress (host = globalThis.location.hostname) {
    return /(^localhost)|(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2\d\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/.test(host)
}
