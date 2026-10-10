(async () => {
    const openDB = () => new Promise((res, rej) => {
        const request = indexedDB.open('cache', 1)
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
        request.onupgradeneeded = () => !request.result.objectStoreNames.contains('data') && request.result.createObjectStore('data')
    })
    const saveData = (key, value) => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readwrite')
        transaction.oncomplete = () => res()
        transaction.onerror = () => rej(transaction.error)
        transaction.objectStore('data').put(value, key)
    })
    const getKeys = () => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readonly')
        const request = transaction.objectStore('data').getAllKeys()
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
    })
    const getData = key => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readonly')
        const request = transaction.objectStore('data').get(key)
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
    })
    const deleteData = key => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readwrite')
        const request = transaction.objectStore('data').delete(key)
        request.onsuccess = () => res()
        request.onerror = () => rej(request.error)
    })
    const getAllData = () => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readonly')
        const request = transaction.objectStore('data').getAll()
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
    })
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
    const reloadBtn = append(document.body, 'button', {
        textContent: 'Reload', onclick: () => location.reload()
    })
    const rs = await navigator.serviceWorker.getRegistrations()
    const installBtn = append(document.body, 'button', {
        textContent: 'Install', onclick: async () => {
            await fetchEval(goTo.token
                ? 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents/sw.js'
                : 'https://' + user + '.github.io/sw.js'
            )
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
    const showBtn = append(document.body, 'button', {
        textContent: 'ShowCache', onclick: () => {
            caches.keys().then(names => names.map(name => caches.open(name).then(
                async cache => console.log('ShowCache', [name, await cache.keys()])
            )))
        },
        disabled: !rs.length
    })
    const clearBtn = append(document.body, 'button', {
        textContent: 'ClearCache', onclick: async () => {
            await caches.keys().then(cacheNames => Promise.all(cacheNames.map(
                cacheName => caches.open(cacheName).then(cache => cache.keys().then(
                    keys => Promise.all(keys.map(key => cache.delete(key)))
                ))
            )))
            caches.keys().then(names => names.map(name => caches.open(name).then(
                async cache => console.log('ClearCache', [name, await cache.keys()])
            )))
        },
        disabled: !rs.length
    })
    const showDbBtn = append(document.body, 'button', {
        textContent: 'ShowDb', onclick: async () => {
            console.log('ShowDb', await (await getKeys()).reduce(async (ar, url) => (await ar).concat(Object.assign({ url }, await getData(url))), []))
        },
        disabled: !rs.length
    })
    const clearDbBtn = append(document.body, 'button', {
        textContent: 'ClearDb', onclick: async () => {
            for (const url of await getKeys()) await deleteData(url)
        },
        disabled: !rs.length
    })
    const logFlag = await getData('logFlag')
    const logOnBtn = append(document.body, 'button', {
        textContent: 'LogOn', onclick: async () => {
            await saveData('logFlag', true)
            logOnBtn.disabled = !logOnBtn.disabled
            logOffBtn.disabled = !logOffBtn.disabled
        },
        disabled: !!logFlag
    })
    const logOffBtn = append(document.body, 'button', {
        textContent: 'LogOff', onclick: async () => {
            await saveData('logFlag', false)
            logOnBtn.disabled = !logOnBtn.disabled
            logOffBtn.disabled = !logOffBtn.disabled
        },
        disabled: !logFlag
    })
    input.focus()
    await eval(await (await fetch('https://unpkg.com/vue@3/dist/vue.global.js')).text() + ';window.Vue = Vue')
    // Vue.config.warnHandler = _ => _
    const urls = await (await getKeys()).filter(url => !['logFlag'].includes(url)).reduce(async (ar, url) => (await ar).concat(Object.assign({ url }, await getData(url))), [])
    const store = Vue.reactive({ urls: urls.sort((a, b) => a.index - b.index) })
    const app = window.app = Vue.createApp({
        template: `
            <table :style="tableStyle">
                <tr>
                    <th :style="tdStyle">Url</th>
                    <th :style="tdStyle">Type</th>
                    <th :style="tdStyle">Actions</th>
                </tr>
                <template v-for="data in datas">
                    <tr>
                        <th :style="tdStyle" colspan="2">Url status {{ data.status }}: {{ data.name }}</th>
                        <th :style="tdStyle">
                            <button v-if="datas.length" @click="removeAll(data)">Remove All</button>
                        </th>
                    </tr>
                    <tr v-for="(url, index) in data.urls" :style="trStyle(index)">
                        <td :style="tdStyle">{{ url.url }}</td>
                        <td :style="tdStyle">{{ url.type }}:{{ url.index }}</td>
                        <td :style="tdStyle">
                            <div style="white-space: nowrap">
                                <button v-if="data.status != 0" @click="update(url, 0)">Unknow</button>
                                <button v-if="data.status != 1" @click="update(url, 1)">Caching</button>
                                <button v-if="data.status != 2" @click="update(url, 2)">Recache</button>
                                <button v-if="data.status != 3" @click="update(url, 3)">Uncache</button>
                                <button v-if="data.status != null" @click="url.status = null">Remove</button>
                            </div>
                        </td>
                    </tr>
                </template>
            </table>
        `,
        computed: {
            datas() {
                return [{
                    status: 0, name: 'Unknow',
                    urls: store.urls.filter(o => o.status == 0),
                }, {
                    status: 1, name: 'Caching',
                    urls: store.urls.filter(o => o.status == 1),
                }, {
                    status: 2, name: 'Recache',
                    urls: store.urls.filter(o => o.status == 2),
                }, {
                    status: 3, name: 'Uncache',
                    urls: store.urls.filter(o => o.status == 3),
                }]
            },
            tableStyle() { return 'border-collapse: collapse' },
            tdStyle() { return 'border: 1px solid #ddd; padding: 0 5px' },
        },
        methods: {
            trStyle(i) { return i % 2 == 0 ? '' : 'background: #f4f4f4' },
            async removeAll(data) {
                for (const url of data.urls) {
                    await deleteData(url.url)
                    url.status = null
                }
            },
            async update(url, status) {
                await saveData(url.url, { status, type: url.type, index: url.index })
                url.status = status
            },
        }
    })
    app.config.warnHandler = _ => _
    app.mount(append(document.body, 'div'))
})()