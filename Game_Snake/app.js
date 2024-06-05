const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

const pontuacao = document.querySelector('.valor-pontuacao');
const pontuacaoFinal = document.querySelector('.pontuacao-final > span');
const menu = document.querySelector('.tela-menu')
const botaoPlay = document.querySelector(".btn-jogar")

const audio = new Audio('../audio/audio.mp3')

const tamanho = 30

let snake = [
    {x:0, y:0},
    {x:30, y:0}
]

const somarPontos = () => {
    pontuacao.innerText = +pontuacao.innerText + 10
}

const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max- min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - tamanho)
    return Math.round(number/30) * 30
}

const comida = {
    x: randomPosition(),
    y: randomPosition(),
    color: "yellow"
}

let direcao, loopId

const desenhaComdia = () => {
    const {x, y, color} = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, tamanho, tamanho)
    ctx.shadowBlur = 0
}

// Funcao Flecha para desenha a cobra.
const desenhoSnake = () => {
    ctx.fillStyle = "black"
    
    snake.forEach((posicao, index) => {
        if (index == snake.length-1){
            ctx.fillStyle = "gray"
        }

        ctx.fillRect(posicao.x, posicao.y, tamanho, tamanho)
    })

}

// Funcao para movimentar a cobra.
const movimentaSnake = () => {
    const head = snake[snake.length-1]
    if (!direcao) return
    
    if (direcao == "right") {
        snake.push({x: head.x + tamanho, y:head.y})
    }
    if (direcao == "left") {
        snake.push({x: head.x - tamanho, y:head.y})
    }
    if (direcao == "down") {
        snake.push({x: head.x, y:head.y + tamanho})
    }
    if (direcao == "up") {
        snake.push({x: head.x, y:head.y - tamanho})
    }
    
    snake.shift()
}

// Funcao que cria grid para o design do jogo. 
const desenhaGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "gray"

    for (let i= 30; i < canvas.width; i+= tamanho) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 720)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(720, i)
        ctx.stroke()
    }
}

const cobraComer = () => {
    const head = snake[snake.length-1];
    
    if (head.x == comida.x && head.y == comida.y) {
        somarPontos()
        snake.push(head);
        audio.play()

        let x= randomPosition();
        let y= randomPosition();

        while (snake.find((posicao) => posicao.x == x && posicao.y == y)) {
            x= randomPosition();
            y= randomPosition();
        }

        comida.x = x
        comida.y = y
    }
}

const colisao = () => {
    const head = snake[snake.length - 1]
    const pescocoIndex = snake.length -2

    const bateParede = 
        head.x < 0 || head.x > 790 || head.y < 0 || head.y >790

    const colisaoCobra = snake.find((posicao, index) => {
        return index < pescocoIndex && posicao.x == head.x && posicao.y == head.y
    })

    if(bateParede || colisaoCobra) {
        gameOver()
    }
}

const gameOver = () => {
    direcao = undefined

    menu.style.display = "flex"
    pontuacaoFinal.innerText =+ pontuacao.innerText
    canvas.style.filter = "blur(2px)"
}

// Funcao para criar um loop para realizar o movimento da cobra.
const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 720, 720)
    desenhaGrid()
    desenhaComdia()
    desenhoSnake()
    movimentaSnake()
    cobraComer()
    colisao()

    loopId = setInterval(() => {
        gameLoop()
    }, 250)
}

gameLoop()

document.addEventListener("keydown", ({key}) => {
    if (key == "d" && direcao != "left") {
        direcao = "right"
    }
    if (key == "a" && direcao != "right") {
        direcao = "left"
    }
    if (key == "s" && direcao != "up") {
        direcao = "down"
    }
    if (key == "w" && direcao != "down") {
        direcao = "up"
    }
})

botaoPlay.addEventListener("click", ()=>{
    pontuacao.innerText = "000"
    menu.style.display = " none"
    canvas.style.filter = "none"
    snake = [
        {x:0, y:0},
        {x:30, y:0}
    ]
})