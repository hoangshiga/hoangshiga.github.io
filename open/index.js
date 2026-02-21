(async () => {
    await new Promise((r, l) => setTimeout(l = () => document.body ? r() : setTimeout(l, 100)))
    document.body.style = 'display: flex'
    document.body.appendChild(Object.assign(document.createElement('button'), {
        onclick: () => area.value.split("\n").forEach(u => u.trim() && open(u, '_blank'))
    }))
    const area = document.body.appendChild(Object.assign(document.createElement('textarea'), {
        style: 'flex: 1'
    }))
})()