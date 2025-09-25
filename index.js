switch (location.pathname) {
    case '/login/':
        var input = document.createElement('input')
        input.type = 'password'
        input.name = 'token'
        var button = document.createElement('button')
        button.textContent = 'Login'
        button.onclick = () => (localStorage._token = input.value) && localStorage._redirectUrl && location.replace(localStorage._redirectUrl)
        document.body.append(input, button)
        break
    case '/logout/':
        delete localStorage._token
        location.replace('/login/')
        break
    default:
        delete localStorage._redirectUrl
        location.host == 'localhost'
            ? fetch('/hoangshiga/' + location.pathname.split('/').slice(-2)[0] + '/index.js').then(res => res.text()).then(eval)
            : fetch('https://api.github.com/repos/hoangshiga/hoangshiga/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js', {
                headers: { 'Authorization': 'Bearer ' + localStorage._token }
            }).then(res => res.json()).then(({ content }) => eval(atob(content)))
                .catch(ex => (localStorage._redirectUrl = location.href, location.replace('/login/')))
}