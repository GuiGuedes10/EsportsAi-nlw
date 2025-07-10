const QuestAi = async (gameSelected, questionInput, apiKey) =>{
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const question = `
    tenho uma dúvida sobre o jogo ${gameSelected}, ${questionInput}
    ##REGRAS
    - não inventar respostas, apenas responder a pergunta, caso não saiba a resposta, explique o porque não sabe.
    - não responder perguntas que não sejam sobre o jogo ${gameSelected}
    - caso a resposta seja muito longa, resuma a resposta (máximo 900 caracteres)
    - responda com base na data (data: ${new Date().toLocaleDateString()})
    - caso não saiba qual é o patch atual, use o patch mais recente do jogo ${gameSelected}
    - não faça saudações, não se apresente, não se despedaça, não faça perguntas, não faça comentários sobre o jogo ou a pergunta.
    - caso a pergunta seja sobre cenario competivo de counter-strike 2, pode levar em consideração o cenário de CS:GO, mas sempre informando que é sobre CS:GO.
    ##FORMATO
    - Respostas médias e objetivas
    - Respostas em português
    - Respostas em formato markdown
    - Respostas com links de fontes confiáveis
    - Respostas sem emojis
    - caso a pergunta seja sobre itens, seja direto e objetivo, responda com o nome do item, o preço e a ordem da build.
    - caso a pergunta seja sobre uma pessoa real que faça (ou ja fez) parte do cenario competitivo busque por todas as formas colocando maiusculo ou minusco entre as letras
    - caso a pergunta seja sobre uma pessoa real que faça parte do cenário competitivo, nunca digue que a pessoa não possui relevancia para o cenário competitivo.
    - caso a pergunta seja sobre uma pessoa real que faça parte do cenário competitivo, informe o nome completo, a nacionalidade, o time atual e o cargo atual.
    ##fontes
    - Exemplos de sites: op.gg, leagueofgraphs, lolalytics, u.gg, porofessor.gg,
    cssstats.gg, csgo-stats.gg, csgo-tracker.gg, cs2-stats.gg, cs2-tracker.gg, tracker.gg, esportspedia.com, liquipedia.net, esportspedia.gg, esportspedia.org, esportspedia.io, esportspedia.live, esportspedia.pro
    - Pode usar sites de estatísticas, guias, vídeos, streams, etc.
    `;

    const contents = [{
        parts: [{
            text: question
        }]
}]
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
    },
    body: JSON.stringify({
        contents: contents,
    })
})
    const data = await response.json();  
    return data.candidates[0].content.parts[0].text;
    
}

const markdownToHtml = (markdown) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}

async function SendQuestion(){
    const apiKey = document.getElementById("geminiaipassword").value;
    const gameSelected = document.getElementById("gameSelected").value;
    const questionInput = document.getElementById("questionInput").value;
    const sendButton = document.getElementById("sendButton");
    const responseContainer = document.getElementById("responseContainer");

    if (apiKey === "" || gameSelected === "" || questionInput === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    sendButton.disabled = true;
    sendButton.textContent = "Enviando...";
    sendButton.classList.add("loading");

    responseContainer.querySelector(".response-content").innerHTML = "";
    responseContainer.classList.remove("able");

    try {
        const data = await QuestAi(gameSelected, questionInput, apiKey);
        responseContainer.classList.add("able");
        responseContainer.querySelector(".response-content").innerHTML = "";
        responseContainer.querySelector(".response-content").innerHTML = markdownToHtml(data);
        
    } catch (error) {
        console.error("Erro ao enviar a pergunta:", error);
        alert("Ocorreu um erro ao enviar sua pergunta. Por favor, tente novamente.");
        sendButton.disabled = false;
        sendButton.textContent = "Perguntar";
        sendButton.classList.remove("loading");
        return;
    } finally{
        sendButton.disabled = false;
        sendButton.textContent = "Perguntar";
        sendButton.classList.remove("loading");
    }
}