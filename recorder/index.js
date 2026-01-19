(async () => {
    const requestPermission = () => navigator.mediaDevices.getUserMedia({ audio: true })
        .then(s => !s.getTracks().forEach(track => track.stop())).catch(() => false)
    if (!await requestPermission()) return
    const inputSelect = document.body.appendChild(document.createElement('select'))
    const outputSelect = document.body.appendChild(document.createElement('select'))
    const devices = await navigator.mediaDevices.enumerateDevices()
    devices.sort((a, b) => a.label.localeCompare(b.label))
    console.log('devices', devices)
    devices.forEach(d => (d.kind == 'audiooutput' ? outputSelect : inputSelect).appendChild(
        Object.assign(document.createElement('option'), {
            textContent: d.label + ' - ' + d.deviceId
        })
    ))
    const modeSelect = document.body.appendChild(document.createElement('select'))
    for (const mode of ['I+O', 'I', 'O']) {
        modeSelect.appendChild(
            Object.assign(document.createElement('option'), { textContent: mode })
        )
    }
    var mediaRecorder, audioChunks = []
    const startButton = document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Start',
        onclick: async () => {
            // if (stream) stream = stream.getTracks().forEach(track => track.stop())
            mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ audio: true }))
            mediaRecorder.ondataavailable = ev => audioChunks.push(ev.data)
            mediaRecorder.start()
            startButton.disabled = true
            stopButton.disabled = false
            console.log("Recording started")
        }
    }))
    const stopButton = document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Stop',
        disabled: true,
        onclick: async () => {
            mediaRecorder.onstop = () => {
                const audioUrl = URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm" }))
                const a = document.createElement("a")
                a.href = audioUrl
                a.download = "recording.webm"
                a.click()
                a.remove()
                URL.revokeObjectURL(audioUrl)
                audioChunks = []
                mediaRecorder.stream.getTracks().forEach(track => track.stop())
                stopButton.disabled = true
                startButton.disabled = false
                console.log("Recording stopped & downloaded")
            }
            mediaRecorder.stop()
        }
    }))
})()