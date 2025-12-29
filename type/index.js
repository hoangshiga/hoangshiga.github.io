(async () => {
    const textarea = document.body.appendChild(Object.assign(document.createElement('textarea'), {
        style: 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; resize: none; font-family: math; font-size: medium'
    })).focus()
    document.head.appendChild(Object.assign(document.createElement('script'), {
        src: '../avim.js'
    }))
    window.addEventListener('message', async m => {
        console.log('type', m.data)
        if (m.data.getTypeValue) window.parent.postMessage({ returnTypeValue: textarea.value }, '*')
    })
    window.parent.postMessage({ typeInit: true }, '*')
})()