(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    var valueOld = ''
    const textarea = append(document.body, 'textarea', {
        style: 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; resize: none; font-family: math; font-size: medium',
        onkeydown: () => setTimeout(valueNew => (valueNew = textarea.value) != valueOld && [valueOld = valueNew, window.parent.postMessage({ onTypeValueChanged: valueNew }, '*')], 100)
    })
    textarea.focus()
    append(document.head, 'script', { src: '../avim.js' })
    window.addEventListener('message', async m => {
        console.log('type', m.data)
        if (m.data.getTypeValue) window.parent.postMessage({ returnTypeValue: textarea.value }, '*')
    })
    window.parent.postMessage({ typeInit: true }, '*')
})()