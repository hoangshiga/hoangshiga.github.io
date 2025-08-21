(async () => {
    const Api = (repo, token) => {
        const contents = 'https://api.github.com/repos/' + repo + '/contents/'
        const options = (opts1, opts2) => Object.assign({ headers: { 'Authorization': 'Bearer ' + token }, cache: 'no-cache' }, opts1 || {}, opts2 || {})
        const _fetch = async (url, opts) => await fetch(url, opts).then(res => { if (res.ok) return res.json(); throw res.status || res.message })
        const get = async (url, opts) => await _fetch(url, options(opts))
        const put = async (url, opts) => await _fetch(url, options(opts, { method: 'PUT' }))
        const post = async (url, opts) => await _fetch(url, options(opts, { method: 'POST' }))
        const del = async (url, opts) => await _fetch(url, options(opts, { method: 'DELETE' }))
        const shas = {}
        const file = async (path, o) => [shas[path] = (o = await get(contents + path) || {}).sha] && o
        const folder = async dir => (await file(dir)).reduce(
            (o, x) => (x.type == 'file' ? [shas[x.path] = x.sha] && o.files : o.folders).push(x) && o,
            { folders: [], files: [] }
        )
        const _btoa = s => btoa(Array.from(new TextEncoder().encode(s), b => String.fromCharCode(b)).join(''))
        const _atob = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)))
        const _write = async (path, content, o) => [shas[path] = (o = await put(contents + path, {
            body: JSON.stringify(Object.assign({ message: path, content: _btoa(content) }, (sha => sha && { sha } || {})(shas[path])))
        }) || {}).content.sha] && o
        const write = async (path, content) => await _write(path, content).catch(
            async ex => await file(path) && await _write(path, content)
        )
        const read = async path => _atob((await file(path)).content)
        const remove = async (path, o) => [shas[path] = (o = await del(contents + path, {
            body: JSON.stringify(Object.assign({ message: path, sha: shas[path] || (await file(path)).sha }))
        }) && 0)] && o
        const _escape = (dir, path) => dir + '/' + Array.from(path.matchAll(/([a-zA-Z0-9 ._-]*)([^a-zA-Z0-9 ._-]*)/g))
            .map(([_, a, b]) => a + '[' + _btoa(b) + ']').join('').replaceAll('[]', '')
        const _unescape = path => Array.from(path.matchAll(/([^\]]*)\[(.+?)\]([^\[]*)/g))
            .map(([_, a, b, c]) => a + _atob(b) + c).join('') || path
        return { folder, read, write, remove, escape: _escape, unescape: _unescape }
    }
    const append = (p, t) => (t = document.createElement(t)) && p && p.append(t) || t
    const api = Api('hoangshiga/hoangshiga', localStorage._token = localStorage._token || prompt('token') || '');
    if (!localStorage._token) return
    const folder = 'reading'
    const key = unescape(new URLSearchParams(location.search).get('key') || '')
    await new Promise((res, loop) => (loop = () => !document.body && setTimeout(loop) || res())())
    if (key) return Object.assign(append(document.body, 'pre'), {
        innerHTML: await api.read(api.escape(folder, key)),
        style: 'font-family: math'
    })
    const input = append(document.body, 'input')
    const button = append(document.body, 'button')
    const area = append(document.body, 'br') && Object.assign(append(document.body, 'textarea'), {
        rows: 10,
        style: 'width: 100%; box-sizing: border-box'
    })
    button.textContent = 'Activate'
    button.onclick = async () => {
        if (!input.value || !area.value) return
        const key = input.value
        await api.write(api.escape(folder, key), area.value)
        location = '?key=' + escape(key)
    }
    ((await api.folder(folder).catch(() => ({}))).files || []).forEach(file => {
        const key = api.unescape(file.name)
        append(document.body, 'br')
        Object.assign(append(document.body, 'button'), {
            textContent: 'Remove',
            onclick: async () => await api.remove(api.escape(folder, key)) || location.reload(),
        })
        Object.assign(append(document.body, 'button'), {
            textContent: 'Load',
            onclick: async () => {
                input.value = key
                area.value = await api.read(api.escape(folder, key))
            },
        })
        Object.assign(append(document.body, 'button'), {
            textContent: 'Open: ' + key,
            onclick: () => [location = '?key=' + escape(key)],
        })
    })
})()