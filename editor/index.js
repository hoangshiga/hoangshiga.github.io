// https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneCodeEditor.html#focus.focus-1
require.config({
	baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/'
});
require(['vs/editor/editor.main'], (init, editor) => (init = async (localStorage = {}) => {
	if (editor) await editor.dispose();
	editor = await monaco.editor.create(document.getElementById('editor'), {
		model: await monaco.editor.createModel(localStorage.editorValue || '', 'javascript'),
		theme: 'vs',
		minimap: { enabled: false }
	});
	if (localStorage.editorPosition) await editor.setPosition(JSON.parse(localStorage.editorPosition));
	editor.onChangeContent = ev => (localStorage.editorValue = editor.getValue());
	await editor.onDidChangeModelContent(ev => editor.onChangeContent && editor.onChangeContent(ev));
	editor.onChangePosition = ev => (localStorage.editorPosition = JSON.stringify(editor.getPosition()));
	await editor.onDidChangeCursorPosition(ev => editor.onChangePosition && editor.onChangePosition(ev));
	await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, ev => editor.onSave && editor.onSave(ev));
	editor.beautifier = () => editor.trigger("editor", "editor.action.formatDocument");
	await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F, ev => editor.beautifier && editor.beautifier(ev));
	editor.commentLine = () => editor.getAction('editor.action.commentLine').run();
	await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_C, ev => editor.commentLine && editor.commentLine(ev));
	editor.toggleErrorUnderline = o => {
		if (o = document.querySelector('#squiggly-error')) return o.remove();
		document.head.appendChild(o = document.createElement('style')).id = 'squiggly-error';
		o.innerHTML = '.squiggly-error { background: inherit !important; }';
	};
	await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_E, ev => editor.toggleErrorUnderline && editor.toggleErrorUnderline(ev));
	editor.onClear = ev => editor.setValue('');
	await editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_D, ev => editor.onClear && editor.onClear(ev));
	var fileHandle, text, isAutoSave = true, isSaving, isTyping;
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
		text = await (await fileHandle.getFile()).text();
		editor.setValue(text);
		const save = async () => {
			if (isSaving) return;
			isSaving = true;
			const textNew = editor.getValue();
			if (textNew != text) {
				text = textNew;
				document.title = fileHandle.name + '*';
				const writable = await fileHandle.createWritable();
				await writable.write(textNew);
				await writable.close();
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
	await editor.focus();
	editor.init = init;
	window.editor = editor;
})(localStorage));