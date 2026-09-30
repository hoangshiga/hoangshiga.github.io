(async () => {
    document.head.appendChild(Object.assign(document.createElement('style'), {
        textContent: `
            body { margin: 0; }
            input { width: 100%; height: 100%; opacity: 0; }
            img { max-width: 100%; max-height: 100%; }
    `}))
    document.body.appendChild(Object.assign(document.createElement('input'), { id: 'files', type: 'file', multiple: true }))
    const imgs = [];
    const file = document.querySelector('#files');
    file.addEventListener('change', async () => {
        file.style.display = 'none';
        Array.from(file.files).forEach((file, img) => [
            document.body.append(img = document.createElement('img')),
            img.style.display = 'none',
            img.src = URL.createObjectURL(file),
            imgs.push(img)
        ] && img)
        imgs[0].style.display = '';
        document.title = timeout;
    });
    const load = back => imgs.length && [
        imgs[0].style.display = 'none',
        back ? imgs.unshift(imgs.pop()) : imgs.push(imgs.shift()),
        imgs[0].style.display = '',
    ];
    var isStarting = true, timeout = 50;
    (loop => (loop = () => [!isStarting || load()] && setTimeout(loop, timeout || 50))())();
    window.addEventListener('keydown', async ev => {
        console.log('ev', ev);
        if (Number(ev.key)) {
            const imgURL = await new Promise(async (res, img) => {
                for (const item of await navigator.clipboard.read()) {
                    for (const type of item.types) {
                        console.log('type', type);
                        if (type.startsWith('image/')) {
                            console.log('image', type);
                            document.body.append(img = document.createElement('img'));
                            img.style.display = 'none';
                            img.src = URL.createObjectURL(await item.getType(type));
                            imgs.push(img);
                            console.log('img', img);
                            return res(img);
                        }
                    }
                }
                res();
            }).catch(er => console.error(er));
            file.style.display = 'none';
            imgs[0].style.display = '';
            document.title = timeout;
            return;
        }
        if (ev.key == 'ArrowLeft') return load(true);
        if (ev.key == 'ArrowRight') return load();
        if (ev.key == 'Enter' || ev.key == ' ') isStarting = !isStarting;
        if (ev.key == 'ArrowDown') timeout -= timeout > 50 ? 50 : 0;
        if (ev.key == 'ArrowUp') timeout += 50;
        document.title = timeout;
    });
})();