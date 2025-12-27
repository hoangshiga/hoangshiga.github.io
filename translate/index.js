(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const content = append(document.body, 'div')
    const text = decodeURIComponent(new URLSearchParams(location.search).get('text') || '')
    if (text) content.append(...text.split("\n").map((s, d) => [(d = document.createElement('div')).textContent = s] && d))
    window.googleTranslateElementInit = async () => {
        window.translateElement = new google.translate.TranslateElement({
            pageLanguage: 'jp',
            translatePage: 'vi',
            //            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            includedLanguages: 'vi',
            autoDisplay: false,
        }, append(document.body, 'div'))
        window.content = append(document.body, 'div', { id: 'content' })
        const select = await new Promise((res, loop) => setTimeout(loop = o => (o = document.querySelector('.goog-te-combo')) ? console.log(o.children) || res(o) : setTimeout(loop, 100)));
        await new Promise(res => setTimeout(res, 1000));
        select.value = 'vi';
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    append(document.body, 'script', { src: 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' })
    window.addEventListener('message', async m => {
        console.log('child', m.data)
        if (m.data.translate) {
            Array.from(content.children).reverse().forEach(x => x.remove())
            var d, t
            content.append(...m.data.translate.trim().split("\n").map(s => [
                (d = document.createElement('div')).textContent = s,
                t = d.textContent
            ] && d))
            await new Promise((r, l) => setTimeout(l = () => d.textContent != t ? r() : setTimeout(l, 100)))
            window.parent.postMessage({ result: Array.from(content.children).map(d => d.textContent).join("\n") }, '*')
        }
    })
    window.parent.postMessage({ init: true }, '*')
    const wanakanaPromise = new Promise(res => setTimeout(async loop => {
        append(document.head, 'script', { src: 'https://unpkg.com/wanakana@5.3.1/wanakana.min.js' })
        setTimeout(loop = () => !window.wanakana ? res() : setTimeout(loop, 100))
    }))
    const tokenizerPromise = new Promise(res => setTimeout(async () => {
        append(document.head, 'script', { src: 'https://unpkg.com/kuromoji@0.1.2/build/kuromoji.js' })
        await new Promise((res, loop) => (loop = () => !window.kuromoji ? res() : setTimeout(loop, 100))())
        const open = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function (_, url) {
            if (url.startsWith('https:/') && !url.startsWith('https://')) url = url.replace('https:/', 'https://')
            return open.apply(this, arguments)
        }
        kuromoji.builder({ dicPath: 'https://unpkg.com/kuromoji@0.1.2/dict/' }).build((err, tokenizer) => res(tokenizer))
    }))
})()
