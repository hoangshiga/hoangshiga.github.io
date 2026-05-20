(async () => {
    const _none = localStorage._none = (Number(localStorage._none) || 0) + 1
/*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
/*<.Chain>*/
    const Chain = o => [...new Set([...Object.keys(o), ...Object.keys(o.__proto__)])].forEach(
        k => k != 'toString' && typeof o[k] == 'function' && [o['_' + k] = o[k], o[k] = (...args) => [o.result = o['_' + k].call(o, ...args)] && o]
    ) || Object.assign(o, { await: async () => [o.result = await o.result] && o })/*</.Chain>*/
    window.search = Chain(new URLSearchParams(location.search))
    const _url = () => location.origin + location.pathname + '?' + search.delete('login')
    window.goTo = (token => Object.assign((url, _token = token) => [localStorage.token = _token, location = url || _url()], { token }))(localStorage._token || localStorage.token || '')
    delete localStorage.token
    window.login = () => [localStorage.removeItem('_token'), localStorage._redirect = JSON.stringify({ _none, _url: _url() }), location = '/login/']
    if (location.pathname == '/login/') return (async () => {
        await new Promise((rs, lp) => setTimeout(lp = () => document.body ? rs() : setTimeout(lp, 100)))
        const input = append(document.body, 'input', { type: 'password', onkeydown: ev => [(['Enter', 'NumpadEnter'].includes(ev.code)) && button.onclick()] })
        const save = append(document.body, 'input', { type: 'checkbox' })
        var _redirect = localStorage._redirect
        delete localStorage._redirect
        _redirect = _redirect && (_redirect = JSON.parse(_redirect))._none == _none - 1 && _redirect._url
        const button = append(document.body, 'button', {
            textContent: 'Login', onclick: async () => {
                if (!window.CryptoJS) {
/*<.CryptoJS>*/
    const CryptoJS = await Promise.try(async (module = {}, exports = {}) => eval(await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')).text()) && exports) /*</.CryptoJS>*/
                    window.CryptoJS = CryptoJS
                }
                const token = CryptoJS.AES.decrypt('U2FsdGVkX1/uWdJOf3p+jkCTQNb2otEu65+HxrrCEWkQy+lZOpPPrMzpT4sa5M46/ZEQshLha2cML+ByLJiVZw==', input.value.repeat(1000 * 1000)).toString(CryptoJS.enc.Utf8)
                if (save.checked) localStorage._token = token
                if (_redirect) return goTo(_redirect, token)
                location.reload()
            }
        })
        if (_redirect) append(document.body, 'a', { textContent: ' Cancel', href: _redirect })
        if (localStorage._token) append(document.body, 'a', { textContent: ' Logout', href: '/logout/' })
        input.focus()
    })()
    if (location.pathname == '/logout/') return [localStorage.removeItem('_token'), location = '/login/']
    const handleFetch = url => fetch(url, Object.assign({ cache: 'no-cache' }, goTo.token ? { headers: { 'Authorization': 'Bearer ' + goTo.token } } : {}))
        .then(rs => rs.status == 401 ? login() : goTo.token ? rs.json() : rs.text())
        .then(rs => eval(goTo.token ? atob(rs && rs.content || '') : rs || ''))
        .catch(ex => append(document.body, 'pre', { textContent: ex.stack || ex.message || ex, style: 'font-family: math' }))
    const user = location.hostname.split('.')[0]
    if (['/reading/'].includes(location.pathname)) return goTo.token
        ? handleFetch('https://api.github.com/repos/' + user + '/' + user + '/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js')
        : login()
    if (search.has('login').result) return goTo.token ? goTo('') : login()
    return handleFetch(goTo.token
        ? 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents' + location.pathname + 'index.js'
        : 'https://' + user + '.github.io' + location.pathname + 'index.js'
    )
})()