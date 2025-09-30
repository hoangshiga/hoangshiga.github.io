(async () => {
    const append = (p, t, o) => p.append(t = document.createElement(t)) || Object.assign(t, o || {})
    if (location.pathname == '/login/') {
        await new Promise((res, loop) => setTimeout(loop = () => document.body ? res() : setTimeout(loop, 100)))
        const input = append(document.body, 'input', { type: 'password', name: 'token' })
        append(document.body, 'button', {
            textContent: '?', onclick: () => (input.type = input.type == 'password' ? 'text' : 'password')
        })
        append(document.body, 'button', {
            textContent: 'Login', onclick: () => {
                localStorage._token = input.value
                if (localStorage._redirectUrl) return location.replace(localStorage._redirectUrl)
                location.reload()
            }
        })
        if (!localStorage._token) return
        append(document.body, 'a', { textContent: 'Logout', href: '/logout/' })
        return
    }
    if (location.pathname == '/logout/') {
        delete localStorage._token
        location.replace('/login/')
        return
    }
    delete localStorage._redirectUrl
    location.host == 'localhost'
        ? fetch('/hoangshiga/' + location.pathname.split('/').slice(-2)[0] + '/index.js').then(res => res.text()).then(eval)
        : fetch('https://api.github.com/repos/hoangshiga/hoangshiga/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js', {
            headers: { 'Authorization': 'Bearer ' + localStorage._token }
        }).then(res => res.status == 401 ? (localStorage._redirectUrl = location.href, location.replace('/login/')) : res.json())
            .then(({ content = '' }) => eval(atob(content)))
            .catch(ex => append(document.body, 'pre', {
                textContent: ex.stack || ex.message || ex, name: 'token', style: 'font-family: math'
            }))
})()
