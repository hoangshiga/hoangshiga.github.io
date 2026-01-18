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
    console.log(['I+O', 'I', 'O'].forEach(mode => console.log(mode))
    // ['I+O', 'I', 'O'].forEach(mode => modeSelect.appendChild(
    //     Object.assign(document.createElement('option'), { textContent: mode })
    // ))
    var mediaRecorder, audioChunks = []
    document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Start',
        onclick: async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream)
            audioChunks = []
            mediaRecorder.ondataavailable = event => audioChunks.push(event.data)
            mediaRecorder.start()
            console.log("Recording started")
        }
    }))
    document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Stop',
        onclick: async () => {
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
                const audioUrl = URL.createObjectURL(audioBlob)
                const audio = document.getElementById("player")
                audio.src = audioUrl
                const a = document.createElement("a")
                a.href = audioUrl
                a.download = "recording.webm"
                a.click()
                URL.revokeObjectURL(audioUrl)
                console.log("Recording stopped & downloaded")
            }
            mediaRecorder.stop()
        }
    }))
})()