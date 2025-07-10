function QuestEvent(){
    const apiKey = document.getElementById("geminiaipassword").value;
    const gameSelected = document.getElementById("gameSelected").value;
    const questionInput = document.getElementById("questionInput").value;

    if (apiKey === "" || gameSelected === "" || questionInput === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const requestData = {
        apiKey: apiKey,
        game: gameSelected,
        question: questionInput
    };
}