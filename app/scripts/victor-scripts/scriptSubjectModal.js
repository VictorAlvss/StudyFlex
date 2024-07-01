// URL da API
const URL_MATERIA = "http://localhost:3000/materias";

const form = document.getElementById("newSubjectForm");
const subjectsList = document.getElementById("subjectsList");
const searchInput = document.getElementById("searchTaskBar");
const createSubjectBtn = document.getElementById("createSubjectBtn");
const closeSubjectBtn = document.getElementById("closeSubjectBtn");
const createSubjectModal = document.getElementById("createSubjectModal");

// Evento para mostrar o Modal
createSubjectBtn.addEventListener("click", () => {
  createSubjectModal.showModal();
});

// Certificar que o modal fechou
closeSubjectBtn.addEventListener("click", () => {
  createSubjectModal.close();
});

// Evento de enviar o formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("Formulário enviado");

  const formData = new FormData(form);

  // Convertendo dados em um obj
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });

  try {
    const response = await fetch(URL_MATERIA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonObject),
    });

    if (response.ok) {
      createSubjectModal.close();
      fetchSubjects();
    } else {
      const errorText = await response.text();
      alert("Não foi possível criar a matéria! Erro: " + errorText);
      console.error("Erro na resposta:", errorText);
    }
  } catch (error) {
    console.error("Erro ao enviar o formulário:", error);
    alert(
      "Houve um problema ao enviar o formulário. Por favor, tente novamente."
    );
  }
});

// Função para buscar e exibir a lista de matérias, com suporte para filtragem
async function fetchSubjects(filter = "") {
  try {
    // Busca as matérias
    const responseMaterias = await fetch(URL_MATERIA, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!responseMaterias.ok) {
      throw new Error(
        "Erro na resposta da rede: " + responseMaterias.statusText
      );
    }

    const materias = await responseMaterias.json();

    // Busca as tarefas
    const responseTarefas = await fetch("http://localhost:3000/tarefas", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!responseTarefas.ok) {
      throw new Error(
        "Erro na resposta da rede: " + responseTarefas.statusText
      );
    }

    const tarefas = await responseTarefas.json();

    // Limpa a lista de matérias
    subjectsList.innerHTML = "";

    // Filtra matérias conforme o filtro de busca
    const filteredMaterias = materias.filter((materia) =>
      materia.nome.toLowerCase().includes(filter.toLowerCase())
    );

    // Cria os elementos HTML para cada matéria
    filteredMaterias.forEach((materia) => {
      const tarefasDaMateria = tarefas.filter(
        (tarefa) => tarefa.materia === materia.nome
      );
      const numTarefas = tarefasDaMateria.length;

      // Contagem dos status das tarefas
      let emProgresso = 0;
      let concluidas = 0;
      tarefasDaMateria.forEach((tarefa) => {
        if (tarefa.status === "3" || tarefa.status === "2") {
          emProgresso++;
        } else if (tarefa.status === "1") {
          concluidas++;
        }
      });

      // Calcular a porcentagem de conclusão
      const totalTarefas = tarefasDaMateria.length;
      const progresso =
        totalTarefas > 0 ? (concluidas / totalTarefas) * 100 : 0;

      // Cria o elemento da matéria com a barra de progresso
      const materiaBox = document.createElement("div");
      materiaBox.classList.add("materia-box");
      materiaBox.innerHTML = `
         ${materia.nome.toUpperCase()}
        <div class="progress-bar">
          <div class="progress" style="width: ${progresso}%;"></div>
        </div>
        <span class="num-tarefas">N° Tarefas: ${totalTarefas}</span>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.addEventListener("click", () =>
        deleteSubject(materia.id, materia.nome, materiaBox)
      );

      materiaBox.appendChild(deleteBtn);
      subjectsList.appendChild(materiaBox);
    });
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);
  }
}

async function deleteSubject(materiaId, materiaNome, subjectItem) {
  const URL_DELETE = `${URL_MATERIA}/${materiaId}`;

  try {
    // Buscar as tarefas associadas à matéria
    const responseTarefas = await fetch(`http://localhost:3000/tarefas?materia=${materiaNome}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!responseTarefas.ok) {
      throw new Error(
        "Erro na resposta da rede ao buscar tarefas: " + responseTarefas.statusText
      );
    }

    const tarefas = await responseTarefas.json();

    // Apagar todas as tarefas associadas
    for (const tarefa of tarefas) {
      await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }

    // Apagar a matéria
    const response = await fetch(URL_DELETE, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      subjectsList.removeChild(subjectItem);
    } else {
      const errorText = await response.text();
      alert("Não foi possível deletar a matéria! Erro: " + errorText);
      console.error("Erro na resposta:", errorText);
    }
  } catch (error) {
    console.error("Erro ao deletar a matéria e suas tarefas associadas:", error);
    alert(
      "Houve um problema ao deletar a matéria e suas tarefas associadas. Por favor, tente novamente."
    );
  }
}

// Evento de input no campo de busca para filtrar matérias
searchInput.addEventListener("input", (event) => {
  const filterText = event.target.value;
  fetchSubjects(filterText);
});

// Buscar e exibir a lista de matérias ao carregar a página
fetchSubjects();
