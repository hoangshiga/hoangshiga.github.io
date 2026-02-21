(async () => {
    await new Promise((r, l) => setTimeout(l = () => document.body ? r() : setTimeout(l, 100)))
    document.body.style = 'margin: 0; height: 100%; display: flex; flex-direction: column'
    document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Open',
        onclick: () => area.value.split("\n").forEach(u => u.trim() && open(u, '_blank'))
    }))
    const area = document.body.appendChild(Object.assign(document.createElement('textarea'), {
        style: 'flex: 1; resize: none'
    }))
})()