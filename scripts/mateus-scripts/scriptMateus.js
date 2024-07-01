$(document).ready(function () {
  // Inicialmente, as tarefas estão vazias. Elas serão carregadas da API.
  let tasks = [];

  // Função para carregar tarefas do servidor
  function loadTasks() {
    return fetch("http://localhost:3000/tarefas")
      .then((response) => response.json())
      .then((data) => {
        // Mapeando os dados recebidos para o formato necessário
        tasks = data.map((item) => ({
          date: item.dataFinal,
          title: item.nome,
          subject: item.materia, // Adiciona a matéria à tarefa
        }));
      })
      .catch((error) => {
        console.error("Erro ao carregar tarefas:", error);
      });
  }

  // Atualiza o título do dia atual
  function updateTitle(dateStr) {
    const formattedDate = moment(dateStr).format("dddd, D [de] MMMM");
    const taskInfoTitle = document.querySelector(".task-info-title");
    taskInfoTitle.innerHTML = `<strong>${
      formattedDate.split(",")[0]
    }</strong>, ${formattedDate.split(",")[1]}`;
  }

  // Inicialização do calendário pequeno
  function initializeSmallCalendar() {
    flatpickr("#smallCalendar", {
      inline: true,
      locale: "pt", // Define o idioma para português
      appendTo: document.getElementById("smallCalendarPlaceholder"),
      onDayCreate: function (dObj, dStr, fp, dayElem) {
        const date = dayElem.dateObj.toISOString().split("T")[0];
        const task = tasks.find((task) => task.date === date);
        if (task) {
          dayElem.classList.add("task-day");
        }
      },
      onChange: function (selectedDates, dateStr, instance) {
        showModal(dateStr);
      },
    });
  }

  function showModal(dateStr) {
    const modal = document.getElementById("calendarModal");
    const eventDetails = document.getElementById("eventDetails");
    const selectedDate = document.getElementById("selectedDate");

    // Limpar conteúdo anterior
    eventDetails.innerHTML = "";

    // Adicionar detalhes do evento (ou data clicada)
    const dateTasks = tasks.filter((task) => task.date === dateStr);
    const formattedDate = moment(dateStr).format("dddd, D [de] MMMM");

    selectedDate.innerHTML = formattedDate;

    if (dateTasks.length > 0) {
      dateTasks.forEach((task) => {
        const div = document.createElement("div");
        div.innerHTML = `${task.title} <span class="task-subject">${task.subject}</span>`;
        eventDetails.appendChild(div);
      });
    } else {
      eventDetails.innerHTML = "<div>Sem tarefas</div>";
    }

    // Inicializar o calendário grande dentro do modal
    $("#largeCalendar").fullCalendar("destroy");
    $("#largeCalendar").fullCalendar({
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay",
      },
      locale: "pt-br", // Define o idioma para português
      defaultDate: dateStr,
      navLinks: true,
      editable: true,
      eventLimit: true,
      contentHeight: "auto", // Ajustar a altura do conteúdo
      events: tasks.map((task) => ({
        title: `${task.title} - ${task.subject}`, // Inclui a matéria no título do evento
        start: task.date,
      })),
      dayClick: function (date, jsEvent, view) {
        showModal(date.format());
      },
    });

    // Exibir o modal
    modal.style.display = "block";
  }

  var closeBtn = document.querySelector("#calendarModal .close");

  closeBtn.onclick = function () {
    var modal = document.getElementById("calendarModal");
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    var modal = document.getElementById("calendarModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Carregar as tarefas e inicializar o calendário após o carregamento
  loadTasks().then(() => {
    initializeSmallCalendar();

    // Atualiza o título com a data de hoje ao carregar a página
    const today = moment().format("YYYY-MM-DD");
    updateTitle(today);
  });

  // Configurar Moment.js para português
  moment.locale("pt-br");
});
