(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.body, 'button', {
        textContent: 'Download', onclick: () => {
            const href = URL.createObjectURL(new Blob(['Test']))
            Object.assign(document.createElement('a'), { href, download: 'Test.txt' }).click()
            URL.revokeObjectURL(href)
        }
    })
})()