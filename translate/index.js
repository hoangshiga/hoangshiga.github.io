(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const content = append(document.body, 'div')
    window.googleTranslateElementInit = async () => {
        window.translateElement = new google.translate.TranslateElement({
            pageLanguage: 'jp',
            translatePage: 'vi',
            //            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            includedLanguages: 'vi',
            autoDisplay: false,
        }, append(document.body, 'div'))
        window.content = append(document.body, 'div', { id: 'content' })
        const select = await new Promise((res, loop) => setTimeout(loop = o => (o = document.querySelector('.goog-te-combo')) && o.children.length ? res(o) : setTimeout(loop, 100)))
        select.value = 'vi'
        select.dispatchEvent(new Event('change', { bubbles: true }))
    }
    append(document.body, 'script', { src: 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' })
    window.addEventListener('message', async m => {
        console.log('child', m.data)
        if (m.data.translate) {
            Array.from(content.children).reverse().forEach(x => x.remove())
            const lines = m.data.translate.trim().split("\n")
            var d, t
            content.append(...lines.map(s => [
                (d = document.createElement('div')).textContent = s,
                t = d.textContent
            ] && d))
            await new Promise((r, l) => setTimeout(l = () => d.textContent != t ? r() : setTimeout(l, 100)))
            window.parent.postMessage({
                result: {
                    text: Array.from(content.children).map(d => d.textContent).join("\n"),
                    yomikata: (await Promise.all(lines.map(async line => (await Promise.all((await tokenizerPromise).tokenize(line).map(
                        async token => (await wanakanaPromise).toRomaji(token.reading)
                    ))).join(' ')))).join("\n")
                }
            }, '*')
        }
    })
    const text = decodeURIComponent(new URLSearchParams(location.search).get('text') || '')
    window.parent.postMessage(text ? { translate: text } : { init: true }, '*')
    const wanakanaPromise = new Promise(res => setTimeout(async loop => {
        append(document.head, 'script', { src: 'https://unpkg.com/wanakana@5.3.1/wanakana.min.js' })
        setTimeout(loop = o => (o = window.wanakana) ? res(o) : setTimeout(loop, 100))
    }))
    const tokenizerPromise = new Promise(res => setTimeout(async () => {
        append(document.head, 'script', { src: 'https://unpkg.com/kuromoji@0.1.2/build/kuromoji.js' })
        await new Promise((res, loop) => (loop = () => window.kuromoji ? res() : setTimeout(loop, 100))())
        const open = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function (_, url) {
            if (url.startsWith('https:/') && !url.startsWith('https://')) url = url.replace('https:/', 'https://')
            return open.apply(this, arguments)
        }
        kuromoji.builder({ dicPath: 'https://unpkg.com/kuromoji@0.1.2/dict/' }).build((err, tokenizer) => res(tokenizer))
    }))
})()
