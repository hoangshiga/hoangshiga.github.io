(async () => {
    await new Promise(res => setTimeout(res, 1000))
    console.log('test')
    document.body.append(Object.assign(document.createElement('button'), {
        textContent: 'Download',
        onclick: () => {
            const content = 'test'
            const filename = 'file.txt'

            const blob = new Blob([content], { type: 'text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href)
        }
    }))
})()