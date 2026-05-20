(async () => {
    var url = new URLSearchParams(location.search).get('url')
    if (url) {
        url = unescape(url)
        if (localStorage['/go?url=' + url]) return (location = url)
        var button = document.createElement('button')
        button.textContent = 'Activate'
        button.onclick = () => (localStorage['/go?url=' + url] = true) && (location = url)
        await new Promise((res, loop) => (loop = () => !document.body && setTimeout(loop) || res())())
        return document.body.append(button)
    }
    var input = document.createElement('input')
    var button = document.createElement('button')
    button.textContent = 'Activate'
    button.onclick = () => input.value && (location = '?url=' + escape(input.value))
    await new Promise((res, loop) => (loop = () => !document.body && setTimeout(loop) || res())())
    document.body.append(button, input)
    Object.entries(localStorage).forEach(([k, v]) => {
        if (!k.startsWith('/go?url=')) return
        var button = document.createElement('button')
        button.textContent = 'Remove: ' + k.substr('/go?url='.length)
        button.onclick = () => localStorage.removeItem(k) || location.reload()
        document.body.append(document.createElement('br'), button)
    })
})()