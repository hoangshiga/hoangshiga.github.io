(async () => {
    /*<.append.Api>*/
/*<.append>*/
        const append = Object.assign((...as) => (Array.isArray(as[0]) ? as : [as]).map(a => append._('append', ...a)).pop(), {
            _: (f, p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p[f](t), t)
        })/*</.append>*/
/*<.Api>*/
    const Api = (repo, token, key) => {
        const contents = 'https://api.github.com/repos/' + repo + '/contents/'
        const options = (opts1, opts2) => Object.assign(token ? { headers: { 'Authorization': 'Bearer ' + token } } : {}, { cache: 'no-cache' }, opts1 || {}, opts2 || {})
        const _fetch = async (url, opts) => await fetch(url, opts)
            .then(async res => { if (res.ok) return res.json(); throw new Error('Error ' + res.status + "\n" + (res.json && (await res.json()).message || '')) })
        const get = async (url, opts) => await _fetch(url, options(opts))
        const put = async (url, opts) => await _fetch(url, options(opts, { method: 'PUT' }))
        const post = async (url, opts) => await _fetch(url, options(opts, { method: 'POST' }))
        const del = async (url, opts) => await _fetch(url, options(opts, { method: 'DELETE' }))
        const shas = {}
        const file = async (path, o) => [shas[path] = (o = await get(contents + path) || {}).sha] && o
        const item = async dir => (await file(dir)).reduce(
            (o, x) => (x.type == 'file' ? [shas[x.path] = x.sha] && o.files : o.folders).push(x) && o,
            { folders: [], files: [] }
        )
        const folder = async dir => (await file(dir)).reduce(
            (o, x, f) => (x.type == 'file'
                ? [
                    x.name.match(/\.\d\d$/) && [
                        x.name = de(x.name.split('.').slice(0, -1).join('.')),
                        x.path = de(x.path.split('.').slice(0, -1).join('.')),
                        x.sha = null
                    ],
                    shas[x.path] = x.sha,
                    !(f = o.files.find(file => file.name == x.name)) && o.files.push(x) || [f.size += x.size]
                ]
                : o.folders.push(x), o),
            { folders: [], files: [] }
        )
        const _atob = (...b64) => new TextDecoder().decode(Uint8Array.from(b64.map(b64 => atob(b64)).join(''), c => c.charCodeAt(0)))
        const ___write = async (path, content, o) => [shas[path] = (o = await put(contents + path, {
            body: JSON.stringify(Object.assign({ message: path, content }, (sha => sha && { sha } || {})(shas[path])))
        }) || {}).content.sha] && o
        const __write = async (path, content) => await ___write(path, content).catch(
            async ex => await file(path) && await ___write(path, content)
        )
        const SPLIT_LIMIT = 1024 * 1023
        const _write = async (path, bytes) => {
            if (bytes.length <= SPLIT_LIMIT) return await __write(path, btoa(bytes.join('')))
            const files = (await item(path.split('/').slice(0, -1).join('/')).catch(ex => ({ files: [] }))).files
            var i, subPath, subName, name = path.split('/').pop()
            for (i in Array(Math.ceil(bytes.length / SPLIT_LIMIT)).fill()) {
                subPath = path + '.' + String(i).padStart(2, '0')
                subName = subPath.split('/').pop()
                shas[subPath] = (files.find(f => f.name == subName) || {}).sha
                await ___write(subPath, btoa(bytes.slice(i * SPLIT_LIMIT, i * SPLIT_LIMIT + SPLIT_LIMIT).join('')))
            }
            if (shas[subPath] = (files.find(f => f.name == name) || {}).sha) await __remove(subPath)
            while ((
                subPath = path + '.' + String(++i).padStart(2, '0'),
                subName = subPath.split('/').pop(),
                shas[subPath] = (files.find(f => f.name == subName) || {}).sha
            )) await __remove(subPath)
            return true
        }
        const write = async (path, content) => {
            const bytes = Array.from(new TextEncoder().encode(content), b => String.fromCharCode(b))
            return _write(path, bytes)
        }
        const read = async path => {
            var content = file(path).catch(ex => [])
            content = (await content).content
            if (content) return _atob(content)
            const name = path.split('/').pop()
            var files = item(path.split('/').slice(0, -1).join('/'))
            files = (await files).files.filter(x => x.name.startsWith(name)).sort((a, b) => a.name.localeCompare(b.name))
            const contents = (await Promise.all(files.map(x => file(x.path)))).map(file => file.content)
            return _atob(...contents)
        }
        const upload = async (path, file) => {
            const bytes = Array.from(new Uint8Array(await file.arrayBuffer()), b => String.fromCharCode(b))
            return _write(path, bytes)
        }
        const download = async (path, type) => {
            var content = file(path).catch(ex => [])
            content = (await content).content
            var k = -1
            if (content) return new Blob([Uint8Array.from(atob(content), c => c.charCodeAt(0))], type ? { type } : {})
            const name = path.split('/').pop()
            var files = item(path.split('/').slice(0, -1).join('/'))
            files = (await files).files.filter(x => x.name.startsWith(name)).sort((a, b) => a.name.localeCompare(b.name))
            const contents = (await Promise.all(files.map(x => file(x.path)))).map(file => file.content)
            return new Blob([Uint8Array.from(contents.map(b64 => atob(b64)).join(''), c => c.charCodeAt(0))], type ? { type } : {})
        }
        const uploadEncode = async (path, file) => {
            var k = -1
            const bytes = Array.from(new Uint8Array(await file.arrayBuffer()), b => String.fromCharCode(b ^ key[++k < key.length ? k : k = 0]))
            return _write(path, bytes)
        }
        const downloadDecode = async (path, type) => {
            var content = file(path).catch(ex => [])
            content = (await content).content
            var k = -1
            if (content) return new Blob([Uint8Array.from(atob(content), c => c.charCodeAt(0) ^ key[++k < key.length ? k : k = 0])], type ? { type } : {})
            const name = path.split('/').pop()
            var files = item(path.split('/').slice(0, -1).join('/'))
            files = (await files).files.filter(x => x.name.startsWith(name)).sort((a, b) => a.name.localeCompare(b.name))
            const contents = (await Promise.all(files.map(x => file(x.path)))).map(file => file.content)
            return new Blob([Uint8Array.from(contents.map(b64 => atob(b64)).join(''), c => c.charCodeAt(0) ^ key[++k < key.length ? k : k = 0])], type ? { type } : {})
        }
        const __remove = async (path, o) => [shas[path] = (o = await del(contents + path, {
            body: JSON.stringify(Object.assign({ message: path, sha: shas[path] || (await file(path)).sha }))
        })) && 0] && o
        const _remove = async path => await __remove(path).catch(
            async ex => await file(path) && await __remove(path)
        )
        const remove = async path => {
            if (path.match(/\.\d\d$/)) return await _remove(path)
            var o = __remove(path).catch(ex => 0)
            var files = item(path.split('/').slice(0, -1).join('/'))
            o = await o
            if (o) return o
            files = (await files).files
            for (var file of files) if (file.path.startsWith(path)) {
                shas[file.path] = file.sha
                await __remove(file.path)
            }
            return true
        }
        const en = Object.assign(
            s => en.de.split('').reduce((s, de, i) => s.replaceAll(de, '.' + en.en[i]), s),
            { en: unescape('%uFFE5%uFF0F%uFF1A%u22C6%uFF1F%u2033%uFF1C%uFF1E%uFF05%uFF06%uFF5C%uFF03'), de: '\\/:*?"<>%&|#' }
        )
        const de = s => en.de.split('').reduce((s, de, i) => s.replaceAll('.' + en.en[i], de), s)
        const _escape = (dir, path) => (dir ? dir + '/' : '') + en(path)
        return { item, folder, read, write, upload, download, uploadEncode, downloadDecode, remove, escape: _escape, unescape: de }
    }/*</.Api>*/
/*</.append.Api>*/
    const api = await Api('hoangshiga/hoangshiga.github.io', goTo.token, goTo.key)
    const fileInput = append(document.body, 'input', {
        type: 'file', onchange: () => {
            button.disabled = !fileInput.files.length
            if (!button.disabled) button.textContent = 'Upload'
        }
    })
    append(document.body, 'br')
    const nameInput = append(document.body, 'input')
    const button = append(document.body, 'button', {
        textContent: 'Upload', onclick: async () => {
            button.disabled = true
            button.textContent = 'Uploading...'
            const file = fileInput.files[0]
            const name = nameInput.value
            await api.uploadEncode(api.escape('files', name), file)
            button.textContent = 'Done'
            fileInput.value = null
            nameInput.value = null
        },
        disabled: true
    })
})()
