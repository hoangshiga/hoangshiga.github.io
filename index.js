(localStorage._token = localStorage._token || prompt('token') || '') && (
    location.host == 'localhost'
        ? fetch('/hoangshiga/' + location.pathname.split('/').slice(-2)[0] + '/index.js').then(res => res.text()).then(eval)
        : fetch('https://api.github.com/repos/hoangshiga/hoangshiga/contents/' + location.pathname.split('/').slice(-2)[0] + '/index.js', { headers: { 'Authorization': 'Bearer ' + localStorage._token } })
            .then(res => res.json()).then(({ content }) => eval(atob(content)))
)