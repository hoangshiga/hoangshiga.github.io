console.log('test')
document.body.append(Object.assign(document.createElement('button'), {
    textContent: 'Download',
    onclick: a => {
        const url = URL.createObjectURL(new Blob([['test ok']]))
        document.body.append(Object.assign(a = document.createElement('button'), {
            href: url,
            style: 'display: none',
            download: 'test.txt'
        }))
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }
}))