(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const area = append(document.body, 'textarea', { style: 'width: 100%; height: 40%' })
    var index = 0
    while (++index < localStorage.length) if (!localStorage[location.pathname + index]) break
    append(document.body, 'button', {
        textContent: 'OK', onclick: () => {
            for (const el of Array.from(document.querySelectorAll('textarea,button'))) el.remove()
            append(document.body, 'pre', {
                style: 'margin: 0; padding: 2px 5px; font-family: math; white-space: break-spaces',
                textContent: localStorage[location.pathname + index] = area.value
            })
        }
    })
    for (const key in localStorage) {
        if (!key.startsWith(location.pathname)) continue
        const i = key.substr(location.pathname.length)
        const loadBtn = append(document.body, 'button', {
            textContent: 'Load ' + i, onclick: () => {
                index = i
                area.value = localStorage[key]
            }
        })
        const clearBtn = append(document.body, 'button', {
            textContent: 'Clear ' + i, onclick: () => {
                for (const el of [loadBtn, clearBtn]) el.remove()
                localStorage.removeItem(key)
            }
        })
    }
})()
