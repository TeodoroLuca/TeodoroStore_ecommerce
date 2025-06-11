let produtos = [];
const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// Obtém a referência do header
const header = document.querySelector('header');
let lastScrollY = window.scrollY; // Armazena a posição de rolagem anterior

// Função para lidar com a rolagem
function handleScroll() {
    const currentScrollY = window.scrollY;

    // Se a rolagem atual for maior que a anterior (rolando para baixo) E a rolagem for maior que a altura do header, esconde
    if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
        header.classList.add('hide');
    } else { // Se não, mostra
        header.classList.remove('hide');
    }

    lastScrollY = currentScrollY; // Atualiza a última posição de rolagem
}

// Adiciona o ouvinte de evento de rolagem
window.addEventListener('scroll', handleScroll);

async function carregarProdutos() {
    try {
        const response = await fetch("produtos.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        produtos = data;
        localStorage.setItem("produtos", JSON.stringify(data));
        exibirProdutos(data);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function exibirProdutos(listaProdutos) {
    const produtosDiv = document.getElementById("produtos");
    produtosDiv.innerHTML = "";
    listaProdutos.forEach(produto => {
        const produtoDiv = document.createElement("div");
        produtoDiv.classList.add("produto");
        produtoDiv.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h2>${produto.nome}</h2>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button class="adicionar-carrinho" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        produtosDiv.appendChild(produtoDiv);
    });
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        carrinho.push(produto);
        atualizarCarrinho();
    }
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    const carrinhoLista = document.getElementById("carrinho-itens");
    const totalSpan = document.getElementById("carrinho-total");
    const totalSpanCompleto = document.getElementById("carrinho-total-completo");
    const quantidadeSpan = document.getElementById("carrinho-quantidade");
    carrinhoLista.innerHTML = "";
    let total = 0;
    carrinho.forEach((produto, index) => {
        const itemCarrinho = document.createElement("li");
        itemCarrinho.innerHTML = `${produto.nome} - R$ ${produto.preco.toFixed(2)} <button onclick="removerDoCarrinho(${index})">Remover</button>`;
        carrinhoLista.appendChild(itemCarrinho);
        total += produto.preco;
    });
    totalSpan.textContent = total.toFixed(2);
    totalSpanCompleto.textContent = total.toFixed(2);
    quantidadeSpan.textContent = carrinho.length;
}

const filtrarBtn = document.getElementById("filtrar");
filtrarBtn.addEventListener("click", () => {
    const categoria = document.getElementById("categoria").value;
    const precoMax = parseFloat(document.getElementById("preco-max").value);
    const produtosFiltrados = produtos.filter(produto => {
        if (categoria && produto.categoria !== categoria) {
            return false;
        }
        if (precoMax && produto.preco > precoMax) {
            return false;
        }
        return true;
    });
    exibirProdutos(produtosFiltrados);
});

const carrinhoResumo = document.getElementById("carrinho-resumo");
const carrinhoDiv = document.getElementById("carrinho");
carrinhoResumo.addEventListener("click", () => {
    carrinhoDiv.classList.toggle("oculto")
    const fecharCarrinhoBtn = document.getElementById("fechar-carrinho");

    fecharCarrinhoBtn.addEventListener("click", () => {
        carrinhoDiv.classList.add("oculto");
    });
});

const finalizarCompraBtn = document.getElementById("finalizar-compra");
finalizarCompraBtn.addEventListener("click", () => {
    alert("Compra finalizada com sucesso!");
    carrinho.length = 0;
    atualizarCarrinho();
    carrinhoDiv.classList.add("oculto");
});

carregarProdutos();
atualizarCarrinho();