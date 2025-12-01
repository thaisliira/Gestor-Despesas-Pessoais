// ----------------- VARIAVEIS -----------------
let btnDarkMode = document.getElementById('themeToggle');
let myForm = document.getElementById('expenseForm');
let select = document.getElementById('category');
const filter = document.getElementById('filterCategory');

//  ----------------- FUNÇOES -----------------

// FUNCAO PARA EXIBIR DATA E HORA LOCAL
function attDataHora() {
    const dataHora = document.getElementById('horaDataLocal');
    const agora = new Date();
    dataHora.textContent = agora.toLocaleString('pt-PT');
}

attDataHora();
setInterval(attDataHora, 1000);

// FUNCAO DE LIGHT/DARK MODE PARA TEMA DA PAGINA
function darkMode() {
    document.body.classList.toggle('theme-dark');
}

// FUNCAO PRINCIPAL PARA PEGAR VALORES DE INPUT DO FORMULARIO E ADICIONAR A UMA LISTA A PARTE
myForm.addEventListener('submit', function(form){
    form.preventDefault();

    const formData = new FormData(this);
    const desc = formData.get('description').trim();
    const valor = formData.get('amount');
    const categ = formData.get('category');

    if (desc =='' || valor == '' || categ == '') {
        alert('Preencha todos os campos, por favor!');
    } else {

        const list = document.querySelector('#expenseList')
        const despesas = document.createElement('li')

        // classe criada para utilizar na funcao de filtrar categoria
        despesas.classList.add('item-despesa'); 
        // guarda a categoria no elemento para ler na funcao filtro, ex: "data-categoria" = categoria escolhida
        despesas.dataset.categoria = categ;
        // guarda o valor como número bruto para utilizar na funcao att total
        despesas.dataset.valor = Number(valor);

        const despesa = document.createElement('span')
        despesa.textContent = `${desc} - ${Number(valor).toFixed(2)}€ (${categ})`;
        
        // CRIA BOTAO DE EDITAR - RETORNA AO FORM DE NOVO PARA O USUARIO EDITAR
        const btnEdit = document.createElement('button')
        btnEdit.textContent = 'Editar'
        btnEdit.classList.add('btn-edit')

        // CRIA BOTAO DE REMOVER
        const btnremov = document.createElement('button')
        btnremov.textContent = 'Apagar'
        btnremov.classList.add('btn-rmv')

        // ADC FUNCAO DE REMOVER AO BOTAO E ATT TOTAL
        btnremov.addEventListener('click', function() {
            despesas.remove();
            atualizarTotal();
            })

        // ADC FUNCAO DE EDITAR AO BOTAO
        btnEdit.addEventListener('click', function() {
            
            // resgata valores para o formulario
            document.getElementById('description').value = desc;
            document.getElementById('amount').value = valor;
            document.getElementById('category').value = categ;

            // remove para evitar duplicidade
            despesas.remove();

            // subtrai o valor deste item do total
            atualizarTotal();

            // redireciona cursor pro formulario
            document.getElementById('description').focus();

        })

        // ADICIONA NO HTML AS DESPESAS E OS BOTOES CRIADOS 
        despesas.appendChild(despesa);  
        despesas.appendChild(btnEdit);  
        despesas.appendChild(btnremov);  
        list.appendChild(despesas);

        atualizarTotal();

        myForm.reset();
    }
})

// FUNCAO PARA FILTRAR POR CATEGORIA
filter.addEventListener('change', function() {

    const categoriaSelecionada = this.value;
    const categoriasDaLista = document.querySelectorAll('.item-despesa');
    
    categoriasDaLista.forEach(function(despesa) {
        const categoriaDaDespesa = despesa.dataset.categoria;
    
    if (categoriaSelecionada == "todas" || categoriaSelecionada == categoriaDaDespesa ) {
        despesa.style.display = 'flex'; 
        } else {
            despesa.style.display = 'none';
    }
    });
    atualizarTotal();
})

function atualizarTotal() {
    let soma = 0;

    document.querySelectorAll('.item-despesa').forEach(item => {
        if (item.style.display !== 'none') { 
            soma += Number(item.dataset.valor);
        }
    });

    document.getElementById('totalAmount').textContent = soma.toFixed(2);
}

// FUNÇAO COM API COM FRASES ALEATORIAS SOBRE FINANÇAS
document.getElementById('carregarFrase').addEventListener('click', function () {
    fetch('https://dummyjson.com/quotes/random')
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('frase').textContent = `"${data.quote}"`;
        document.getElementById('autor-frase').textContent = `- ${data.author}`;
    })
})

// EVENTOS
btnDarkMode.addEventListener('click', darkMode);