const form = document.getElementById("novoItem");
const lista = document.getElementById('lista');
const items = JSON.parse(localStorage.getItem("items")) || []; 

items.forEach(element => {
    criaElemento(element);
});



// Aqui quanto eu clico em submit
// Eu faço a interrupção do evento de recarregar a página
// fazer a busca dos elementos necessários (nome e quantidade)
// Armazena os dados no LocalStorage
// criar um item de lista
// limpar entrada de dados do formulário
form.addEventListener("submit", (event) => {
    event.preventDefault();
    var nome = event.target.elements['nome'];
    var quantidade = event.target.elements['quantidade'];
    var item = {
        'id': items.length,
        'nome' : capitalize(nome.value),
        'quantidade' : quantidade.value
    };
    
    if(verificaSeExisteItem(item, items) === false){
        armazena(item);
        criaElemento(item);
    }else{
        editaItem(item);
    }

    nome.value = "";
    quantidade.value = "";
    
});

function capitalize(text){
    var nome = text[0].toUpperCase() + text.slice(1).toLowerCase();
    return nome;
}

// função que cria um elemento de lista
function criaElemento(item){
    const novoItem = document.createElement("li");
    novoItem.classList.add("item");

    const divDescricao = document.createElement('div');
    divDescricao.classList.add('descricao');

    const numeroItem = document.createElement("strong");
    numeroItem.dataset.id = item['id'];
    numeroItem.innerHTML = item['quantidade'];

    divDescricao.appendChild(numeroItem);
    divDescricao.innerHTML += item['nome'];

    const divAcoes = document.createElement('div');
    divAcoes.classList.add('acoes');

    const btnEditar = criaBtnEditar();
    const btnExcluir = criaBtnExcluir();

    divAcoes.appendChild(btnEditar);
    divAcoes.appendChild(btnExcluir);

    novoItem.appendChild(divDescricao);
    novoItem.appendChild(divAcoes);

    lista.appendChild(novoItem);
}

function criaBtnEditar(){
    var btnEditar = document.createElement('button');
    btnEditar.classList.add('btn');
    btnEditar.classList.add('editar');
    btnEditar.innerHTML += "Editar";

    btnEditar.addEventListener("click", function () {
        const elementoPai = this.parentNode.parentNode;
        const elementoDescricao = elementoPai.querySelector('.descricao');
        const elementoStrong = elementoPai.querySelector('[data-id]');

        const qnt = elementoStrong.innerHTML;
        const nome = elementoDescricao.innerText;

        const inputNome = document.querySelector('#nome');

        inputNome.value = nome.slice(qnt.length).trim();
;    });

    return btnEditar;
}

function criaBtnExcluir(){
    var btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn');
    btnExcluir.classList.add('excluir');
    btnExcluir.innerHTML += "excluir";

    btnExcluir.addEventListener("click", function(){
        deletaElemento(this.parentNode.parentNode);
    });

    return btnExcluir;
}

function deletaElemento(elemento){
    const elementoStrong = elemento.querySelector('[data-id]');
    
    items.forEach(item => {
        if(item['id'] == elementoStrong.dataset.id){
            console.log(item['id']);
            console.log(elementoStrong.dataset.id);
            elemento.remove();
            if(item['id'] == 0){
                items.splice(parseInt(item['id']), 1);
            }

            items.splice(parseInt(item['id']) - 1, 1);

            localStorage.setItem('items', JSON.stringify(items));
        };
    });
}

// função que armazena meus dados no localStorage do navegador
function armazena(item){
    const itemAtual = {
        'id': item['id'],
        "nome": item['nome'],
        "quantidade": item['quantidade']
    }

    items.push(itemAtual);
    localStorage.setItem("items", JSON.stringify(items));
}

function verificaSeExisteItem(item , listaDeItems){
    var existe = false;

    listaDeItems.forEach(element => {
        if(item['nome'] === element['nome']){
            existe = true;
        }

    });

    return existe;
}

function editaItem(item){
    
    items.forEach(element => {
        if (item['nome'] === element['nome']){
            var strong = document.querySelector('[data-id="' + element['id'] + '"]');
            strong.innerHTML = item['quantidade'];

            var ls = JSON.parse(localStorage.getItem('items'));
            ls[element['id']]['quantidade'] = item['quantidade'];
            localStorage.setItem('items', JSON.stringify(ls));
        }
    })

}