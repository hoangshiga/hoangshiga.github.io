(async () => {
    document.body.append(Object.assign(document.createElement('button'), {
        textContent: 'Blob',
        onclick: () => {
            const blob = new Blob(['test'], { type: 'text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'file.txt'
            link.click()
            URL.revokeObjectURL(link.href)
        }
    }))
    document.body.append(Object.assign(document.createElement('a'), {
        textContent: 'File',
        href: 'https://kitsunekko.net/subtitles/japanese/.hack%20G.U/[AME][.hack%20G.U.%20Returner][DVDRIP][BIG5&JIS].jpn.ssa'
    }))
})()