(async () => {
    const click = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function () {
        if (this.href.startsWith('blob')) {
            console.log([this.href, this.download])
            fetch(this.href).then(rs => rs.blob()).then(blob => {
                console.log('blob', window.blob = blob)
                const reader = new FileReader();
                reader.onloadend = () => Android.downloadBlob(reader.result.split(',')[1], filename);
                reader.readAsDataURL(blob);
            })
        }
        return click.apply(this, arguments)
    }
    await new Promise(res => setTimeout(res, 1000))
    console.log('test')
    document.body.append(Object.assign(document.createElement('button'), {
        textContent: 'Download',
        onclick: () => {
            const blob = new Blob(['test'], { type: 'text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'file.txt'
            document.body.append(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(link.href)
        }
    }))
})()