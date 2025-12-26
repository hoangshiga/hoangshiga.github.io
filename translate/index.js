(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    append(document.head, 'meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
    const content = append(document.body, 'div')
    console.log(window.content = content)
    // const text = decodeURIComponent(new URLSearchParams(location.search).get('text') || '')
    // if (text) document.body.append(...text.split("\n").map((s, div) => [(div = document.createElement('div')).textContent = s] && div))
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
})()
