console.log('test')
document.body.append(Object.assign(document.createElement('button'), {
    textContent: 'Download',
    onclick: () => {
        const url = URL.createObjectURL(new Blob(['test ok']))
        const a = document.createElement('button')
        a.href = url
        a.style = 'display: none'
        a.download = 'test.txt'
        document.body.append(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }
}))