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
