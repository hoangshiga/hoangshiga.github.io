(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const area = append(document.body, 'textarea', { style: 'width: 100%; height: 40%' })
    append(document.body, 'button', {
        textContent: 'OK', onclick: () => {
            for (const el of Array.from(document.querySelectorAll('area,button'))) el.remove()
            append(document.body, 'pre', {
                style: 'margin: 0; padding: 2px 5px; font-family: math; white-space: break-spaces',
                textContent: localStorage[location.pathname] = area.value
            })
        }
    })
    if (localStorage[location.pathname]) {
        append(document.body, 'button', {
            textContent: 'Load', onclick: () => {
                area.value = localStorage[location.pathname]
            }
        })
        append(document.body, 'button', {
            textContent: 'Clear', onclick: () => {
                for (const el of [loadBtn, clearBtn]) if (el) el.remove()
                localStorage.removeItem(location.pathname)
            }
        })
    }
})()
