(async () => {
    /*<.append>*/
    const append = Object.assign((...as) => (Array.isArray(as[0]) ? as : [as]).map(a => append._('append', ...a)).pop(), {
        _: (f, p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p[f](t), t)
    })/*</.append>*/
    
    const api = await Api('hoangshiga/hoangshiga.github.io', goTo.token, goTo.key)
    const fileInput = append(document.body, 'input', {
        type: 'file', onchange: () => {
            button.disabled = !fileInput.files.length
            if (!button.disabled) button.textContent = 'Upload'
        }
    })
    const nameInput = append(document.body, 'input')
    const button = append(document.body, 'button', {
        textContent: 'Upload', onclick: async () => {
            button.disabled = true
            button.textContent = 'Uploading...'
            const file = fileInput.files[0]
            const name = nameInput.value
            await api.uploadEncode(api.escape('files', name), file)
            button.textContent = 'Done'
            fileInput.value = null
        },
        disabled: true
    })
})()
