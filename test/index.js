document.body.append(Object.assign(document.createElement('button'), {
    textContent: 'Download',
    onclick: () => {
        const url = URL.createObjectURL(new Blob([['test ok']]))
        const a = append(document.body, 'a', { href: url, style: 'display: none', download: 'test.txt' })
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }
}))