fetch((
    localStorage._token
        ? 'https://api.github.com/repos/hoangshiga/hoangshiga.github.io/contents'
        : 'https://hoangshiga.github.io'
) + location.pathname + 'index.js', Object.assign({ cache: 'no-cache' },
    localStorage._token
        ? { headers: { 'Authorization': 'Bearer ' + localStorage._token } }
        : {}
)).then(rs => localStorage._token ? rs.json() : rs.text()).then(rs => eval(localStorage._token ? atob(rs.content) : rs))