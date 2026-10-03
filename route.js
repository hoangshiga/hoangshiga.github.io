(async () => {
    const _none = localStorage._none = (Number(localStorage._none) || 0) + 1
    /*<.append.Chain>*/
/*<.append>*/
        const append = Object.assign((...as) => (Array.isArray(as[0]) ? as : [as]).map(a => append._('append', ...a)).pop(), {
            _: (f, p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p[f](t), t)
        })/*</.append>*/
/*<.Chain>*/
    const Chain = o => [...new Set([...Object.keys(o), ...Object.keys(o.__proto__)])].forEach(
        k => k != 'toString' && typeof o[k] == 'function' && [o['_' + k] = o[k], o[k] = (...args) => [o.result = o['_' + k].call(o, ...args)] && o]
    ) || Object.assign(o, { await: async () => [o.result = await o.result] && o })/*</.Chain>*/
/*</.append.Chain>*/
    window.search = Chain(new URLSearchParams(location.search))
    const _url = () => location.origin + location.pathname + '?' + search.delete('login')
    window.login = () => [localStorage.removeItem('_token'), localStorage._redirect = JSON.stringify({ _none, _url: _url() }), location = '/login/']
    try {
        window.goTo = ((token, key) => Object.assign((url, _token = token) => [localStorage.token = _token, location = url || _url()], {
            key: key = Array.from(atob(token).split(''), c => c.charCodeAt(0)),
            token: token && 'ghp_' + new TextDecoder().decode(Uint8Array.from(
                atob('nFgpTLhaXj2YwSwlJFG2Hl/BPFtoENddUtZKvXZCGIgM0SuM').split(''),
                (c, i) => c.charCodeAt(0) ^ key[i % key.length]
            ))
        }))(localStorage._token || localStorage.token || '')
    } catch (ex) {
        console.error(ex)
        append(document.body, 'button', { textContent: 'Login', onclick: login })
        append(document.body, 'pre', { textContent: ex.stack || ex.message || ex, style: 'font-family: math' })
    }
    delete localStorage.token
    const handleFetch = url => fetch(url, Object.assign({ cache: 'no-cache' }, goTo.token ? { headers: { 'Authorization': 'Bearer ' + goTo.token } } : {}))
        .then(rs => rs.status == 401 ? login() : goTo.token ? rs.json() : rs.text())
        .then(rs => eval(goTo.token ? atob(rs && rs.content || '') : rs))
        .catch(ex => {
            console.error(ex)
            append(document.body, 'button', { textContent: 'Login', onclick: login })
            append(document.body, 'pre', { textContent: ex.stack || ex.message || ex, style: 'font-family: math' })
        })
    const user = location.hostname.split('.')[0]
    if (location.pathname == '/logout/') return [localStorage.removeItem('_token'), location = '/login/']
    if (['/reading/', '/files/'].includes(location.pathname)) return goTo.token
        ? handleFetch('https://api.github.com/repos/' + user + '/' + user + '/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js')
        : login()
    if (search.has('login').result) return goTo.token ? goTo() : login()
    return handleFetch(goTo.token
        ? 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents' + location.pathname + 'index.js'
        : 'https://' + user + '.github.io' + location.pathname + 'index.js'
    )
})()