const figures = document.querySelectorAll('.figure')
const fields = document.querySelectorAll('.field')

const whiteFigures = document.querySelectorAll('.white-figure')
const blackFigures = document.querySelectorAll('.black-figure')

let moves = 0
var allowedFields = document.querySelectorAll('.allowed')

const labels = document.querySelector('.turn-label')

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
        if (figure.dataset.color == "white") {
            figure.dataset.possibleMoves = "+1+0+2+0"
        }
        else {
            figure.dataset.possibleMoves = "-1+0-2+0"
        }
    }
    else {
        if (figure.id[1] == 1 || figure.id[1] == 8) {
            figure.dataset.name = "rook"
            figure.dataset.possibleMoves = "+1+0+2+0+3+0+4+0+5+0+6+0+7+0\
            |+0+1+0+2+0+3+0+4+0+5+0+6+0+7\
            |-1+0-2+0-3+0-4+0-5+0-6+0-7+0\
            |+0-1+0-2+0-3+0-4+0-5+0-6+0-7"
        }
        else if (figure.id[1] == 2 || figure.id[1] == 7) {
            figure.dataset.name = "knight"
            figure.dataset.possibleMoves ="+2+1|+2-1|+1+2|+1-2|-2+1|-2-1|-1+2|-1-2"
        }
        else if (figure.id[1] == 3 || figure.id[1] == 6) {
            figure.dataset.name = "bishop"
            figure.dataset.possibleMoves ="+1+1+2+2+3+3+4+4+5+5+6+6+7+7\
            |+1-1+2-2+3-3+4-4+5-5+6-6+7-7\
            |-1+1-2+2-3+3-4+4-5+5-6+6-7+7\
            |-1-1-2-2-3-3-4-4-5-5-6-6-7-7"
        }
        else if (figure.id[1] == 4) {
            figure.dataset.name = "king"
            figure.dataset.possibleMoves ="+0+1|+0-1|+1+1|+1-1|+1+0|-1+1|-1+0|-1-1"
        }
        else {
            figure.dataset.name = "queen"
            figure.dataset.possibleMoves = "+0+1+0+2+0+3+0+4+0+5+0+6+0+7\
            |+1+0+2+0+3+0+4+0+5+0+6+0+7+0\
            |+0-1+0-2+0-3+0-4+0-5+0-6+0-7\
            |-1+0-2+0-3+0-4+0-5+0-6+0-7+0\
            |+1+1+2+2+3+3+4+4+5+5+6+6+7+7\
            |+1-1+2-2+3-3+4-4+5-5+6-6+7-7\
            |-1+1-2+2-3+3-4+4-5+5-6+6-7+7\
            |-1-1-2-2-3-3-4-4-5-5-6-6-7-7"
        }
    }

    figure.dataset.firstMove = true
    figure.dataset.previousPosition = figure.parentElement.id
    figure.dataset.currentPosition = figure.dataset.previousPosition
})

// Data attributes for fields (HTML elements) of the chessboard

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
    if (field.classList.contains('white-field') == true) {
        field.dataset.color = "white"
    }
    else {
        field.dataset.color = "rgb(100, 100, 100)"
    }
})

// Move figure by the player

switchingSides()
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
            if (figure.dataset.name == "pawn") {
                var tmp_possMoves = figure.dataset.possibleMoves
                figure.dataset.possibleMoves = tmp_possMoves.slice(0, 4)
            }
            moves += 1
            updateFieldOccupation(figure)
            switchingSides()
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
            var startingField = findPreviousField(draggable)
            startingField.appendChild(draggable)
        }
    })
})

// Function to guarantee the alternation of the two players during the game

function switchingSides() {
    if (moves % 2 == 0) {
        blackFigures.forEach(blackFigure => {
            blackFigure.setAttribute('draggable', false)
            blackFigure.style.cursor = "default"
        })
        whiteFigures.forEach(whiteFigure => {
            whiteFigure.setAttribute('draggable', true)
            whiteFigure.style.cursor = "move"
        })

        labels.style.color = "white"
        labels.innerHTML = `<div>White's turn</div>
        <div>White's turn</div>`
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

        labels.style.color = "black"
        labels.innerHTML = `<div>Black's turn</div>
        <div>Black's turn</div>`
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

// Function that helps generate new row or column values to obtain allowed fields

function getNewvalue(oldNumber, typeOfNumber, number) {
    var newValue = oldNumber
    if (typeOfNumber == "-") {
        newValue -= parseInt(number)
    }
    else {
        newValue += parseInt(number)
    }

    return newValue
}

// Function for selecting fields where the figure can move according to the rules, and also for not deleting a figure of the same color

function getAllowedFields(fg) {
    fields.forEach(field => {
        if (field.classList.contains('allowed') == true) {
            field.classList.remove('allowed')
        }
    })

    var newRow
    var newColumn
    var wasFound = false
    var backupRow
    var backupColumn
    var direction = 0
    var wasStopped = false
    let allowedF = []

    fields.forEach(field => {
        if (field.id == fg.dataset.previousPosition) {
            newRow = parseInt(field.dataset.row)
            newColumn = parseInt(field.dataset.column)
            backupRow = newRow
            backupColumn = newColumn
        }
    })
    var stringMoves = fg.dataset.possibleMoves
    for (let i = 0; i < stringMoves.length; i++) {
        if (stringMoves[i] == '|') {
            direction += 1
            wasStopped = false
        }
        if ((i - direction) % 4 == 0) {
            newRow = getNewvalue(backupRow, stringMoves[i], stringMoves[i + 1])
            newColumn = getNewvalue(backupColumn, stringMoves[i + 2], stringMoves[i + 3])

            if (newRow > 0 && newRow < 9 && newColumn > 0 && newColumn < 9 && wasStopped == false) {
                fields.forEach(field => {
                    if (field.dataset.row == newRow && field.dataset.column == newColumn && wasFound == false) {
                        wasFound = true
                        if (field.childElementCount > 0) {
                            if (fg.dataset.color == "white" && JSON.parse(field.dataset.occupiedByBlack) == true) {
                                field.classList.add('allowed')
                                allowedF.push(field.id)
                            }
                            else if (fg.dataset.color == "white" && JSON.parse(field.dataset.occupiedByWhite) == true) {
                                wasStopped = true
                            }
                            else if (fg.dataset.color == "black" && JSON.parse(field.dataset.occupiedByWhite) == true) {
                                field.classList.add('allowed')
                                allowedF.push(field.id)
                            }
                            else if (fg.dataset.color == "black" && JSON.parse(field.dataset.occupiedByBlack) == true) {
                                wasStopped = true
                            }
                        }
                        else {
                            field.classList.add('allowed')
                            allowedF.push(field.id)
                        }
                    }
                })
                wasFound = false
            }
            newRow = backupRow
            newColumn = backupColumn
        }
        else {
            continue
        }
    }
    pawnRules(fg)
    allowedFields = document.querySelectorAll('.allowed')
    return allowedF
}

// Function for placing the dragged figure to the statring field while draging over the figure of the same color

function findPreviousField(fg) {
    var previous
    fields.forEach(field => {
        if (field.childElementCount > 0) {
            if (field.children[0].classList.contains('dragging') == true) {
                field.removeChild(field.childNodes[0])
            }
        }
        if (field.id == fg.dataset.previousPosition) {
            previous = field
        }
    })
    return previous
}

// Adding allowed fields where pawn can delete other figure

function pawnRules(fg) {
    if (fg.dataset.name != "pawn") {
        return
    }
    var prev
    var deleteOnLeftCol
    var deleteOnRightCol
    var deleteRow

    fields.forEach(field => {
        if (field.id == fg.dataset.previousPosition) {
            prev = field
            deleteOnLeftCol = parseInt(prev.dataset.column) - 1
            deleteOnRightCol = parseInt(prev.dataset.column) + 1
        }
    })

    if (fg.dataset.color == "white") {
        deleteRow = parseInt(prev.dataset.row) + 1
    }
    else {
        deleteRow = parseInt(prev.dataset.row) - 1
    }

    fields.forEach(field => {
        if (parseInt(field.dataset.row) == deleteRow) {
            if (parseInt(field.dataset.column) == deleteOnLeftCol || parseInt(field.dataset.column) == deleteOnRightCol) {
                if (fg.dataset.color == "white" && JSON.parse(field.dataset.occupiedByBlack) == true) {
                    field.classList.add('allowed')
                }
                else if (fg.dataset.color == "black" && JSON.parse(field.dataset.occupiedByWhite) == true) {
                    field.classList.add('allowed')
                }
            }
            else if (parseInt(field.dataset.column) == deleteOnLeftCol + 1) {
                if (fg.dataset.color == "white" && JSON.parse(field.dataset.occupiedByBlack) == true) {
                    if (field.classList.contains('allowed') == true) {
                        field.classList.remove('allowed')
                    }
                }
                else if (fg.dataset.color == "black" && JSON.parse(field.dataset.occupiedByWhite) == true) {
                    if (field.classList.contains('allowed') == true) {
                        field.classList.remove('allowed')
                    }
                }
            }
        }
    })
}

// Function that is checking if the game is over

function isGameOver(king) {
    let kingAvailableFields = []
    let enemyAvailableFields = []
    const allMoves = king.dataset.possibleMoves

    const positionOfKing = findPreviousField(king)
    const kingRow = parseInt(positionOfKing.dataset.row)
    const kingColumn = parseInt(positionOfKing.dataset.column)
    var newRow
    var newColumn
    var wasFound = false

    for (let i = 0; i < allMoves.length; i++) {
        if (i % 5 == 0) {
            newRow = getNewvalue(kingRow, allMoves[i], allMoves[i + 1])
            newColumn = getNewvalue(kingColumn, allMoves[i + 2], allMoves[i + 3])
            wasFound = false
        }

        if (newRow > 0 && newRow < 9 && newColumn > 1 && newColumn < 9) {
            fields.forEach(field => {
                if (field.dataset.row == newRow && field.dataset.column == newColumn && wasFound == false) {
                    if ((king.dataset.color == "white" && JSON.parse(field.dataset.occupiedByWhite) == false)
                    || (king.dataset.color == "black" && JSON.parse(field.dataset.occupiedByBlack) == false)) {
                        kingAvailableFields.push(field.id)
                        wasFound = true
                    }
                }
            })
        }
    }

    let enemy

    if (king.dataset.color == "white"){
        enemy = blackFigures
    }
    else {
        enemy = whiteFigures
    }
    
    console.log("King:", kingAvailableFields)
    let allEnemyAvailable = []

    for (let i = 0; i < enemy.length; i++) {
        enemyAvailableFields = getAllowedFields(enemy[i])
        for (let j = 0; j < enemyAvailableFields.length; j++) {
            allEnemyAvailable.push(enemyAvailableFields[j])
        }
    }
    console.log(allEnemyAvailable)
}

isGameOver(whiteFigures[11])

// Disables the turn lables while the window is too small

window.addEventListener('resize', () => {
    if (document.body.clientWidth < 1300) {
        document.querySelector('.turn-label').style.display = "none"
    }
    else {
        document.querySelector('.turn-label').style.display = "flex"
    }
})
