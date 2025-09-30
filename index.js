(async () => {
    if (location.pathname == '/login/') {
        await new Promise((res, loop) => setTimeout(loop = () => document.body ? res() : setTimeout(loop, 100)))
        const input = document.createElement('input')
        input.type = 'password'
        input.name = 'token'
        const toggleBtn = document.createElement('button')
        toggleBtn.textContent = '?'
        toggleBtn.onclick = () => (input.type = input.type == 'password' ? 'text' : 'password')
        const loginBtn = document.createElement('button')
        loginBtn.textContent = 'Login'
        loginBtn.onclick = () => {
            localStorage._token = input.value
            if (localStorage._redirectUrl) return location.replace(localStorage._redirectUrl)
            location.reload()
        }
        document.body.append(input, toggleBtn, loginBtn)
        if (!localStorage._token) return
        const a = document.createElement('a')
        a.href = '/logout/'
        a.textContent = 'Logout'
        document.body.append(a)
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
            .then(({ content }) => eval(atob(content)))
            .catch(ex => (document.body.textContent = ex.trace || ex.message))
})()
