(async () => {
    /*<.$.wait.append.copy>*/
/*<.$>*/
    const $ = (s, i, ws, x) => (ws = d => !x && d ? (x = d.querySelector(s)) || i && !Array.from(d.querySelectorAll('frame,iframe'), i => ws(i.contentDocument)) || x : x)(document) && x
    const $$ = (s, i, ws) => (ws = d => d ? [d, ...Array.from(!!i && d.querySelectorAll('frame,iframe'), i => ws(i.contentDocument)).flat()] : [])(document).map(d => [...d.querySelectorAll(s)]).flat()
    const [log, out, int, en, de] = [Object.assign((...a) => !log.disabled && console.log(...a) || a.pop()), setTimeout, setInterval, encodeURIComponent, decodeURIComponent]
    const urlStart = (...u) => u.some(u => Array.isArray(u) ? (u[0] || '').startsWith(u[1]) : location.href.startsWith(u)) /*</.$>*/
/*<.wait>*/
const wait = (f, i, m, e) => new Promise((rs, rj, lp, is = i ? [i] : []) => m && !setTimeout(() => lp = rj(new Error(e || 'Timeout')), m) || setTimeout(lp = o => lp && ((o = f()) ? rs(o) : setTimeout(lp, ...is)))) /*</.wait>*/
/*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
/*<.copy>*/
    const copy = s => {
        const input = append(document.body, 'input', { value: s, style: 'position: fixed' })
        input.focus()
        input.select()
        document.execCommand('copy')
        input.remove()
    } /*</.copy>*/
/*</.$.wait.append.copy>*/
    var url = de(new URLSearchParams(location.search).get('url') || '')
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
            onclick: () => input.value && (location = '?url=' + en(input.value))
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
            const update = () => Object.assign(a, {
                textContent: url + (v == url ? '' : ' -----> ' + v),
                href: v
            })
            append(body, 'button', {
                textContent: 'Edit',
                onclick: () => {
                    const url = prompt('Edit: ' + v, v)
                    if (!url) return
                    v = localStorage[k] = url
                    update()
                }
            })
            append(body, 'button', {
                textContent: 'Link',
                onclick: () => {
                    const url = location.origin + location.pathname + '?url=' + en(v)
                    copy(url)
                    alert('Copied: ' + url)
                }
            })
            const a = append(body, 'a', { style: 'margin-left: 5px' })
            update()
        })
    }
})()