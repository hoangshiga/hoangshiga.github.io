(async () => {
    var mediaRecorder, audioChunks = []
    document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Start',
        onclick: async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = []
            mediaRecorder.ondataavailable = event => audioChunks.push(event.data)
            mediaRecorder.start()
            console.log("Recording started")
        }
    }))
    document.body.appendChild(Object.assign(document.createElement('button'), {
        textContent: 'Stop',
        onclick: async () => {
            mediaRecorder.stop()
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
        }
    }))
})()