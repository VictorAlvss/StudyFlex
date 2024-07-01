//URL API DE DADOS
const URL_TAREFAS = "http://localhost:3000/tarefas";
const URL_MATERIAS = "http://localhost:3000/materias"; // adicionei a url de matérias
const URL_NAVBARS = "http://localhost:3000/janelas";

//NOME DA PÁGINA QUE ESTAMOS
let pageTitle = document.querySelector(".homescreen-title").textContent;

//ELEMENTOS DO MODAL DE CRIAR UMA TAREFA
const createTaskModal = document.getElementById("creteTaskModal");
const createTaskButton = document.getElementById("createTaskBtn");
const closeTaskButton = document.getElementById("closeTaskCreatorButton");

//CONTAINER DA LISTA DE TAREFAS
const tasksContainer = document.getElementById("tasksContainer");
const tasksList = document.getElementById("taskList");

//ELEMENTOS E VARIAVEIS DE PAGINAÇÃO
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const pageCounter = document.getElementById("pageCounter");
const taskPerPage = 3;
let URL_TAREFAS_PAGE;
let SORT_URL;
let page = 1;
let skip;
let keyFilter, valueFilter;

let pageLength;

//ELEMENTOS DA BARRA DE PESQUISA
const searchTaskBar = document.getElementById("searchTaskBar");
const searchButton = document.getElementById("searchButton");

//MENSAGEM
const message = document.getElementById("message");

//NAV
const mainNavBar = document.getElementById("mainNavBar");
const okButton = document.getElementById("okButton");

//MATÉRIAS
let materiasArray;

async function getSubjects() {
  materiasArray = await getSubjectList();
}

getSubjects();

//REALIZA UMA PESQUISA NAS TAREFAS REGISTRADAS NO BANCO
//COM O NÚMERO DE TAREFAS, DEFINIMOS A ESTRUTRA DE PÁGINAS DO NOSSO SITE
async function fetchTasks(url) {
  try {
    const response = await fetch(url ? url : URL_TAREFAS);
    if (response.ok) {
      const data = await response.json();
      pageLength = data.length;
      console.log(pageLength);
      if (pageLength === 0) {
        prevButton.classList.add("hide");
        nextButton.classList.add("hide");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

fetchTasks();

async function buscarMaterias() {
  try {
    const response = await fetch(URL_MATERIAS);
    if (!response.ok) {
      throw new Error("Erro ao buscar matérias");
    }
    const materias = await response.json();
    return materias;
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
}

async function buscarJanelas() {
  try {
    const response = await fetch(URL_NAVBARS);
    if (!response.ok) {
      if (response.status == 404) {
        return [];
      }
      throw new Error("Erro ao buscar janelas");
    }
    const janelas = await response.json();
    return janelas;
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
}

async function getSubjectList() {
  const materias = await buscarMaterias();
  return materias;
}

async function getNavList() {
  const janelas = await buscarJanelas();
  return janelas;
}

async function getTask(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Houve um erro ao pesquisar a tarefa!");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .then((taskObj) => {
      return taskObj;
    })
    .catch((error) => {
      console.error("Houve um problema ao exluir a tarefa:", error);
      throw error;
    });
}

//DELETAR A TAREFA QUE FOI PASSADA NA URL
async function deleteTaskURL(url) {
  console.log(url);
  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok && response.status != 500) {
        throw new Error("Houve um erro ao excluir a tarefa!");
      }
      return response;
    })
    .catch((error) => {
      console.error("Houve um problema ao exluir a tarefa:", error);
      throw error;
    });
}

//RETORNA UMA URL COM BASE NOS PARAMETROS PASSADOS
//DEFINE A BASE DA PESQUISA QUE SERÁ FEITA NO BANCO
function returnURL(key, value, sorting) {
  //KEY - 'propriedade' da tarefa
  //VALUE - valor da propriedade
  //SORTING - modo de ordenação das tarefas (query de ordenação do json server)
  //URL BASE DA PÁGINA DE DASHBOARD (APRESENTA APENAS AS TAREFAS ATIVAS - STATUS 2 E 3)
  let URL_DASHBOARD = `http://localhost:3000/tarefas?status=2&status=3&_page=${page}&_limit=${taskPerPage}`;
  //URL BASE DA PÁGINA DE TAEFAS (APRESENTA TODDAS AS TAREFAS CRIADAS)
  let URL_TAREFAS = `http://localhost:3000/tarefas?_page=${page}&_limit=${taskPerPage}`;

  if (key == "materiaId" && value != 0) {
    let url = `http://localhost:3000/tarefas?${key}=${value}&_page=${page}&_limit=${taskPerPage}`;
    if (sorting) {
      url + sorting;
    }
    return url;
  } else if (key == "materiaId" && value == 0) {
    if (sorting) {
      return URL_TAREFAS + sorting;
    }
    return URL_TAREFAS;
  }

  //VERIFICA SE FOI PASSADO ALGUMA CRITERIO PARA LISTAR AS TAREFAS
  if (!key && !value && !sorting) {
    //RETORNA A URL SEM NENHUM FILTRO E SEM ORDENAÇÃO
    if (pageTitle === "Dashboard") {
      return URL_DASHBOARD;
    } else if (pageTitle === "Tarefas") {
      return URL_TAREFAS;
    }
  } else if (!key && !value && sorting) {
    //RETORNA A URL SEM NENHUM FILTRO E COM ORDENAÇÃO
    if (pageTitle === "Dashboard") {
      return URL_DASHBOARD + sorting;
    } else if (pageTitle === "Tarefas") {
      return URL_TAREFAS + sorting;
    }
  }

  //RETORNAS AS URLS QUE TIVEREM ALGUM TIPO DE FILTRO NAS TAREFAS + ORDENAÇÃO
  if (pageTitle === "Dashboard") {
    URL_DASHBOARD = `http://localhost:3000/tarefas?${key}=${value}&_page=${page}&_limit=${taskPerPage}`;
    if (sorting) {
      return URL_DASHBOARD + sorting;
    }
    return URL_DASHBOARD;
  } else if (pageTitle === "Tarefas") {
    URL_TAREFAS = `http://localhost:3000/tarefas?${key}=${value}&_page=${page}&_limit=${taskPerPage}`;
    if (sorting) {
      return URL_TAREFAS + sorting;
    }
    return URL_TAREFAS;
  } else {
    URL_TAREFAS = `http://localhost:3000/tarefas?${key}=${value}&_page=${page}&_limit=${taskPerPage}`;
  }
  return URL_TAREFAS;
}

//CARREGA O HTML DAS TAREFAS NA TELA DE ACORDO COM O CRITÉRIO DE PAGINAÇÃO
async function fetchTasksPages(key, value, sorting) {
  try {
    skip = (page - 1) * taskPerPage; //NÚMERO DE TAREFAS QUE DEVEM SER IGNORADAS E A PARTIR DE QUAL TAREFA REALIZAR A BUSCA

    //SOLICITA A URL BASE COM NO PARAMETROS RECEBIDOS
    if (!key && !value) {
      if (sorting) {
        URL_TAREFAS_PAGE = returnURL(null, null, sorting);
      } else {
        URL_TAREFAS_PAGE = returnURL();
      }
    } else {
      if (sorting) {
        URL_TAREFAS_PAGE = returnURL(key, value, sorting);
      } else {
        URL_TAREFAS_PAGE = returnURL(key, value);
      }
    }

    if (key == "materiaId" && value == 0) {
      URL_TAREFAS_PAGE = returnURL();
    }

    //REALIZA A PESQUISA NO BANCO DAS TAREFAS
    let response = await fetch(URL_TAREFAS_PAGE); //ARRAY DE TODAS AS TAREFAS QUE DEVEM SER LISTADAS NA PÁGINA
    let taskData = await response.json();

    if (key && value && key != "materiaId" && taskData.length === 0) {
      URL_TAREFAS_PAGE = returnURL();
      response = await fetch(URL_TAREFAS_PAGE);
      taskData = await response.json();
    }

    if (key == "materiaId" && taskData.length == 0) {
      let notFoundHtml = `
         <li id="notFoundWarning">
        <img src="./assets/imgs/page_not_found_img.png" alt="not found">
      </li>
      `;
      taskList.innerHTML = notFoundHtml;
      prevButton.classList.add("hide");
      nextButton.classList.add("hide");
      pageCounter.classList.add("hide");
      tasksContainer.classList.add("notfound");

      return;
    }

    if (response.ok) {
      if (key == "materiaId" && value == 0) {
        URL_TAREFAS_PAGE = URL_TAREFAS;
        fetchTasks(URL_TAREFAS_PAGE);
        prevButton.classList.remove("unactive");
        nextButton.classList.remove("unactive");
      } else {
        URL_TAREFAS_PAGE = returnURL(key, value, sorting);
      }

      prevButton.classList.remove("hide");
      nextButton.classList.remove("hide");

      if (page == 1) {
        prevButton.classList.add("unactive");
      } else {
        prevButton.classList.remove("unactive");
      }

      let pages = Math.ceil(pageLength / taskPerPage);

      if (page == pages) {
        nextButton.classList.add("unactive");
      } else {
        nextButton.classList.remove("unactive");
      }

      //VERIFICA SE NÃO HÁ NENHUMA TAREFA CRIADA
      if (taskData.length === 0) {
        pageCounter.classList.add("hide");
        return;
      }

      //ADICIONA OS ELEMENTOS HMTL DE PAGINAÇÃO
      pageCounter.classList.remove("hide");
      pageCounter.innerHTML = `<span>${page}</span>`;
      tasksList.innerHTML = ""; //ZERA A LISTA DE TAREFAS NO HTML

      let taskPreview, taskListContent;

      for (let i = 0; i < taskData.length; i++) {
        let taskStatus;
        taskPreview = document.createElement("l1");
        taskPreview.innerHTML = "";

        taskPreview.classList.add("task-item");

        if (taskData[i].status == 3) {
          taskStatus = "Fazer";
        } else if (taskData[i].status == 2) {
          taskStatus = "Fazendo";
        } else {
          taskStatus = "Feito";
        }

        let taskPriority;
        if (taskData[i].prioridade == 3) {
          taskPriority = "Urgente";
        } else if (taskData[i].prioridade == 2) {
          taskPriority = "Alta";
        } else {
          taskPriority = "Normal";
        }

        let subjectContent;
        if (taskData[i].materia === undefined) {
          subjectContent = "<span class='no-subject'></span>";
        } else {
          subjectContent = `<span>${taskData[i].materia}</span>`;
        }
        let finalDate = new Date(taskData[i].dataFinal);
        finalDate.setDate(finalDate.getDate() + 1);

        //CRIA O ELEMENTO HTML DA TAREFA CRIADA
        taskListContent = `
        <article class="task-item-preview" data-taskid="${taskData[i].id}">
        <div class="task-item-header">
          <div class="task-preview-title">
            <h2>${taskData[i].nome}</h2>
            ${subjectContent}
          </div>

          <div class="task-preview-options">
            <button class="options-icon-container delete-button" id="deleteTaskButton" data-taskid="${
              taskData[i].id
            }"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
       
        <div class="task-preview-details">
          <div class="details-container status-preview">
          <img src="./assets/imgs/task-icons/status-icon.png" alt="status"> 
            <span> ${taskStatus}</span>
          </div>
          <div class="details-container proridade-preview">
          <img src="./assets/imgs/task-icons/flag-icon.png" alt="status"/>
            <span>${taskPriority}</span>
          </div>
          <div class="details-container dataFinal-preview">
          <img src="./assets/imgs/task-icons/calendar-icon.png" alt="status"/>
            <span>${finalDate.toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}</span>
          </div>
        </div>

        <div class="task-preview-description">
          <p>${taskData[i].descricao}</p>
        </div>
      </article>
      </div>
      `;

        //ADICIONA A TAREFADA NO <li> PARA SER INCLUSO NA LISTA DE TAREFAS
        taskPreview.innerHTML += taskListContent;
        tasksList.appendChild(taskPreview);
      }

      const deleteTaskButton = document.querySelectorAll(".delete-button"); //BOTÃO DE APAGAR A TAREFA
      const taskElement = document.querySelectorAll(".task-item-preview"); //PREVIEW DA TAREFA

      for (let button of deleteTaskButton) {
        button.addEventListener("click", (e) => {
          deleteTask(button);
          e.stopPropagation();
        });
      }

      for (let task of taskElement) {
        task.addEventListener("click", (e) => {
          openTask(task, "put");
        });
      }
      lucide.createIcons();
    } else {
    }
  } catch (error) {
    {
      alert("Não foi possível carregar as tarefas");
    }
  }
}

fetchTasksPages();

//BOTÃO DE DE VOLTAR 1 PÁGINA
prevButton.addEventListener("click", (e) => {
  console.log(e.target);
  if (page === 1) {
    return;
  } else {
    page--;
    if (searchTaskBar.value) {
      keyFilter = "nome_like";
      valueFilter = searchTaskBar.value;
      fetchTasksPages("nome_like", searchTaskBar.value, SORT_URL);
    } else {
      fetchTasksPages(keyFilter, valueFilter, SORT_URL);
    }
  }
});

//BOTÃO DE DE AVANÇAR 1 PÁGINA
nextButton.addEventListener("click", (e) => {
  let pages = Math.ceil(pageLength / taskPerPage);
  if (page == pages) {
    return;
  } else {
    page++;
    if (searchTaskBar.value) {
      keyFilter = "nome_like";
      valueFilter = searchTaskBar.value;
      fetchTasksPages(keyFilter, valueFilter, SORT_URL);
    } else {
      fetchTasksPages(keyFilter, valueFilter, SORT_URL);
    }
  }
});

newTaskForm.addEventListener("submit", () => {
  createTaskModal.close();
});

closeTaskButton.addEventListener("click", () => {
  createTaskModal.close();
});

//STATUS SELECT
let selectStatus = document.querySelector(".select-status"),
  selectedValueStatus = document.getElementById("selected-value-status"),
  optionsViewButtonStatus = document.getElementById(
    "options-view-button-status"
  ),
  inputOptionsStatus = document.querySelectorAll(".option-status input"),
  statusOption = document.querySelectorAll(".option-status"),
  currentStatus = document.getElementById("currentStatus");

//STATUS VARIABLES
const defaultIcon = document.getElementById("defaultIcon");
const doIcon = document.getElementById("doIcon");
const doingIcon = document.getElementById("doingIcon");
const doneIcon = document.getElementById("doneIcon");

inputOptionsStatus.forEach((input) => {
  input.addEventListener("click", (event) => {
    let statusTitle = input.dataset.label;
    selectedValueStatus.textContent = statusTitle;
    let statusDataSet = `[data-icon]`;
    let statusIcon = document.querySelectorAll(statusDataSet);

    statusIcon.forEach((status) => {
      if (status.dataset.icon == statusTitle) {
        status.classList.add("active");
      } else {
        status.classList.remove("active");
      }
    });

    const isMouseOrTouch =
      event.pointerType == "mouse" || event.pointerType == "touch";
    isMouseOrTouch && optionsViewButtonStatus.click();
  });
});

window.addEventListener("keydown", (e) => {
  if (!selectStatus.classList.contains("open")) return;

  if (e.key == "Escape" || e.key == " ") {
    optionsViewButtonStatus.click();
  }
});

optionsViewButtonStatus.addEventListener("input", () => {
  selectStatus.classList.toggle("open");

  if (!selectStatus.classList.contains("open")) return;

  const input =
    document.querySelector(".option input:checked") ||
    document.querySelector(".option input");
  input.focus();
});

//FLAG SELECT
let select = document.querySelector(".select"),
  selectedValue = document.getElementById("selected-value"),
  optionsViewButton = document.getElementById("options-view-button"),
  inputOptions = document.querySelectorAll(".option input");

const defaultFlagIcon = document.getElementById("defaultFlagIcon");

inputOptions.forEach((input) => {
  input.addEventListener("click", (event) => {
    let statusTitle = input.dataset.label;
    selectedValue.textContent = statusTitle;

    if (statusTitle == "Normal") {
      defaultFlagIcon.classList.remove("Alta");
      defaultFlagIcon.classList.remove("Urgente");
      defaultFlagIcon.classList.add("Normal");
    } else if (statusTitle == "Alta") {
      defaultFlagIcon.classList.remove("Normal");
      defaultFlagIcon.classList.remove("Urgente");
      defaultFlagIcon.classList.add("Alta");
    } else {
      defaultFlagIcon.classList.remove("Alta");
      defaultFlagIcon.classList.remove("Normal");
      defaultFlagIcon.classList.add("Urgente");
    }

    const isMouseOrTouch =
      event.pointerType == "mouse" || event.pointerType == "touch";
    isMouseOrTouch && optionsViewButton.click();
  });
});

window.addEventListener("keydown", (e) => {
  if (!select.classList.contains("open")) return;

  if (e.key == "Escape" || e.key == " ") {
    optionsViewButton.click();
  }
});

optionsViewButton.addEventListener("input", () => {
  select.classList.toggle("open");

  if (!select.classList.contains("open")) return;

  const input =
    document.querySelector(".option input:checked") ||
    document.querySelector(".option input");
  input.focus();
});

//ADD TASK FORM
const taskTitle = document.getElementById("taskTitle");
const taskStatus = document.getElementById("selected-value-status");
const taskSubject = document.getElementById("taskSubject");
const taskFinalDate = document.getElementById("TaskEndDate");
const taskPriority = document.getElementById("selected-value");
const taskDescription = document.getElementById("taskDescription");

//Create task from homescreen - POST METHOD
createTaskButton.addEventListener("click", () => {
  openTask(null, "post");
});

//FILTERING TASKS
const filterButton = document.getElementById("filterTask");
const sortButton = document.getElementById("sortTask");
const filterModal = document.getElementById("filterTaskModal");
const sortModal = document.getElementById("sortTaskModal");
const statusFilter = document.getElementById("statusGroup");
const priorityFilter = document.getElementById("priorityGroup");
const statusOptions = document.getElementById("statusOptions");
const priorityOptions = document.getElementById("priorityOptions");

function getOption(option) {
  switch (option) {
    case "Fazer":
      return ["3", "status"];
    case "Fazendo":
      return ["2", "status"];
    case "Feito":
      return ["1", "status"];
    case "Urgente":
      return ["3", "prioridade"];
    case "Alta":
      return ["2", "prioridade"];
    case "Normal":
      return ["1", "prioridade"];
    default:
      return "";
  }
}

filterButton.addEventListener("click", () => {
  filterModal.classList.toggle("active");

  const filterOption = document.querySelectorAll(".filter-option");
  filterOption.forEach((option) => {
    option.addEventListener("click", () => {
      let optionChosen = option.textContent;
      let value = getOption(optionChosen)[0];
      let key = getOption(optionChosen)[1];
      keyFilter = key;
      valueFilter = value;
      page = 1;
      fetchTasksPages(keyFilter, valueFilter);
    });
  });

  statusFilter.addEventListener("click", () => {
    priorityOptions.classList.remove("active");
    statusOptions.classList.toggle("active");
  });

  priorityFilter.addEventListener("click", () => {
    statusOptions.classList.remove("active");
    priorityOptions.classList.toggle("active");
  });
});

//SORT TASKS
sortButton.addEventListener("click", () => {
  sortModal.classList.toggle("active");

  const sortOption = document.querySelectorAll(".sort-option");
  sortOption.forEach((option) => {
    option.addEventListener("click", () => {
      let sortOrder;
      let sortInfo = option.textContent.trim().split(" ").at(-1);
      let sortObject = option.classList[1];
      if (sortInfo === "crescente") {
        sortOrder = "asc";
      } else {
        sortOrder = "desc";
      }
      //SORT URL
      SORT_URL = `&_sort=${sortObject}&_order=${sortOrder}`;
      fetchTasksPages(keyFilter, valueFilter, SORT_URL);
    });
  });
});

//EDIT AND DELETE TASKS
function deleteTask(taskButton) {
  const message = document.getElementById("deleteMessage");
  message.showModal();

  const deleteButton = document.getElementById("deleteButton");
  const cancelDeleteButton = document.getElementById("dontDeleteButton");

  deleteButton.addEventListener("click", (event) => {
    let taskId = taskButton.dataset.taskid;
    deleteTaskURL(`http://localhost:3000/tarefas/${taskId}`);
    message.close();
  });

  cancelDeleteButton.addEventListener("click", () => {
    message.close();
  });
}

function deleteNav(navButton) {
  let taskId = navButton.id;
  deleteTaskURL(`http://localhost:3000/janelas/${taskId}`);
}

function getStatusHTML(status, mode) {
  let htmlCode;

  switch (status) {
    case "1":
      htmlCode = `
      <button class="item-info-button done-button" id="changeStatusButton" onclick="changeStatus(3)">
       <div class="item-info-container">
            <i data-lucide="circle-check"></i>
               <span id="taskDetailsStatus" data-status="1" >Feito</span>
             </div>
           <span class="border"></span>

            <div class="item-info-container">
          <i data-lucide="refresh-ccw" class="spin-icon"></i>
       </div>
       </button>
      `;
      break;

    case "2":
      htmlCode = `
      <button class="item-info-button doing-button" id="changeStatusButton" onclick="changeStatus(1)" >
       <div class="item-info-container">
            <i data-lucide="circle-minus"></i>
               <span id="taskDetailsStatus" data-status="2">Fazendo</span>
             </div>
           <span class="border"></span>

            <div class="item-info-container">
          <i data-lucide="refresh-ccw" class="spin-icon"></i>
       </div>
       </button>
      `;
      break;

    case "3":
      htmlCode = `
      <button class="item-info-button do-button" id="changeStatusButton" onclick="changeStatus(2)">
       <div class="item-info-container">
            <i data-lucide="circle-dot"></i>
               <span id="taskDetailsStatus" data-status="3">Fazer</span>
             </div>
           <span class="border"></span>

            <div class="item-info-container">
          <i data-lucide="refresh-ccw" class="spin-icon"></i>
       </div>
       </button>
      `;
      break;
    default:
      break;
  }
  if (mode == null) {
    return htmlCode;
  } else {
  }
}

function getPriorityHTML(prioridade) {
  let htmlCode;
  switch (prioridade) {
    case "3":
      htmlCode = `
      <button class="item-info-button urgent-button" id="changePriorityButton" onclick="changePriority(1)">
       <div class="item-info-container ">
            <i data-lucide="flag"></i>
            <span id="taskDetailsPriority" data-priority="3">Urgente</span>
        </div>

            <span class="border"></span>

      <div class="item-info-container">
         <i data-lucide="refresh-ccw" class="spin-icon"></i>
      </div>
      </button>
      `;
      break;

    case "2":
      htmlCode = `
      <button class="item-info-button high-button" id="changePriorityButton" onclick="changePriority(3)">
      <div class="item-info-container">
            <i data-lucide="flag"></i>
            <span id="taskDetailsPriority" data-priority="2">Alta</span>
        </div>

            <span class="border"></span>

      <div class="item-info-container">
         <i data-lucide="refresh-ccw" class="spin-icon"></i>
      </div>
      </button>
      `;
      break;

    case "1":
      htmlCode = `
      <button class="item-info-button normal-button" id="changePriorityButton" onclick="changePriority(2)">
      <div class="item-info-container">
            <i data-lucide="flag"></i>
            <span id="taskDetailsPriority" data-priority="1">Normal</span>
        </div>

            <span class="border"></span>

      <div class="item-info-container">
         <i data-lucide="refresh-ccw" class="spin-icon"></i>
      </div>
      </button>
      `;

      break;
    default:
      break;
  }

  return htmlCode;
}

function changeStatus(status) {
  statusContainer.innerHTML = "";
  statusContainer.innerHTML = getStatusHTML(status.toString());
  lucide.createIcons();
}

function changeSubject(subItem) {
  const subTitle = document.getElementById("taskDetailsSubject");
  subTitle.innerHTML = subItem.innerHTML;
  subTitle.dataset.subid = subItem.dataset.subject;
}

function changePriority(prioridade) {
  priorityContainer.innerHTML = "";
  priorityContainer.innerHTML = getPriorityHTML(prioridade.toString());
  lucide.createIcons();
}

function getTaskDetails(taskid) {
  const TaskDetailsTitle = document.getElementById("TaskDetailsTitle").value;
  const taskDetailsDate = document.getElementById("taskDetailsDate").value;
  const taskDetailsStatus =
    document.getElementById("taskDetailsStatus").dataset.status;
  const taskDetailsPriority = document.getElementById("taskDetailsPriority")
    .dataset.priority;
  const taskDetailsDecription = document
    .getElementById("taskDetailsDecription")
    .value.trim();
  const taskDetailsSubject =
    document.getElementById("taskDetailsSubject").textContent;

  const taskDetailsSubjectId =
    document.getElementById("taskDetailsSubject").dataset.subid;

  let taskdata = {};
  if (taskid) {
    taskdata = {
      nome: TaskDetailsTitle,
      status: taskDetailsStatus,
      dataFinal: taskDetailsDate,
      prioridade: taskDetailsPriority,
      materia: taskDetailsSubject,
      descricao: taskDetailsDecription.trim().replace(/\s+/g, " "),
      materiaId: taskDetailsSubjectId,
    };
  } else {
    taskdata = {
      nome: TaskDetailsTitle,
      status: taskDetailsStatus,
      dataFinal: taskDetailsDate,
      prioridade: taskDetailsPriority,
      materia: taskDetailsSubject,
      descricao: taskDetailsDecription.trim().replace(/\s+/g, " "),
      materiaId: taskDetailsSubjectId,
    };
  }
  return taskdata;
}

async function openTask(taskElement, method) {
  let taskElementID;
  let dataAtual = "";
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  let url = "";
  if (method === "put") {
    taskElementID = taskElement.dataset.taskid;

    url = `http://localhost:3000/tarefas/${taskElementID}`;
  } else {
    let hoje = new Date();

    let dia = String(hoje.getDate()).padStart(2, "0");
    let mes = String(hoje.getMonth() + 1).padStart(2, "0"); // getMonth() retorna o mês de 0 a 11, então somamos 1
    let ano = hoje.getFullYear();

    dataAtual = `${ano}-${mes}-${dia}`;
  }

  fetch(url ? url : `http://localhost:3000/tarefas/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Houve um erro ao pesquisar a tarefa!");
      }
      return response.json();
    })
    .then(async (task) => {
      let statusHTML = getStatusHTML(task.status ? task.status : "3");
      let priorityHTML = getPriorityHTML(
        task.prioridade ? task.prioridade : "1"
      );

      let taskHTML = `
      <div class="task-detail-container">
              <button class="btn close-btn" id="closeTaskDetail"><i data-lucide="x"></i></button>
              <div class="task-detail-header">
                <div class="task-detail-title">
                  <input type=text" id="TaskDetailsTitle" class="task-title" value="${
                    task.nome ? task.nome : ""
                  }" placeholder="NOME DA TAREFA"></input>
                  <span class="subject-title">${
                    !task.materia ? "matéria" : task.materia
                  }</span>
                </div> 
              </div>

              <div class="task-details-data">
                <ul class="task-data-list">
                  <li class="task-data-item">
                    <div class="item-title">
                      <i data-lucide="loader-circle"></i>
                    <span>Status</span>
                  </div>

                  <div id="statusContainer">${statusHTML}</div>
                  
                    
                  </li >
                  <li class="task-data-item">
                    <div class="item-title">
                      <i data-lucide="book-marked"></i>
                      <span>Matéria</span>
                    </div>

                    <button class="subject-info-button" id="changeSubjectButton">
                      <div class="item-info-container">
                        <span id="taskDetailsSubject">${
                          !task.materia ? "selecionar matéria" : task.materia
                        }</span>
                      </div>
  
                    <span class="border"></span>
  
                      <div class="item-info-container" id="subContainer">
                        <i data-lucide="chevron-right" class="spin-icon"></i>
                      </div>
                    </button>
                    ${await loadSubjects()}
                  </li>

                  <li class="task-data-item">
                    <div class="item-title">
                      <i data-lucide="flag"></i>
                    <span>Prioridade</span>
                  </div>

                  <div id="priorityContainer">${priorityHTML}</div>
                    
                  </li>   

                  <li class="task-data-item">
                    <div class="item-title">
                      <i data-lucide="calendar-days"></i>
                      <span>Data final</span>
                    </div>

                    <input type="date" id="taskDetailsDate" class="input-date" value=${
                      task.dataFinal ? task.dataFinal : dataAtual
                    }>
                    
                  </li>
                               
                </ul>

                <div class="task-data-description">
                  <div class="data-description-header">
                    <i data-lucide="message-square-more"></i>
                    <span>Descrição</span>
                  </div>

                  <textarea id="taskDetailsDecription" class="data-description-content" maxlength="260">
                    ${task.descricao ? task.descricao : ""}
                  </textarea>
                </div>
              </div>
            </div>
      `;
      taskDetailsModal.innerHTML = taskHTML;

      if (method === "post") {
        taskDetailsModal.innerHTML += `
        <div class="postTaskButtonContainer">
          <button id="postTaskButton" type="button">
          <i data-lucide="check"></i>
          </button>
          </div>`;
      }

      taskDetailsModal.showModal();

      const changeSubButton = document.getElementById("changeSubjectButton");
      const subjectsList = document.getElementById("subjectOptionsList");

      changeSubButton.addEventListener("click", async () => {
        subjectsList.classList.toggle("hide");
        const subItens = document.querySelectorAll(".subjectOptionsItem");

        subItens.forEach((subject) => {
          subject.addEventListener("click", (event) => {
            changeSubject(event.target);
          });
        });
      });

      const closeTaskDetailButton = document.getElementById("closeTaskDetail");

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.key === "Esc") {
          closeTaskDetailButton.click();
        }
      });

      if (method === "put") {
        let taskdata;
        closeTaskDetailButton.addEventListener("click", (event) => {
          event.preventDefault();
          taskdata = getTaskDetails(taskElementID);

          fetch(URL_TAREFAS + `/${taskElementID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskdata),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Erro ao editar tarefa" + response.statusText);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Houve um erro ao procurar a tarefa", error);
            });
        });
      } else {
        const postTaskButton = document.getElementById("postTaskButton");
        const warningModal = document.getElementById("warningModal");

        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape" || event.key === "Esc") {
            closeTaskDetailButton.click();
          }
        });
        closeTaskDetailButton.addEventListener("click", () => {
          taskDetailsModal.close();
        });
        postTaskButton.addEventListener("click", () => {
          let taskdata = getTaskDetails();

          valid = false;
          if (
            !taskdata.nome ||
            !taskdata.status ||
            !taskdata.prioridade ||
            !taskdata.dataFinal ||
            taskdata.materia === "selecionar matéria"
          ) {
            let warningMessage = `
             
              <div class="warningImgContainer">
                <img src="./assets/imgs/warning_img.png" alt="Aviso"/>
              </div>
              <div class="textMessage">
                    <p>Escolha um <span>nome</span> e uma <span>matéria</span> para a sua tarefa</p>
                  </div>`;
            message.innerHTML = warningMessage;
            warningModal.showModal();

            okButton.addEventListener("click", async () => {
              warningModal.close();
            });
          } else {
            valid = true;
          }
          if (valid) {
            try {
              fetch(URL_TAREFAS, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(taskdata),
              });
            } catch (error) {
              console.log("Error:", error);
              alert("Erro ao criar tarefa");
            }
          }
        });
      }
    })
    .finally(() => {
      lucide.createIcons();
    });
}

searchTaskBar.addEventListener("keydown", function (event) {
  const query = searchTaskBar.value;
  keyFilter = "nome_like";
  valueFilter = query;
  fetchTasksPages(keyFilter, valueFilter);
});

searchTaskBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    mainNavBar.click();
    searchButton.click();
  }
});

searchButton.addEventListener("click", () => {
  searchTaskBar.value = "";
  let title;
  const pageFilter = document.querySelector("li[]");
  if (pageTitle == "Tarefas") {
    title = pageTitle;
  }
  const mainnav = document.getElementById("mainNavBar");
  mainnav.click();
  fetchTasksPages(keyFilter, valueFilter);
  pageTitle.replace(title);
});

let sublist;

async function loadSubjects() {
  const subjectsData = await getSubjectList();

  try {
  } catch (error) {}
  let list = `<ul id="subjectOptionsList" class="hide">`;
  subjectsData.forEach((subject) => {
    let subItem = `
      <li class="subjectOptionsItem" data-subject="${subject.id}">${subject.nome}</li>`;
    list += subItem;
  });
  list += `</ul>`;

  return list;
}

//ADD NAV ELEMENT
const addSubjectModal = document.getElementById("addSubjectModal");
const openSubjectButton = document.getElementById("addSubjectButton");
const windowNav = document.getElementById("windowNav");
const homescreenTitle = document.querySelector(".homescreen-title");

const modalNoSubject = `
 <button class="btn close-btn" id="closeSubjectNavButton">
            <i data-lucide="x"></i>
          </button>
          <h2>Selecionar matéria</h2>
   <div class="add-subject-content empty">
      <img src="./assets/imgs/not_found_img.jpg" alt="Conteúdo vazio" class="template-img" draggable="false">
    </div>

`;

async function newSubBar(materia) {
  if (janelasAtivas.length >= 5) {
    let warningMessage = `
         
          <div class="warningImgContainer">
            <img src="./assets/imgs/warning_img.png" alt="Aviso"/>
          </div>
          <div class="textMessage">
                <p>Número máximo de janelas ativas atingido!</p>
              </div>`;
    message.innerHTML = warningMessage;
    warningModal.showModal();

    okButton.addEventListener("click", () => {
      warningModal.close();
    });
    return;
  }
  let nome = materia.querySelector("span");
  let navBarSubject = `
      <li
          class="window-view" 
            data-subid=${materia.dataset.subid}
      >
              <h2 class="window-title">${nome.textContent}</h2>
              <button class="closeNav" id=${materia.dataset.subid}><i data-lucide="x" ></i></button>
        </li>
  `;

  let navOBJ = {
    nome: nome.textContent,
    conteudo: navBarSubject,
    materiaId: materia.dataset.subid,
    id: +materia.dataset.subid,
  };

  try {
    fetch(URL_NAVBARS, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(navOBJ),
    });
  } catch (error) {
    console.log("Error:", error);
    alert("Erro ao criar tarefa");
  }
  lucide.createIcons();
}

let janelasAtivas = [];

async function loadSubBar() {
  let janelas = await getNavList();
  let janelasList = ``;
  janelas.forEach((janela) => {
    janelasList += janela.conteudo;
    janelasAtivas.push(+janela.materiaId);
  });

  windowNav.innerHTML += janelasList;
  lucide.createIcons();

  let janelasAbertas = document.querySelectorAll(".window-view");
  let fecharJanelas = document.querySelectorAll(".closeNav");

  for (let button of fecharJanelas) {
    button.addEventListener("click", (e) => {
      deleteNav(button);
      e.stopPropagation();
    });
  }

  for (let janela of janelasAbertas) {
    janela.addEventListener("click", (e) => {
      let janelasAtivas = document.querySelectorAll(".window-view");
      let janelasAbertasTitle = document.querySelectorAll(".window-title");
      let fecharJanelas = document.querySelectorAll(".closeNav");

      janelasAtivas.forEach((janelahtml) => {
        janelahtml.classList.remove("active");
        e.target.classList.add("active");
      });
      let subjectId = janela.dataset.subid;

      if (subjectId === 0) {
        page = 1;
        fetchTasks();
        fetchTasksPages();
      } else {
        page = 1;
        keyFilter = "materiaId";
        valueFilter = subjectId;
        let url = returnURL(keyFilter, valueFilter);
        fetchTasks(url);
        fetchTasksPages(keyFilter, valueFilter);
      }

      let title = janela.textContent.trim();
      homescreenTitle.textContent =
        title === "Tela Inicial" ? "Dashboard" : title;
    });
  }
}

loadSubBar();

//Add subject dialog
addSubjectButton.addEventListener("click", async () => {
  let materias = await getSubjectList();

  if (materias.length === 0) {
    addSubjectModal.innerHTML = modalNoSubject;
  } else {
    let subList = `<ul id="navSubList">`;

    materias.forEach((materia) => {
      let subItem = `
       <li class="navSubItem ${
         janelasAtivas.includes(materia.id) ? "inactive" : ""
       }" data-subid=${materia.id}>
       <button class="navSubButton" data-subid=${materia.id}>
       <span>${materia.nome}</span>
       </button>
       </li>
      `;
      subList += subItem;
    });

    subList += `</ul>`;
    let modalWithSubject = `
     <button class="btn close-btn" id="closeSubjectNavButton">
            <i data-lucide="x"></i>
          </button>
      <h2>Selecionar matéria</h2>
    `;
    modalWithSubject += subList;
    addSubjectModal.innerHTML = modalWithSubject;
  }

  lucide.createIcons();
  addSubjectModal.showModal();
  const closeSubjectButton = document.getElementById("closeSubjectNavButton");
  let navButtonList = document.querySelectorAll(".navSubItem");

  navButtonList.forEach((materia) => {
    materia.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!materia.classList.contains("inactive")) {
        newSubBar(materia);
        closeSubjectButton.click();
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
      closeSubjectButton.click();
    }
    closeSubjectButton.addEventListener("click", () => {
      addSubjectModal.close();
    });
  });

  closeSubjectButton.addEventListener("click", () => {
    addSubjectModal.close();
  });
});
