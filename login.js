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
    if (location.pathname == '/login/') return (async () => {
        await new Promise((rs, lp) => setTimeout(lp = () => document.body ? rs() : setTimeout(lp, 100)))
        const input = append(document.body, 'input', { type: 'password', onkeydown: ev => [(['Enter', 'NumpadEnter'].includes(ev.code)) && button.onclick()] })
        const save = append(document.body, 'input', { type: 'checkbox' })
        var _redirect = localStorage._redirect
        delete localStorage._redirect
        _redirect = _redirect && (_redirect = JSON.parse(_redirect))._none == _none - 1 && _redirect._url
        const button = append(document.body, 'button', {
            textContent: 'Login', onclick: async () => {
                const loop = 1000
                const token = await Array(loop).fill().reduce(async o => btoa(Array.from(new Uint8Array(
                    await crypto.subtle.digest('SHA-512', new TextEncoder().encode((await o).repeat(loop)))
                ), b => String.fromCharCode(b)).join('')), input.value)
                if (save.checked) localStorage._token = token
                if (_redirect) return goTo(_redirect, token)
                location.reload()
            }
        })
        if (_redirect) append(document.body, 'a', { textContent: ' Cancel', href: _redirect })
        if (localStorage._token) append(document.body, 'a', { textContent: ' Logout', href: '/logout/' })
        const rs = await navigator.serviceWorker.getRegistrations()
        const installBtn = append(document.body, 'button', {
            textContent: 'Install', onclick: async () => {
                await navigator.serviceWorker.register('/sw.js')
                    .then(reg => {
                        console.log('REGISTER SUCCESS', reg);
                    })
                    .catch(err => {
                        console.error('REGISTER ERROR', err);
                    })
                await navigator.serviceWorker.ready
                    .then(registration => {
                        console.log('ready', registration)
                        // return registration.pushManager.subscribe({ userVisibleOnly: true });
                    })
                // .then((subscription) => {
                //     var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
                //     key.value = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';

                //     var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
                //     auth.value = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';

                //     endpoint.value = subscription.endpoint;
                //     console.log(`GCM EndPoint is: ${subscription.endpoint}`);
                // })
                // .catch(console.error.bind(console));
                const rs = await navigator.serviceWorker.getRegistrations()
                console.log('registrations', rs)
                installBtn.textContent = 'Installed ' + rs.length
                installBtn.disabled = !installBtn.disabled
                showBtn.disabled = !showBtn.disabled
                clearBtn.disabled = !clearBtn.disabled
                uninstallBtn.disabled = !uninstallBtn.disabled
            },
            disabled: !!rs.length
        })
        const showBtn = append(document.body, 'button', {
            textContent: 'Show', onclick: async () => {
                await caches.keys().then(cacheNames => console.log('cacheNames', cacheNames) || Promise.all(cacheNames.map(
                    cacheName => caches.open(cacheName).then(cache => cache.keys().then(
                        keys => Promise.all(keys.map(key => console.log(key.url, key)))
                    ))
                )))
            },
            disabled: !rs.length
        })
        const clearBtn = append(document.body, 'button', {
            textContent: 'Clear', onclick: async () => {
                await caches.keys().then(cacheNames => Promise.all(cacheNames.map(
                    cacheName => caches.open(cacheName).then(cache => cache.keys().then(
                        keys => Promise.all(keys.map(key => cache.delete(key)))
                    ))
                )))
            },
            disabled: !rs.length
        })
        const uninstallBtn = append(document.body, 'button', {
            textContent: 'Uninstall', onclick: async () => {
                const rs = await navigator.serviceWorker.getRegistrations()
                console.log('registrations', rs)
                for (const registration of rs) await registration.unregister()
                uninstallBtn.textContent = 'Uninstalled ' + rs.length + ' -> ' + (await navigator.serviceWorker.getRegistrations()).length
                uninstallBtn.disabled = !uninstallBtn.disabled
                installBtn.disabled = !installBtn.disabled
                showBtn.disabled = !showBtn.disabled
                clearBtn.disabled = !clearBtn.disabled
            },
            disabled: !rs.length
        })
        input.focus()
    })()
    if (location.pathname == '/logout/') return [localStorage.removeItem('_token'), location = '/login/']
    const handleFetch = url => fetch(url, Object.assign({ cache: 'no-cache' }, goTo.token ? { headers: { 'Authorization': 'Bearer ' + goTo.token } } : {}))
        .then(rs => rs.status == 401 ? login() : goTo.token ? rs.json() : rs.text())
        .then(rs => eval(goTo.token ? atob(rs && rs.content || '') : rs))
        .catch(ex => {
            console.error(ex)
            append(document.body, 'button', { textContent: 'Login', onclick: login })
            append(document.body, 'pre', { textContent: ex.stack || ex.message || ex, style: 'font-family: math' })
        })
    const user = location.hostname.split('.')[0]
    if (['/reading/', '/files/'].includes(location.pathname)) return goTo.token
        ? handleFetch('https://api.github.com/repos/' + user + '/' + user + '/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js')
        : login()
    if (search.has('login').result) return goTo.token ? goTo() : login()
    return handleFetch(goTo.token
        ? 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents' + location.pathname + 'index.js'
        : 'https://' + user + '.github.io' + location.pathname + 'index.js'
    )
})()