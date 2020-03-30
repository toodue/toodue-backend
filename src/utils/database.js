module.exports = {
    buildURI: (protocol, host, port, name) => {
        return `${protocol}://${host}:${port}/${name}`
    }
}
