localStorage._token
    ? fetch('https://api.github.com/repos/hoangshiga/hoangshiga.github.io/contents' + location.pathname + 'index.js',
        { headers: { 'Authorization': 'Bearer ' + localStorage._token }, cache: 'no-cache' }
    ).then(rs => rs.json()).then(rs => eval(atob(rs.content)))
    : fetch('https://hoangshiga.github.io' + location.pathname + 'index.js',
        { cache: 'no-cache' }
    ).then(rs => rs.text()).then(rs => eval(rs))
