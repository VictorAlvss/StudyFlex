//SELECT SCRIPT
lucide.createIcons();

//URL API DE DADOS

//URL ATUAL
let currentURL = window.location.href;

//MAIN CONTAINER
const mainContainer = document.getElementById("mainContainer");

//ASIDE VARIABLES
const asideOptions = document.getElementsByClassName("aside-option");
const dashboard = document.getElementById("dashboardTab");
const anotacoes = document.getElementById("anotacoesTab");
const materias = document.getElementById("materiasTab");
const config = document.getElementById("configTab");

//TASK CONTAINER
const taskContainer = document.getElementById("taskContainer");

//FUNCTIONS --------------

/*
fetch(URL_MATERIAS)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao realizar a requisição");
    }
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      var childElement = document.createElement("option");
      childElement.textContent = data[i].nome;
      childElement.childElement = taskSubject.appendChild(childElement);
    }
  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch
    console.error("Erro ao realizar a requisição", error);
  });*/

//Toggling active style in the aside options
for (let asideOption of asideOptions) {
  //function to toggle style
  asideOption.addEventListener("click", () => {
    let toAddStyle = document.getElementById(asideOption.id);

    //checking the active option
    for (let option of asideOptions) {
      if (option.classList.contains("active")) {
        option.classList.remove("active");
      }
    }
    toAddStyle.classList.add("active");
  });
}

/*
    // Use the JSON data
    for (let i = 0; i < data.length; i++) {
      /*var taskHtmlElement = `
          <article class="task-preview note">
              <a href="#"><h3 class="task-title">${data[i].nome}</h3></a>
              <a href="#" class="task-subject">${data[i].materia}</a>
              <p class="task-description">
              ${data[i].descricao}
              </p>
              <button  class="task-details">
                <img
                  src="./assets/imgs/details_icon.png"
                  alt="Detalhes icone"
                  class="icon task-icon"
                />
              </button>
            </article>
    `;*/
