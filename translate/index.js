(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const content = append(document.body, 'div')
    const text = decodeURIComponent(new URLSearchParams(location.search).get('text') || '')
    if (text) {
        content.append(...text.split("\n").map((s, d) => [(d = document.createElement('div')).textContent = s] && d))
    }
    window.googleTranslateElementInit = async () => {
        window.translateElement = new google.translate.TranslateElement({
            pageLanguage: 'jp',
            translatePage: 'vi',
            //            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            includedLanguages: 'vi',
            autoDisplay: false,
        }, append(document.body, 'div'))
        window.content = append(document.body, 'div', { id: 'content' })
        const select = await new Promise((res, loop) => setTimeout(loop = o => !(o = document.querySelector('.goog-te-combo')) && setTimeout(loop, 100) || res(o)));
        await new Promise(res => setTimeout(res, 1000));
        select.value = 'vi';
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    append(document.body, 'script', { src: 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' })
    window.addEventListener('message', m => {
        if (!m.data.toChild) return
        console.log('message', m) || window.parent.postMessage({ toParent: m.data.data }, '*')
    })
    window.parent.postMessage({ toParent: 'init' }, '*')
})()
