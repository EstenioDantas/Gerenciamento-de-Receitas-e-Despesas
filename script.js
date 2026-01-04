const receitas = document.getElementById('money-plus')
const despesas = document.getElementById('money-minus')
const historico = document.getElementById('list')
const adicionarTransacao = document.getElementById('form')
const nomeInput = document.getElementById('text')
const montanteInput = document.getElementById('amount')


const listaLocalStorange = JSON.parse(localStorage.getItem('lista_receitas'))
let lista = localStorage.getItem('lista_receitas') !== null ? listaLocalStorange : []

//Atualiza a tela com o que veio do banco assim que abre a página
function iniciarApp() {

    historico.innerHTML = ''
    lista.forEach(adicionarListaNoDOM) // Para cada item salvo, desenha na tela
    atualizarValores() // Recalcula o saldo total com os dados antigos
}

iniciarApp() // Chama a função para rodar tudo

adicionarTransacao.addEventListener('submit', (evento) => {

    evento.preventDefault()

    const nome = nomeInput.value

    const montante = montanteInput.value

    const listaHistorico = {
        id: Date.now(),
        descricao: nome,
        valor: Number(montante)
    }

    if (nome === '' || montante === '') {
        window.alert('Por Favor, preencha os campos !')
        return
    }

    lista.push(listaHistorico)

    const listaEmTexto = JSON.stringify(lista)
    localStorage.setItem('lista_receitas', listaEmTexto)

    nomeInput.value = ''
    montanteInput.value = ''
    adicionarListaNoDOM(listaHistorico)
    atualizarValores()

})

function adicionarListaNoDOM(transacao) {

    const classe = transacao.valor < 0 ? 'minus' : 'plus'
    const sinal = transacao.valor < 0 ? '-' : '+'
    const item = document.createElement('li')

    item.classList.add(classe)

    item.innerHTML = `
        ${transacao.descricao} 
        <span>${sinal} R$ ${Math.abs(transacao.valor)}</span> 
        <button class="delete-btn" onclick="removerTransacao(${transacao.id})">x</button>
    `

    historico.appendChild(item)

}

function atualizarValores() {

    const valores = lista.map(transacao => transacao.valor)

    const Totalreceitas = (valores
        .filter(item => item > 0)
        .reduce((acumulador, item) => { return acumulador + item }, 0)
        .toFixed(2)
    )

    const Totaldespesas = (valores
        .filter(item => item < 0)
        .reduce((acumulador, item) => { return acumulador + item }, 0)
        .toFixed(2)
    )

    receitas.innerText = `+ ${Totalreceitas}`

    despesas.innerText = `- ${Math.abs(Totaldespesas)}`

}

function removerTransacao(id) {
    // 1. A Peneira: Mantém apenas os itens que têm ID DIFERENTE do que clicamos
    lista = lista.filter(transacao => transacao.id !== id)

    // 2. Atualiza o Banco (LocalStorage) com a lista nova (menor)
    localStorage.setItem('lista_receitas', JSON.stringify(lista))

    // 3. Recarrega a tela para sumir com o item visualmente
    iniciarApp()
}


