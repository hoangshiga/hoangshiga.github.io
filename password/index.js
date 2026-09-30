(async () => {
    /*<.append.CryptoJS>*/
/*<.append>*/
        const append = Object.assign((...as) => (Array.isArray(as[0]) ? as : [as]).map(a => append._('append', ...a)).pop(), {
            _: (f, p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p[f](t), t)
        })/*</.append>*/
/*<.CryptoJS>*/
    const CryptoJS = await Promise.try(async (module = {}, exports = {}) => eval(await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')).text()) && exports) /*</.CryptoJS>*/
/*</.append.CryptoJS>*/
    window.CryptoJS = CryptoJS
    const pwInput = append(document.body, 'input', { type: 'password' })
    append(document.body, 'hr')
    append(document.body, 'button', {
        textContent: 'AES encrypt',
        onclick: () => {
            encryptedOutput.value = CryptoJS.AES.encrypt(textToEncryptInput.value, pwInput.value).toString()
        }
    })
    append(document.body, 'button', {
        textContent: 'AES encrypt pw 1000 * 1000',
        onclick: () => {
            encryptedOutput.value = CryptoJS.AES.encrypt(textToEncryptInput.value, pwInput.value.repeat(1000 * 1000)).toString()
        }
    })
    const textToEncryptInput = append(document.body, 'input', { style: 'width: 100%' })
    const encryptedOutput = append(document.body, 'input', { style: 'width: 100%' })
    append(document.body, 'hr')
    append(document.body, 'button', {
        textContent: 'AES decrypt',
        onclick: () => {
            decryptedOutput.value = CryptoJS.AES.decrypt(textToDecryptInput.value, pwInput.value).toString(CryptoJS.enc.Utf8)
        }
    })
    append(document.body, 'button', {
        textContent: 'AES decrypt pw 1000 * 1000',
        onclick: () => {
            decryptedOutput.value = CryptoJS.AES.decrypt(textToDecryptInput.value, pwInput.value.repeat(1000 * 1000)).toString(CryptoJS.enc.Utf8)
        }
    })
    const textToDecryptInput = append(document.body, 'input', { style: 'width: 100%' })
    const decryptedOutput = append(document.body, 'input', { style: 'width: 100%' })
    append(document.body, 'hr')
    append(document.body, 'button', {
        textContent: 'SHA-512',
        onclick: async () => {
            sha512Output.value = btoa(Array.from(new Uint8Array(
                await crypto.subtle.digest('SHA-512', new TextEncoder().encode(pwInput.value))
            ), b => String.fromCharCode(b)).join(''))
        }
    })
    append(document.body, 'button', {
        textContent: 'SHA-512 1000 * 1000',
        onclick: async () => {
            sha512Output.value = btoa(Array.from(new Uint8Array(
                await crypto.subtle.digest('SHA-512', new TextEncoder().encode(pwInput.value.repeat(1000 * 1000 * 10)))
            ), b => String.fromCharCode(b)).join(''))
        }
    })
    const sha512Button = append(document.body, 'button', {
        updateTextContent: () => sha512Button.textContent = 'SHA-512 pw ' + loopInput.value,
        onclick: async () => {
            const loop = Number(loopInput.value)
            sha512Output.value = await Array(loop).fill().reduce(async o => btoa(Array.from(new Uint8Array(
                await crypto.subtle.digest('SHA-512', new TextEncoder().encode((await o).repeat(loop)))
            ), b => String.fromCharCode(b)).join('')), pwInput.value)
            const key = Array.from(atob(sha512Output.value).split(''), c => c.charCodeAt(0))
            tokenEncryptedOutput.value = btoa(Array.from(new TextEncoder().encode(tokenInput.value), (b, i) => String.fromCharCode(b ^ key[i % key.length])).join(''))
            tokenDecryptedOutput.value = new TextDecoder().decode(Uint8Array.from(atob(tokenEncryptedOutput.value).split(''), (c, i) => c.charCodeAt(0) ^ key[i % key.length]))
        }
    })
    append(document.body, 'br')
    append(document.body, 'label', { textContent: 'loopInput' })
    const loopInput = append(document.body, 'input', {
        type: 'number',
        style: 'width: 100%',
        value: 1000,
        onchange: () => sha512Button.updateTextContent()
    })
    sha512Button.updateTextContent()
    append(document.body, 'label', { textContent: 'sha512Output' })
    const sha512Output = append(document.body, 'input', { style: 'width: 100%' })
    append(document.body, 'label', { textContent: 'tokenInput' })
    const tokenInput = append(document.body, 'input', { style: 'width: 100%' })
    append(document.body, 'label', { textContent: 'tokenEncryptedOutput' })
    const tokenEncryptedOutput = append(document.body, 'input', { style: 'width: 100%' })
    append(document.body, 'label', { textContent: 'tokenDecryptedOutput' })
    const tokenDecryptedOutput = append(document.body, 'input', { style: 'width: 100%' })
})()