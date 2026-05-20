(async () => {
	const div = await new Promise((res, loop) => (loop = o =>
		!(o = document.querySelector('div')) && setTimeout(loop, 100) || res(o)
	)());
	const input = await new Promise((res, loop) => (loop = o =>
		!(o = document.querySelector('input')) && setTimeout(loop, 100) || res(o)
	)());
	window.addEventListener('offline', () => {
		div.textContent = navigator.onLine ? 'online' : 'offline';
	});
	window.addEventListener('online', () => {
		div.textContent = navigator.onLine ? 'online' : 'offline';
	});
	input.value = localStorage['input'] || '';
	input.addEventListener('change', async () => {
		localStorage['input'] = input.value;
	});
})();
