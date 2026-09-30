const color = document.createElement('input')
color.type = 'color';
color.value = document.body.style.background = localStorage[location.pathname]
color.oninput = () => [document.body.style.background = localStorage[location.pathname] = color.value]
document.body.style.textAlign = 'right'
document.body.append(color)
