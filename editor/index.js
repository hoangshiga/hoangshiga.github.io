// https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneCodeEditor.html#focus.focus-1
require.config({
	baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/'
});
require(['vs/editor/editor.main'], (init, editor) => (init = async (localStorage = {}) => {
	if (editor) await editor.dispose();
	editor = await monaco.editor.create(document.getElementById('editor'), {
		model: await monaco.editor.createModel(localStorage.editorValue || '', 'javascript'),
		theme: 'vs'
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
	var fileHandle;
	editor.onOpenFile = async ev => {
		fileHandle = (await window.showOpenFilePicker().catch(er => []))[0];
		if (!fileHandle) return;
		editor.onOpenFile = null;
		editor.onChangeContent = null;
		editor.onChangePosition = null;
		editor.setValue(await (await fileHandle.getFile()).text());
		editor.onSave = async ev => {
			if (await fileHandle.queryPermission({ mode: 'readwrite' }) != 'granted'
				&& await fileHandle.requestPermission({ mode: 'readwrite' }) != 'granted'
			) return alert('Error: No Permission for write to file, try again');
			const writable = await fileHandle.createWritable();
			await writable.write(editor.getValue());
			await writable.close();
			alert('Succeed');
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
	await editor.focus();
	editor.init = init;
	window.editor = editor;
})(localStorage));