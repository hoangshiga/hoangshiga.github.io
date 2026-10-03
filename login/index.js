(async () => {
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
            await handleFetch(goTo.token
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
    await eval(await (await fetch('https://unpkg.com/vue@3/dist/vue.global.js')).text() + ';window.Vue = Vue')
    const urls = await (await getKeys()).reduce(async (ar, url) => (await ar).concat({ url, status: await getData(url) }), [])
    console.log('urls', urls)
    const store = Vue.reactive({ urls })
    const app = Vue.createApp({
        template: `
            <table :style="tableStyle">
                <tr>
                    <th :style="tdStyle">Url</th>
                    <th :style="tdStyle">Status</th>
                    <th :style="tdStyle">Actions</th>
                </tr>
                <template v-for="data in datas">
                    <tr><th :style="tdStyle" colspan="2">Url status {{ data.status }}: {{ data.name }}</th></tr>
                    <tr v-for="url in data.urls">
                        <td :style="tdStyle">{{ url.url }}</td>
                        <td :style="tdStyle">{{ url.status }}</td>
                        <td :style="tdStyle">
                            <button v-if="data.status != 0" @click="update(url, 0)">0</button>
                            <button v-if="data.status != 1" @click="update(url, 1)">1</button>
                            <button v-if="data.status != 2" @click="update(url, 2)">2</button>
                            <button v-if="data.status != null" @click="url.status = null">Remove</button>
                        </td>
                    </tr>
                </template>
            </table>
        `,
        data() { return { store } },
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
                    urls: store.urls.filter(o => o.status == 2),
                }]
            },
            tableStyle() { return 'border-collapse: collapse' },
            tdStyle() { return 'border: 1px solid #ddd; padding: 0 5px' },
        },
        methods: {
            async update(url, status) {
                await saveData(url.url, status)
                url.status = status
            },
        }
    })
    app.mount(append(document.body, 'div'))
})()