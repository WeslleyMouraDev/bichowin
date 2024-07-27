document.addEventListener("DOMContentLoaded", () => {
    let saldoInicial = 0;
    let saldoFinal = 0;
    let lucro = 0;
    let quantApostas = 0;
    let vitorias = 0;
    let derrotas = 0;

    const animalEmojis = {
        "Tigre": "🐅",
        "Gato": "🐱",
        "Cachorro": "🐶",
        "Vaca": "🐄",
        "Camelo": "🐫",
        "Urso": "🐻",
        "Burro": "🐴",
        "Cobra": "🐍",
        "Leão": "🦁",
        "Cabra": "🐐",
        "Veado": "🦌",
        "Águia": "🦅",
        "Cavalo": "🐴",
        "Touro": "🐂",
        "Galo": "🐓",
        "Carneiro": "🐑",
        "Elefante": "🐘",
        "Pavão": "🦚",
        "Avestruz": "🦤",
        "Jacaré": "🦎",
        "Borboleta": "🦋",
        "Peru": "🦃",
        "Macaco": "🐒",
        "Porco": "🐷",
        "Coelho": "🐇"
    };



    const saldoInicialInput = document.getElementById("saldoInicial");
    const valorApostaInput = document.getElementById("valorAposta");
    const tipoApostaInput = document.getElementById("tipoAposta");
    const quantGruposInput = document.getElementById("quantidadeGrupos");

    const quantApostasSpan = document.getElementById("quantApostas");
    const vitSpan = document.getElementById("vit");
    const derSpan = document.getElementById("der");
    const saldoInicialResultSpan = document.getElementById("saldoInicialResult");
    const saldoFinalSpan = document.getElementById("saldoFinal");
    const lucroSpan = document.getElementById("lucro");

    const vitoriaButton = document.getElementById("vitoria");
    const derrotaButton = document.getElementById("derrota");
    const apagarUltimaButton = document.getElementById("apagarUltima");
    const resetar = document.getElementById("resetar");

    // Obtém a data atual
    const today = new Date();

    // Subtrai um dia
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Formata a data no formato YYYY-MM-DD
    const formattedDate = yesterday.toISOString().split('T')[0];

    // Define o valor do input de data
    document.getElementById("data").value = formattedDate;

    document.getElementById("buscarResultados").addEventListener("click", () => {
        const data = document.getElementById("data").value;
        const banca = document.getElementById("banca").value;

        if (!data || !banca) return;


        function getAnimalEmoji(animalName) {
            return animalEmojis[animalName] || ""; // Retorna uma string vazia se o animal não estiver mapeado
        }

        fetch(`https://bichomania.bet/api/game/results/${data}/${banca}`)
            .then(response => response.json())
            .then(data => {
                const resultadosTabela = document.getElementById("resultadosTabela");
                resultadosTabela.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

                data.forEach(resultado => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                <td>${resultado.campo_loteria_descricao}</td>
                <td>${resultado.campo_resultado_primeira_colocacao} - ${resultado.campo_resultado_primeiro_animal} ${getAnimalEmoji(resultado.campo_resultado_primeiro_animal)}</td>
                <td>${resultado.campo_resultado_segunda_colocacao} - ${resultado.campo_resultado_segundo_animal} ${getAnimalEmoji(resultado.campo_resultado_segundo_animal)}</td>
                <td>${resultado.campo_resultado_terceira_colocacao} - ${resultado.campo_resultado_terceiro_animal} ${getAnimalEmoji(resultado.campo_resultado_terceiro_animal)}</td>
                <td>${resultado.campo_resultado_quarta_colocacao} - ${resultado.campo_resultado_quarto_animal} ${getAnimalEmoji(resultado.campo_resultado_quarto_animal)}</td>
                <td>${resultado.campo_resultado_quinta_colocacao} - ${resultado.campo_resultado_quinto_animal} ${getAnimalEmoji(resultado.campo_resultado_quinto_animal)}</td>
                <td>${resultado.campo_resultado_sexta_colocacao} - ${resultado.campo_resultado_sexto_animal} ${getAnimalEmoji(resultado.campo_resultado_sexto_animal)}</td>
                <td>${resultado.campo_resultado_setima_colocacao} - ${resultado.campo_resultado_setimo_animal} ${getAnimalEmoji(resultado.campo_resultado_setimo_animal)}</td>
            `;

                    resultadosTabela.appendChild(row);
                });
            })
            .catch(error => console.error("Erro ao buscar resultados:", error));

    });



    function atualizarResultados() {
        // Exibindo a quantidade de apostas e vitórias/derrotas sem alterações
        quantApostasSpan.textContent = quantApostas;
        vitSpan.textContent = vitorias;
        derSpan.textContent = derrotas;

        // Formatando os valores monetários com duas casas decimais
        saldoInicialResultSpan.textContent = `R$${saldoInicial.toFixed(2)}`;
        saldoFinalSpan.textContent = `R$${saldoFinal.toFixed(2)}`;
        lucroSpan.textContent = `R$${lucro.toFixed(2)}`;
    }


    vitoriaButton.addEventListener("click", () => {
        const valorAposta = parseFloat(valorApostaInput.value);
        const payout = parseFloat(tipoApostaInput.value);
        const quantGrupos = parseFloat(quantGruposInput.value);

        if (isNaN(valorAposta)) return;

        if (quantApostas === 0) {
            saldoInicial = parseFloat(saldoInicialInput.value);
            saldoFinal = saldoInicial;
        }

        saldoFinal += valorAposta * (payout - quantGrupos);
        lucro = saldoFinal - saldoInicial;
        vitorias++;
        quantApostas++;
        atualizarResultados();
    });

    derrotaButton.addEventListener("click", () => {
        const valorAposta = parseFloat(valorApostaInput.value);
        const quantGrupos = parseFloat(quantGruposInput.value);

        if (isNaN(valorAposta)) return;

        if (quantApostas === 0) {
            saldoInicial = parseFloat(saldoInicialInput.value);
            saldoFinal = saldoInicial;
        }

        saldoFinal -= valorAposta * quantGrupos;
        lucro = saldoFinal - saldoInicial;
        derrotas++;
        quantApostas++;
        atualizarResultados();
    });

    apagarUltimaButton.addEventListener("click", () => {
        if (quantApostas === 0) return;

        const valorAposta = parseFloat(valorApostaInput.value);
        if (isNaN(valorAposta)) return;

        if (derrotas > 0) {
            saldoFinal += valorAposta;
            derrotas--;
        } else if (vitorias > 0) {
            saldoFinal -= valorAposta * 18;
            vitorias--;
        }

        lucro = saldoFinal - saldoInicial;
        quantApostas--;
        atualizarResultados();
    });

    resetar.addEventListener("click", () => {
        saldoInicial = 0;
        saldoFinal = 0;
        lucro = 0;
        quantApostas = 0;
        vitorias = 0;
        derrotas = 0;
        atualizarResultados();
    });
});
