const test = (async (...args) => {
    const pro = fetch('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')
    document.body.append(
        args.en_val = Object.assign(document.createElement('input'), { type: 'password' }),
        args.en_pw = Object.assign(document.createElement('input'), { type: 'password' }),
        Object.assign(document.createElement('button'), {
            textContent: 'OK',
            onclick: async () => {
                try {
                    args.de_pw.value = args.en_pw.value
                    if (!window.CryptoJS) eval(await (await pro).text())
                    console.log('CryptoJS', CryptoJS)
                    document.body.append(Object.assign(document.createElement('div'), {
                        textContent: args.de_val.value = CryptoJS.AES.encrypt(args.en_val.value, args.en_pw.value.repeat(1000 * 1000)).toString(CryptoJS.format.Utf8)
                    }))
                } catch (ex) {
                    console.error(ex)
                    alert(ex)
                }
            }
        }),
        args.de_val = document.createElement('input'),
        args.de_pw = Object.assign(document.createElement('input'), { type: 'password' }),
        Object.assign(document.createElement('button'), {
            textContent: 'OK',
            onclick: async () => {
                try {
                    if (!window.CryptoJS) eval(await (await pro).text())
                    console.log('CryptoJS', CryptoJS)
                    document.body.append(Object.assign(document.createElement('div'), {
                        textContent: CryptoJS.AES.decrypt(args.de_val.value, args.de_pw.value.repeat(1000 * 1000)).toString(CryptoJS.enc.Utf8)
                    }))
                } catch (ex) {
                    console.error(ex)
                    alert(ex)
                }
            }
        }),
    )
})
const test_fancybox = (async (...args) => {
    await new Promise((rs, lp) => setTimeout(lp = () => document.head ? rs() : setTimeout(lp, 100)))
    document.head.innerHTML += `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css"/>
<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"></script>
    `
})()
const test_ffmpeg = (async (v, a) => {
    document.body.append(v = Object.assign(document.createElement('input'), {
        type: 'file'
    }), a = Object.assign(document.createElement('input'), {
        type: 'file'
    }), Object.assign(document.createElement('button'), {
        textContent: 'OK',
        onclick: async () => {
            eval(await (await fetch('https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/ffmpeg.js')).text())
            console.log('FFmpegWASM', FFmpegWASM)
            eval(await (await fetch('https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js')).text())
            console.log('FFmpegUtil', FFmpegUtil)
            const { FFmpeg } = window.FFmpegWASM
            const { fetchFile } = window.FFmpegUtil
            const ffmpeg = new FFmpeg()
            await ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
            })
            console.log('ffmpeg.load')
            await ffmpeg.writeFile("v.mp4", await fetchFile(v.files[0]))
            console.log('v.mp4')
            await ffmpeg.writeFile("a.mp3", await fetchFile(a.files[0]))
            console.log('a.mp3')
            await ffmpeg.exec(["-i", "v.mp4", "-i", "a.mp3", "-map", "0:v:0", "-map", "1:a:0",
                "-c:v", "copy", "-c:a", "copy", "-shortest", "out.mp4"
            ])
            console.log('ffmpeg.exec')
            const data = await ffmpeg.readFile("out.mp4")
            console.log('out.mp4')
            document.body.append(Object.assign(document.createElement('video'), {
                src: URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
            }))
        }
    }))
})
