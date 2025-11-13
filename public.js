fetch('https://api.github.com/repos/hoangshiga/hoangshiga.github.io/contents' + location.pathname + 'index.js',
    { cache: 'no-cache' }
).then(rs => rs.json()).then(rs => eval(atob(rs.content)))