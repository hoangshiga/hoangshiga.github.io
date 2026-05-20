(async () => {
    /*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
    await new Promise((rs, lp) => setTimeout(lp = () => document.body ? rs() : setTimeout(lp, 100)))
    append(document.body, 'h2', { textContent: 'Welcome to my site !!!' })
    append(document.body, 'a', { textContent: 'Editor', href: '/editor/' })
})()
