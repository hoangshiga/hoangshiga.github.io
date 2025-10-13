(async () => {
    await new Promise(res => setTimeout(res, 1000))
    console.log('test')
    document.body.append(Object.assign(document.createElement('button'), {
        textContent: 'Download',
        onclick: () => {
            const blob = new Blob(['test'], { type: 'text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'file.txt'
            link.click()
            URL.revokeObjectURL(link.href)
        }
    }))
})()