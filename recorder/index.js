(async () => {
    const requestPermission = () => navigator.mediaDevices.getUserMedia({ audio: true })
        .then(s => !s.getTracks().forEach(track => track.stop())).catch(() => false)
    const newMediaRecorder = async streams => {
        if (streams.length == 1) return Object.assign(new MediaRecorder(streams[0]), { streams })
        const audioContext = new AudioContext()
        const mediaStream = audioContext.createMediaStreamDestination()
        streams.forEach(stream => audioContext.createMediaStreamSource(stream).connect(mediaStream))
        return Object.assign(new MediaRecorder(mediaStream.stream), { streams })
    }
    if (!await requestPermission()) return
    const inputSelect = document.body.appendChild(document.createElement('select'))
    const outputSelect = document.body.appendChild(document.createElement('select'))
    const devices = await navigator.mediaDevices.enumerateDevices()
    devices.sort((a, b) => a.label.localeCompare(b.label))
    console.log('devices', devices)
    devices.forEach(d => (d.kind == 'audiooutput' ? outputSelect : inputSelect).appendChild(
        Object.assign(document.createElement('option'), {
            textContent: d.label + ' - ' + d.deviceId, value: d.deviceId
        })
    ))
    const modeSelect = document.body.appendChild(document.createElement('select'))
    for (const mode of ['I+O', 'I', 'O']) {
        modeSelect.appendChild(
            Object.assign(document.createElement('option'), { textContent: mode, value: mode })
        )
    }
    var mediaRecorder, audioChunks = []
    const startButton = document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Start',
        onclick: async () => {
            console.log('inputSelect', inputSelect.value)
            mediaRecorder = newMediaRecorder(modeSelect.value == 'I+O'
                ? [
                    await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: { exact: inputSelect.value } }
                    }),
                    await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: { exact: outputSelect.value } }
                    })
                ]
                : [
                    await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: { exact: modeSelect.value == 'I' ? inputSelect.value : outputSelect.value } }
                    })
                ]
            )
            mediaRecorder.ondataavailable = ev => audioChunks.push(ev.data)
            mediaRecorder.start()
            inputSelect.disabled = true
            outputSelect.disabled = true
            modeSelect.disabled = true
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
                mediaRecorder.streams.forEach(stream => stream.getTracks().forEach(track => track.stop()))
                stopButton.disabled = true
                inputSelect.disabled = false
                outputSelect.disabled = false
                modeSelect.disabled = false
                startButton.disabled = false
                console.log("Recording stopped & downloaded")
            }
            mediaRecorder.stop()
        }
    }))
})()