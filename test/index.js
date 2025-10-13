(async () => {
    await new Promise(res => setTimeout(res, 1000))
    console.log('test')
    document.body.append(Object.assign(document.createElement('button'), {
        textContent: 'Download',
        onclick: async () => {
            const url = URL.createObjectURL(await (await fetch('https://hoangshiga.github.io/test/')).blob())
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
})()