fetch((
    localStorage._token
        ? 'https://api.github.com/repos/hoangshiga/hoangshiga.github.io/contents'
        : 'https://hoangshiga.github.io'
) + location.pathname + 'index.js', Object.assign({ cache: 'no-cache' },
    localStorage._token
        ? { headers: { 'Authorization': 'Bearer ' + localStorage._token } }
        : {}
)).then(rs => rs.json()).then(rs => eval(atob(rs.content)))