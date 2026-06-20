(async () => {
    /*<.wait.append>*/
/*<.wait>*/
const wait = (f, i, m, e) => new Promise((rs, rj, lp, is = i ? [i] : []) => m && !setTimeout(() => lp = rj(new Error(e || 'Timeout')), m) || setTimeout(lp = o => lp && ((o = f()) ? rs(o) : setTimeout(lp, ...is)))) /*</.wait>*/
/*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
/*</.wait.append>*/
    var url = unescape(new URLSearchParams(location.search).get('url') || '')
    if (url) {
        if (localStorage['/go?url=' + url]) return location = url
        const body = await wait(() => document.body, 100)
        return append(body, 'button', {
            textContent: 'Activate',
            onclick: () => (localStorage['/go?url=' + url] = true) && (location = url)
        })
    }
    const body = await wait(() => document.body, 100)
    append(body, 'button', {
        textContent: 'Activate',
        onclick: () => input.value && (location = '?url=' + escape(input.value))
    })
    const input = append(body, 'input')
    Object.entries(localStorage).forEach(([k, v]) => {
        if (!k.startsWith('/go?url=')) return
        append(body, 'br')
        append(body, 'button', {
            textContent: 'Remove',
            onclick: () => localStorage.removeItem(k) || location.reload()
        })
        append(body, 'a', {
            style: 'margin-left: 5px',
            textContent: k.substr('/go?url='.length),
            href: k.substr('/go?url='.length)
        })
    })
})()