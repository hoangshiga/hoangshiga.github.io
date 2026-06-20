(async () => {
    /*<.wait.append>*/
/*<.wait>*/
const wait = (f, i, m, e) => new Promise((rs, rj, lp, is = i ? [i] : []) => m && !setTimeout(() => lp = rj(new Error(e || 'Timeout')), m) || setTimeout(lp = o => lp && ((o = f()) ? rs(o) : setTimeout(lp, ...is)))) /*</.wait>*/
/*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
/*</.wait.append>*/
    var url = decodeURIComponent(new URLSearchParams(location.search).get('url') || '')
    if (url && localStorage['/go?url=' + url]) return location = url
    const body = await wait(() => document.body, 100)
    if (url) {
        append(body, 'button', {
            textContent: 'Activate',
            onclick: () => (localStorage['/go?url=' + url] = url) && (location = url)
        })
        append(body, 'a', { style: 'margin-left: 5px', textContent: url, href: url })
    } else {
        append(body, 'button', {
            textContent: 'Activate',
            onclick: () => input.value && (location = '?url=' + escape(input.value))
        })
        const input = append(body, 'input')
        Object.entries(localStorage).forEach(([k, v]) => {
            if (!k.startsWith('/go?url=')) return
            const url = k.substr('/go?url='.length)
            append(body, 'br')
            append(body, 'button', {
                textContent: 'Remove',
                onclick: () => localStorage.removeItem(k) || location.reload()
            })
            v = v == 'true' ? url : v
            const update = () => {
                if (v == url) return
                a.textContent = url + '  ==>  ' + v
                a.href = v
            }
            append(body, 'button', {
                textContent: 'Edit',
                onclick: () => {
                    const url = prompt('Edit: ' + v, v)
                    if (!url) return
                    v = localStorage[k] = url
                    update()
                }
            })
            const a = append(body, 'a', { style: 'margin-left: 5px', textContent: url, href: url })
            update()
        })
    }
})()