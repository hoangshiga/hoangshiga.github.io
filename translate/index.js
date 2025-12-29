(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    if (new URLSearchParams(location.search).has('iframe')) {
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
            console.log('translate', m.data)
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
                    returnTranslate: {
                        text: Array.from(content.children).map(d => d.textContent).join("\n"),
                        yomikata: (await Promise.all(lines.map(async line => (await Promise.all((await tokenizerPromise).tokenize(line).map(
                            async token => (await wanakanaPromise).toRomaji(token.reading)
                        ))).join(' ')))).join("\n")
                    }
                }, '*')
            }
        })
        window.parent.postMessage({ translateInit: true }, '*')
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
    } else {
        window.addEventListener('message', async m => {
            console.log('translate', m.data)
            if (m.data.returnTypeValue) {
                if (!window.translate) {
                    const i = document.createElement('iframe')
                    i.style = 'position: fixed; z-index: 99999; left: 0; top: 0; width: 100vw; height: 100vh; background: white; pointer-events: none; opacity: 0'
                    i.src = 'https://hoangshiga.github.io/translate/?iframe'
                    var promise
                    window.addEventListener('message', m => {
                        console.log('parent', m.data)
                        if (m.data.translateInit) window.translate = (s, res) => {
                            promise = Object.assign(new Promise(r => [res = r]), { res })
                            i.contentWindow.postMessage({ translate: s }, '*')
                            return promise
                        }
                        if (m.data.returnTranslate) promise.res(m.data.returnTranslate)
                    })
                    document.body.append(i)
                    await new Promise((r, l) => setTimeout(l = () => window.translate ? r() : setTimeout(l, 100)))
                }
                const result = await translate(selection)
                Object.assign(pre, { textContent: selection + "\n" + result.yomikata + "\n" }).append(
                    Object.assign(document.createElement('pre'), { textContent: result.text, style: 'font-family: math; white-space: break-spaces; color: black' })
                )
            }
        })
        const iframe = append(document.body, 'iframe', {
            style: 'width: 100%; height: 40%', src: 'https://hoangshiga.github.io/type/'
        })
        append(document.body, 'button', {
            textContent: 'Translate', onclick: () => iframe.contentWindow.postMessage({ getTypeValue: true }, '*')
        })
        const pre = append(document.body, 'pre', {
            style: 'position: fixed; z-index: 999999; border: 1px solid black; border-radius: 5px; background: white; padding: 2px 5px; font-family: math; white-space: break-spaces'
        })
    }
})()
