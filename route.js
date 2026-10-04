(async () => {
    if (['/reading/', '/files/', '/pwa/'].includes(location.pathname)) return goTo.token
        ? handleFetch('https://api.github.com/repos/' + user + '/' + user + '/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js')
        : login()
    return handleFetch(goTo.token
        ? 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents' + location.pathname + 'index.js'
        : 'https://' + user + '.github.io' + location.pathname + 'index.js'
    )
})()