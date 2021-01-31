const figures = document.querySelectorAll('.figure')
const fields = document.querySelectorAll('.field')

figures.forEach(figure => {
    figure.addEventListener('dragstart', () => {
        figure.classList.add('dragging')
    })
    figure.addEventListener('dragend', () => {
        figure.classList.remove('dragging')
        fields.forEach(field => {
            const childs = field.childElementCount
            if (childs == 2) {
                field.removeChild(field.childNodes[0])
            }
        })
    })
})

fields.forEach(field => {
    field.addEventListener('dragover', e => {
        e.preventDefault()
        const draggable = document.querySelector('.dragging')
        field.appendChild(draggable)
    })
})