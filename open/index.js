(async () => {
    /*<.wait.append>*/
/*<.wait>*/
const wait = (f, i, m, e) => new Promise((rs, rj, lp) => m && !setTimeout(() => lp = rj(new Error(e || 'Timeout')), m) || setTimeout(lp = o => lp && ((o = f()) ? rs(o) : setTimeout(lp, i)))) /*</.wait>*/
/*<.append>*/
        const append = Object.assign((...as) => (Array.isArray(as[0]) ? as : [as]).map(a => append._('append', ...a)).pop(), {
            _: (f, p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p[f](t), t)
        })/*</.append>*/
/*</.wait.append>*/
    const body = await wait(() => document.body, 100)
    body.style = 'margin: 0; height: 100%; display: flex; flex-direction: column'
    const div = append(body, 'div')
    append(div, 'button', { textContent: 'Open', onclick: () => area.value.split("\n").forEach(u => u.trim() && open(u, '_blank')) })
    append(div, 'button', { textContent: 'Clear', onclick: () => area.value = '' })
    const area = append(body, 'textarea', { style: 'flex: 1; resize: none' })
})()