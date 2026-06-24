(async () => {
    /*<.append>*/
    const append = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.append(t), t)/*</.append>*/
    /*<.prepend>*/
    const prepend = (p, t, o) => (typeof p == 'string' && [[o, t, p] = [t, p]], t = Object.assign(document.createElement(t), o || {}), p && p.prepend(t), t)/*</.prepend>*/
    /*<.db>*/
    const db = await (async (db = {}) => {
        const init = () => new Promise((res, rej) => Object.assign(indexedDB.open("data", 1), {
            onerror: ev => rej(ev.target.error),
            onsuccess: ev => res(db.db = ev.target.result),
            onupgradeneeded: (ev, db) => !(db = ev.target.result).objectStoreNames.contains("data") && db.createObjectStore("data", { keyPath: "key", autoIncrement: true }).createIndex("key", "key"),
        }))
        const drop = () => new Promise((res, rej) => Object.assign(indexedDB.deleteDatabase('data'), {
            onerror: ev => rej(ev.target.error),
            onblocked: ev => rej(ev.target.result),
            onsuccess: ev => res(ev.target.result),
        }))
        const clear = () => init().then(() => p("readwrite", o => o.clear()))
        const p = (mode, fn) => new Promise((res, rej) => Object.assign(fn(db.db.transaction(["data"], mode).objectStore("data")), {
            onsuccess: ev => res(ev.target.result),
            onerror: ev => rej(ev.target.error),
        }))
        return [await init()] && Object.assign(db, {
            drop, clear,
            put: async (key, value) => await p("readwrite", o => o.put({ key, value })),
            map: async fn => await (await p("readonly", o => o.getAll())).reduce((p, x, i) => p.then(
                async rs => [fn ? rs.push(await fn([x.key, x.value], i)) : Object.assign(rs, { [x.key]: x.value })] && Promise.resolve(rs)
            ), Promise.resolve(fn ? [] : {})),
            keys: () => db.map(([k]) => k),
            has: async key => !!await p("readonly", o => o.count(IDBKeyRange.only(key))),
            get: async key => (await p("readonly", o => o.get(key)) || {}).value,
            remove: key => p("readwrite", o => o.delete(key)),
        })
    })() /*</.db>*/
    /*<.copy>*/
        const copy = s => {
            const input = document.createElement("input");
            input.value = s;
            input.style.position = 'fixed';
            document.body.appendChild(input);
            input.focus();
            input.select();
            document.execCommand('copy');
            input.remove();
        } /*</.copy>*/
    // https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneCodeEditor.html#focus.focus-1
//    require.config({ baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/' });
    require.config({ baseUrl: 'https://hoangshiga.github.io/editor/lib/' });
//    require.config({ baseUrl: 'http://localhost/' });
    require(['vs/editor/editor.main'], (init, editor) => (init = async (localStorage = {}) => {
        if (!editor) {
            window.addEventListener('resize', () => editor && editor.layout())
            const div = prepend(document.body, 'div')
            const caches = {}
            var index = 0
            const renderCaches = async () => {
                for (var [k, el] of Object.entries(caches)) {
                    delete caches[k]
                    el.remove()
                }
                const keys = (await db.keys()).sort()
                // console.log('keys', keys)
                for (const key of keys) {
                    if (!key.startsWith(location.pathname)) continue
                    const i = key.substr(location.pathname.length)
                    caches[i] = append(div, 'button', {
                        textContent: i,
                        oncontextmenu: ev => ev.preventDefault(),
                        onclick: async () => {
                            index = i
                            editor.putValue(await db.get(key))
                            await renderCaches()
                            editor.focus()
                        },
                        onauxclick: async ev => {
                            if (ev.button == 2) return eval(await db.get(key))
                            index = 0
                            await db.remove(key)
                            await renderCaches()
                            editor.focus()
                        }
                    })
                }
                if (!index) while (++index <= keys.length) if (!keys.includes(location.pathname + index)) break
                nameInput.value = index
            }
            const nameInput = append(div, 'input', { onchange: () => [index = nameInput.value] })
            const cacheBtn = append(div, 'button', {
                textContent: 'Cache', onclick: async () => {
                    await db.put(location.pathname + index, editor.getValue())
                    await renderCaches()
                    const style = Object.assign(caches[index].style, { background: 'blue', color: 'white' })
                    setTimeout(() => Object.assign(style, { background: '', color: '' }), 1000)
                    editor.focus()
                }
            })
            append(div, 'button', {
                textContent: 'New', onclick: async () => {
                    index = 0
                    await renderCaches()
                    cacheBtn.click()
                    editor.focus()
                }
            })
            await renderCaches()
        }
        if (editor) await editor.dispose();
        const valueKey = 'editor_' + unescape(new URLSearchParams(location.search).get('key') || 'value')
        const positionKey = valueKey + '_position'
        editor = await monaco.editor.create(document.getElementById('editor'), {
            model: await monaco.editor.createModel(localStorage[valueKey] || '', unescape(new URLSearchParams(location.search).get('mode') || 'javascript')),
            theme: 'vs',
            minimap: { enabled: false }
        });
        if (localStorage[positionKey]) await editor.setPosition(JSON.parse(localStorage[positionKey]));
        editor.onChangeContent = ev => (localStorage[valueKey] = editor.getValue());
        await editor.onDidChangeModelContent(ev => editor.onChangeContent && editor.onChangeContent(ev));
        editor.onChangePosition = ev => (localStorage[positionKey] = JSON.stringify(editor.getPosition()));
        await editor.onDidChangeCursorPosition(ev => editor.onChangePosition && editor.onChangePosition(ev));
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, ev => editor.onSave && editor.onSave(ev));
        editor.beautifier = () => editor.trigger("editor", "editor.action.formatDocument");
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F, ev => editor.beautifier && editor.beautifier(ev));
        const beautifyJs = localStorage.beautifyJs = localStorage.beautifyJs || await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify.min.js')).text()
        const js_beautify = await new Promise((res, define) => (define = (_, f) => res(f().js_beautify)) && (define.amd = true) && eval(beautifyJs))
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_B, () => {
            const pos = editor.getPosition()
            editor.executeEdits('beautifier', [{
                identifier: 'delete',
                range: editor.getModel().getFullModelRange(),
                text: js_beautify(editor.getValue()),
                forceMoveMarkers: true
            }])
            editor.setPosition(pos)
        })
        editor.commentLine = () => editor.getAction('editor.action.commentLine').run();
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_C, ev => editor.commentLine && editor.commentLine(ev));
        editor.toggleErrorUnderline = o => {
            if (o = document.querySelector('#squiggly-error')) return o.remove();
            document.head.appendChild(o = document.createElement('style')).id = 'squiggly-error';
            o.innerHTML = '.squiggly-error { background: inherit !important; }';
        };
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_E, ev => editor.toggleErrorUnderline && editor.toggleErrorUnderline(ev));
        //  editor.onClear = ev => editor.setValue('');
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_D, ev => editor.onClear && editor.onClear(ev));
        var fileHandle, lastModified, interval, text, isAutoSave = true, isSaving, isTyping;
        editor.onOpenFile = async ev => {
            fileHandle = (await window.showOpenFilePicker().catch(er => []))[0];
            if (!fileHandle) return;
            if (await fileHandle.queryPermission({ mode: 'readwrite' }) != 'granted'
                && await fileHandle.requestPermission({ mode: 'readwrite' }) != 'granted'
            ) return alert('Error: No Permission for write to file, try again');
            document.title = fileHandle.name + (isAutoSave && '@' || '');
            editor.onOpenFile = null;
            editor.onChangeContent = null;
            editor.onChangePosition = null;
            const file = await fileHandle.getFile();
            lastModified = file.lastModified
            text = await file.text();
            editor.setValue(text);
            clearInterval(interval);
            interval = setInterval(async () => {
                if (!lastModified) return
                const file = await fileHandle.getFile();
                const newModified = file.lastModified;
                if (newModified == lastModified) return
                lastModified = newModified
                text = await file.text();
                const crollTop = editor.getScrollTop()
                const position = editor.getPosition()
                editor.setValue(text)
                editor.setScrollTop(crollTop)
                editor.setPosition(position)
            }, 1000)
            const save = async () => {
                if (isSaving) return;
                isSaving = true;
                const textNew = editor.getValue();
                if (textNew != text) {
                    text = textNew;
                    document.title = fileHandle.name + '*';
                    lastModified = null
                    const writable = await fileHandle.createWritable();
                    await writable.write(textNew);
                    await writable.close();
                    const file = await fileHandle.getFile();
                    lastModified = file.lastModified
                }
                document.title = fileHandle.name + (isAutoSave && '@' || '');
                isSaving = false;
            };
            editor.onChangeContent = async ev => {
                if (!isAutoSave) return [document.title = fileHandle.name + (editor.getValue() != text && '*' || '')];
                document.title = fileHandle.name + '*';
                isTyping = clearTimeout(isTyping) || setTimeout(save, 1000);
            };
            editor.onOpenFile = async ev => {
                if (isAutoSave = !isAutoSave) return await save();
                document.title = fileHandle.name;
            };
            editor.onSave = async ev => {
                isTyping = clearTimeout(isTyping) || setTimeout(async () => {
                    await save();
                    alert('Succeed');
                }, 1000);
            };
        };
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O, ev => editor.onOpenFile && editor.onOpenFile(ev));
        editor.onLoadFile = async ev => {
            if (!fileHandle) return;
            const pos = editor.getPosition();
            editor.setValue(await (await fileHandle.getFile()).text());
            editor.setPosition(pos);
        };
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_L, ev => editor.onLoadFile && editor.onLoadFile(ev));
        editor.toggleMiniMap = async ev => {
            editor.updateOptions({
                minimap: {
                    enabled: !editor.getRawOptions().minimap.enabled
                }
            });
        };
        await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M, ev => editor.toggleMiniMap && editor.toggleMiniMap(ev));
        // await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
        //     console.log("Before Undo")
        //     editor.trigger("keyboard", "undo", null)
        //     console.log("After Undo")
        // })
        // await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, () => {
        //     console.log("Before Redo")
        //     editor.trigger("keyboard", "redo", null)
        //     console.log("After Redo")
        // })
        await editor.focus();
        editor.init = init;
        editor.putValue = value => {
            const pos = editor.getPosition()
            editor.executeEdits('beautifier', [{
                identifier: 'delete',
                range: editor.getModel().getFullModelRange(),
                text: value,
                forceMoveMarkers: true
            }])
            editor.setPosition(pos)
            return editor
        }
        window.editor = editor;
    })(localStorage));
})()