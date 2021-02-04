const figures = document.querySelectorAll('.figure')
const fields = document.querySelectorAll('.field')

const whiteFigures = document.querySelectorAll('.white-figure')
const blackFigures = document.querySelectorAll('.black-figure')

let moves = 0
var allowedFields = document.querySelectorAll('.allowed')

// Data attributes for figures (HTML elements) on the chessboard

figures.forEach(figure => {
    if (figure.classList.contains('white-figure')) {
        figure.dataset.color = "white"
    }
    else {
        figure.dataset.color = "black"
    }

    if (figure.id > 20 && figure.id < 40) {
        figure.dataset.name = "pawn"
    }
    else {
        if (figure.id[1] == 1 || figure.id[1] == 8) {
            figure.dataset.name = "rook"
        }
        else if (figure.id[1] == 2 || figure.id[1] == 7) {
            figure.dataset.name = "knight"
        }
        else if (figure.id[1] == 3 || figure.id[1] == 6) {
            figure.dataset.name = "bishop"
        }
        else if (figure.id[1] == 4) {
            figure.dataset.name = "king"
        }
        else {
            figure.dataset.name = "queen"
        }
    }

    figure.dataset.firstMove = true
    figure.dataset.previousPosition = figure.parentElement.id
    figure.dataset.currentPosition = figure.dataset.previousPosition
})

//Data attributes for fields (HTML elements) of the chessboard

fields.forEach(field => {
    field.dataset.row = field.id[1]
    if (field.id[0] == 'a') {field.dataset.column = 1}
    else if (field.id[0] == 'b') {field.dataset.column = 2}
    else if (field.id[0] == 'c') {field.dataset.column = 3}
    else if (field.id[0] == 'd') {field.dataset.column = 4}
    else if (field.id[0] == 'e') {field.dataset.column = 5}
    else if (field.id[0] == 'f') {field.dataset.column = 6}
    else if (field.id[0] == 'g') {field.dataset.column = 7}
    else {field.dataset.column = 8}
    
    if (field.childElementCount > 0) {
        var child = field.querySelector('.figure')
        
        if (child.dataset.color == "white") {
            field.dataset.occupiedByWhite = true
            field.dataset.occupiedByBlack = false
        }
        else {
            field.dataset.occupiedByWhite = false
            field.dataset.occupiedByBlack = true
        }
    }
    else {
        field.dataset.occupiedByWhite = false
        field.dataset.occupiedByBlack = false
    }
})

// Move figure by the player

switching()
figures.forEach(figure => {
    figure.addEventListener('dragstart', () => {
        figure.classList.add('dragging')
        figure.dataset.previousPosition = figure.parentElement.id
        getAllowedFields(figure)
    })
    figure.addEventListener('dragend', () => {
        figure.classList.remove('dragging')
        figure.dataset.currentPosition = figure.parentElement.id
        if (figure.dataset.previousPosition != figure.dataset.currentPosition) {
            figure.dataset.firstMove = false
            moves += 1
            updateFieldOccupation(figure)
            switching()
        }
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
        if (field.classList.contains('allowed') == true) {
            field.appendChild(draggable)
        }
        else {
            findPreviousField(draggable)
        }
    })
})

// Function to guarantee the alternation of the two players during the game

function switching() {
    if (moves % 2 == 0) {
        blackFigures.forEach(blackFigure => {
            blackFigure.setAttribute('draggable', false)
            blackFigure.style.cursor = "default"
        })
        whiteFigures.forEach(whiteFigure => {
            whiteFigure.setAttribute('draggable', true)
            whiteFigure.style.cursor = "move"
        })
        if (moves == 0) {
            getAllowedFields(whiteFigures[0])
        }
    }
    else {
        whiteFigures.forEach(whiteFigure => {
            whiteFigure.setAttribute('draggable', false)
            whiteFigure.style.cursor = "default"
        })
        blackFigures.forEach(blackFigure => {
            blackFigure.setAttribute('draggable', true)
            blackFigure.style.cursor = "move"
        })
    }
}

// Function for updating occupation of the field by any figure

function updateFieldOccupation(fg) {
    previous = document.getElementById(fg.dataset.previousPosition)
    
    if (fg.dataset.color == "white") {
        previous.dataset.occupiedByWhite = false
        fg.parentElement.dataset.occupiedByWhite = true
        fg.parentElement.dataset.occupiedByBlack = false
    }
    else {
        previous.dataset.occupiedByBlack = false
        fg.parentElement.dataset.occupiedByWhite = false
        fg.parentElement.dataset.occupiedByBlack = true
    }
}

// Function to ensure that players figure cant be deleted by other figure of same color

function getAllowedFields(fg) {
    deleted = 0
    addW = 0
    addB = 0
    fields.forEach(field => {
        if (field.classList.contains('allowed') == true) {
            field.classList.remove('allowed')
            deleted += 1
        }
        if (JSON.parse(field.dataset.occupiedByWhite) == false && fg.dataset.color == "white") {
            field.classList.add('allowed')
            addW += 1
        }
        else if (JSON.parse(field.dataset.occupiedByBlack) == false && fg.dataset.color == "black") {
            field.classList.add('allowed')
            addB += 1
        }
        else if (fg.dataset.previousPosition == field.id) {
            field.classList.add('allowed')
        }
    })
    allowedFields = document.querySelectorAll('.allowed')
}

function findPreviousField(fg) {
    fields.forEach(field => {
        if (field.childElementCount > 0) {
            if (field.children[0].classList.contains('dragging') == true) {
                field.removeChild(field.childNodes[0])
            }
        }
        if (field.id == fg.dataset.previousPosition) {
            field.appendChild(fg)
        }
    })
}