document.body.append(Object.assign(document.createElement('button'), {
    textContent: 'Download',
    onclick: a => {
        document.body.append(a = Object.assign(document.createElement('button'), {
            href: URL.createObjectURL(new Blob([['test ok']])),
            style: 'display: none',
            download: 'test.txt'
        }))
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }
}))