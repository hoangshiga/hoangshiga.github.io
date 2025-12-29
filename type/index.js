const textarea = document.body.appendChild(Object.assign(document.createElement('textarea'), {
    style: 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; resize: none; font-family: math; font-size: medium'
})).focus()
document.head.appendChild(Object.assign(document.createElement('script'), {
    src: '../avim.js'
}))
window.addEventListener('message', async m => {
    console.log('child', m.data)
    if (m.data.getValue) window.parent.postMessage({ value: textarea.value }, '*')
})
window.parent.postMessage({ init: true }, '*')