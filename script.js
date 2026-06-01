// --- Default Dataset (from projects_ranking.md) ---
const DEFAULT_PROJECTS = [
  { id: "proj-29", name: "FileFusion-Multi-Cloud-Storage-App", tech: "Modern SaaS / Multi-Cloud", complexity: "Most Advanced", status: "highlights" },
  { id: "proj-28", name: "Shoba-Nazam-v2", tech: "Advanced SaaS", complexity: "Professional Fullstack", status: "highlights" },
  { id: "proj-15", name: "SpeakFlow-Speech-Studio", tech: "Speech & Pronunciation Studio", complexity: "Professional Elite", status: "highlights" },
  { id: "proj-14", name: "Lumina-Image-Workspace", tech: "UI & Asset Studio / API", complexity: "Professional Elite", status: "highlights" },
  { id: "proj-24", name: "Computer-Performance-Tracker-Electron-Js-Desktop-App", tech: "Electron (Desktop)", complexity: "Advanced", status: "highlights" },
  
  { id: "proj-20", name: "CryptoCurrency-Website", tech: "Real-time APIs", complexity: "Advanced (Front-end)", status: "progress" },
  { id: "proj-23", name: "Social-Media-App-React-Project", tech: "React Framework", complexity: "Advanced (Front-end)", status: "progress" },
  
  { id: "proj-26", name: "File-Manager-Laravel-vue-Project", tech: "Laravel + Vue", complexity: "Professional Fullstack", status: "completed" },
  { id: "proj-27", name: "Shoba-Nazam", tech: "SaaS Architecture", complexity: "Professional Fullstack", status: "completed" },
  { id: "proj-25", name: "Complete-Ecommerce-Website", tech: "Full-stack Logic", complexity: "Advanced", status: "completed" },
  { id: "proj-22", name: "Learn-Vue-Js-Practice-App", tech: "Vue Fundamentals", complexity: "Advanced (Framework)", status: "completed" },
  { id: "proj-21", name: "Spotify-Clone", tech: "UI / Complex Layout", complexity: "Advanced (Front-end)", status: "completed" },
  { id: "proj-16", name: "QuizMind-Study-Hub", tech: "Gamified AI Quiz / Analytics", complexity: "Professional Elite", status: "completed" },
  { id: "proj-11", name: "Todo-App-React-Project", tech: "React / State / UI", complexity: "Professional Elite", status: "completed" },
  { id: "proj-10", name: "To-Do-List-App", tech: "JS / Local Storage", complexity: "Intermediate", status: "completed" },
  { id: "proj-12", name: "Weather-App", tech: "API Integration", complexity: "Intermediate", status: "completed" },
  
  { id: "proj-1", name: "flexbox-project-css", tech: "CSS / HTML", complexity: "Very Basic", status: "backlog" },
  { id: "proj-2", name: "Amazon-Clone-Css-Project", tech: "CSS / HTML", complexity: "Basic (Layout)", status: "backlog" },
  { id: "proj-3", name: "Tic-Tac-Toe-game", tech: "JS Fundamentals", complexity: "Basic (Logic)", status: "backlog" },
  { id: "proj-4", name: "Rock-Paper-Scissors-Game", tech: "JS Fundamentals", complexity: "Basic (Logic)", status: "backlog" },
  { id: "proj-5", name: "Digital-Clock", tech: "JS DOM manipulation", complexity: "Basic", status: "backlog" },
  { id: "proj-6", name: "Age-Calculator-App-js-project", tech: "JS Manipulation", complexity: "Basic", status: "backlog" },
  { id: "proj-7", name: "Calculator-React-Project", tech: "React Basics", complexity: "Basic (Framework)", status: "backlog" },
  { id: "proj-8", name: "Clock-React-Project", tech: "React State", complexity: "Basic (Framework)", status: "backlog" },
  { id: "proj-9", name: "Random-Password-Generator", tech: "JS Algorithms", complexity: "Intermediate", status: "backlog" },
  { id: "proj-13", name: "Currency-Converter", tech: "Fintech Dashboard / API", complexity: "Professional Elite", status: "backlog" },
  { id: "proj-17", name: "Drag-Drop-Feature", tech: "Intermediate UI", complexity: "Intermediate", status: "backlog" },
  { id: "proj-18", name: "Portfolio-Website", tech: "UI/UX / Branding", complexity: "Intermediate", status: "backlog" },
  { id: "proj-19", name: "My-Portfolio-Website", tech: "UI/UX / Branding", complexity: "Intermediate", status: "backlog" }
];

// --- State Management ---
let projects = [];
let currentSearch = "";
let currentFilter = "all";
let draggingId = null;

// Initialize App
function init() {
  const stored = localStorage.getItem("dev_portfolio_projects");
  if (stored) {
    try {
      projects = JSON.parse(stored);
    } catch (e) {
      projects = [...DEFAULT_PROJECTS];
    }
  } else {
    projects = [...DEFAULT_PROJECTS];
  }
  
  setupDragAndDrop();
  setupEventListeners();
  renderBoard();
}

// Save to LocalStorage
function saveState() {
  localStorage.setItem("dev_portfolio_projects", JSON.stringify(projects));
}

// --- Render Logic ---
function renderBoard() {
  // Clear lists
  const containers = {
    backlog: document.getElementById("cards-backlog"),
    progress: document.getElementById("cards-progress"),
    completed: document.getElementById("cards-completed"),
    highlights: document.getElementById("cards-highlights")
  };
  
  Object.values(containers).forEach(el => el.innerHTML = "");
  
  // Counters reset
  const counts = { backlog: 0, progress: 0, completed: 0, highlights: 0 };
  
  // Filter & sort projects
  projects.forEach((proj, index) => {
    // Search filter
    const matchesSearch = proj.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          proj.tech.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          proj.complexity.toLowerCase().includes(currentSearch.toLowerCase());
    
    // Stack Filter
    let matchesFilter = true;
    if (currentFilter !== "all") {
      const filterLower = currentFilter.toLowerCase();
      matchesFilter = proj.tech.toLowerCase().includes(filterLower) || 
                      proj.complexity.toLowerCase().includes(filterLower) ||
                      proj.name.toLowerCase().includes(filterLower);
    }
    
    if (matchesSearch && matchesFilter) {
      counts[proj.status]++;
      const card = createCardDOM(proj, counts[proj.status]);
      containers[proj.status].appendChild(card);
    }
  });
  
  // Update counts on UI
  document.getElementById("count-backlog").textContent = counts.backlog;
  document.getElementById("count-progress").textContent = counts.progress;
  document.getElementById("count-completed").textContent = counts.completed;
  document.getElementById("count-highlights").textContent = counts.highlights;
}

// Create Card DOM Element
function createCardDOM(proj, rankIndex) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.draggable = true;
  card.setAttribute("data-id", proj.id);
  
  // Complexity badge class helper
  let complexityClass = "badge-basic";
  const comp = proj.complexity.toLowerCase();
  if (comp.includes("intermediate")) {
    complexityClass = "badge-intermediate";
  } else if (comp.includes("advanced")) {
    complexityClass = "badge-advanced";
  } else if (comp.includes("fullstack")) {
    complexityClass = "badge-expert";
  } else if (comp.includes("elite") || comp.includes("most advanced")) {
    complexityClass = "badge-elite";
  }
  
  // Rank identifier for highlights column
  const rankTag = proj.status === "highlights" ? `<span class="rank-badge">#${rankIndex}</span>` : "";
  
  card.innerHTML = `
    <div class="card-top">
      <div class="card-title-area">
        <i class="fa-solid fa-grip-vertical drag-handle"></i>
        ${rankTag}
        <span class="project-title">${proj.name}</span>
      </div>
      <div class="card-actions">
        <button class="card-btn btn-edit" title="Edit details"><i class="fa-solid fa-pen"></i></button>
        <button class="card-btn card-btn-danger btn-delete" title="Delete project"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    <div class="card-details">
      <div class="tech-text">${proj.tech}</div>
      <div class="tags-row">
        <span class="badge ${complexityClass}">${proj.complexity}</span>
      </div>
    </div>
  `;
  
  // Event listeners on actions
  card.querySelector(".btn-edit").addEventListener("click", (e) => {
    e.stopPropagation();
    openEditModal(proj);
  });
  
  card.querySelector(".btn-delete").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteProject(proj.id);
  });
  
  // Drag Events on Card
  card.addEventListener("dragstart", (e) => {
    draggingId = proj.id;
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggingId = null;
    syncDOMStateToData();
  });
  
  return card;
}

// --- Drag and Drop Mechanics ---
function setupDragAndDrop() {
  const columnContainers = document.querySelectorAll(".column-cards-container");
  
  columnContainers.forEach(container => {
    const column = container.closest(".board-column");
    
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingCard = document.querySelector(".project-card.dragging");
      if (!draggingCard) return;
      
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggingCard);
      } else {
        container.insertBefore(draggingCard, afterElement);
      }
    });
    
    container.addEventListener("dragenter", (e) => {
      e.preventDefault();
      column.classList.add("drag-over");
    });
    
    container.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });
    
    container.addEventListener("drop", (e) => {
      e.preventDefault();
      column.classList.remove("drag-over");
      syncDOMStateToData();
    });
  });
}

// Find closest element after current cursor coordinates
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".project-card:not(.dragging)")];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Sync DOM positioning back into projects JS Array state
function syncDOMStateToData() {
  const columns = ["backlog", "progress", "completed", "highlights"];
  const updatedProjects = [];
  
  columns.forEach(colStatus => {
    const container = document.getElementById(`cards-${colStatus}`);
    const cards = container.querySelectorAll(".project-card");
    
    cards.forEach(card => {
      const id = card.getAttribute("data-id");
      const originalProj = projects.find(p => p.id === id);
      if (originalProj) {
        originalProj.status = colStatus;
        updatedProjects.push(originalProj);
      }
    });
  });
  
  // Include projects that were filtered out (so they are not deleted on save)
  projects.forEach(proj => {
    if (!updatedProjects.some(up => up.id === proj.id)) {
      updatedProjects.push(proj);
    }
  });
  
  projects = updatedProjects;
  saveState();
  renderBoard();
}

// --- Event Handlers & Modals ---
function setupEventListeners() {
  // Search & Filters
  document.getElementById("search-input").addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderBoard();
  });
  
  const chips = document.querySelectorAll(".filter-chips .chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderBoard();
    });
  });
  
  // Modals Overlay Open/Close triggers
  const projModal = document.getElementById("project-modal");
  const exportModal = document.getElementById("export-modal");
  
  document.getElementById("btn-add-project").addEventListener("click", () => {
    openAddModal();
  });
  
  document.getElementById("modal-close").addEventListener("click", () => {
    projModal.classList.remove("active");
  });
  
  document.getElementById("btn-cancel").addEventListener("click", () => {
    projModal.classList.remove("active");
  });
  
  document.getElementById("export-close").addEventListener("click", () => {
    exportModal.classList.remove("active");
  });
  
  document.getElementById("btn-export-close").addEventListener("click", () => {
    exportModal.classList.remove("active");
  });
  
  // Reset Action
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the board back to the default 29 projects? Your custom additions/ranks will be lost.")) {
      projects = [...DEFAULT_PROJECTS];
      saveState();
      renderBoard();
    }
  });
  
  // Save Project Form
  document.getElementById("project-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveProjectForm();
  });
  
  // Export Action
  document.getElementById("btn-export").addEventListener("click", () => {
    generateMarkdownExport();
  });
  
  // Copy to Clipboard Action
  document.getElementById("btn-copy-markdown").addEventListener("click", () => {
    const textEl = document.getElementById("markdown-output");
    textEl.select();
    document.execCommand("copy");
    
    const copyBtn = document.getElementById("btn-copy-markdown");
    const origText = copyBtn.innerHTML;
    copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    copyBtn.style.backgroundColor = "#2ed573";
    
    setTimeout(() => {
      copyBtn.innerHTML = origText;
      copyBtn.style.backgroundColor = "";
    }, 2000);
  });
}

// Open modal for Adding
function openAddModal() {
  document.getElementById("modal-title").textContent = "Add New Project";
  document.getElementById("edit-project-id").value = "";
  document.getElementById("proj-name").value = "";
  document.getElementById("proj-tech").value = "";
  document.getElementById("proj-complexity").value = "Intermediate";
  document.getElementById("proj-status").value = "backlog";
  
  document.getElementById("project-modal").classList.add("active");
}

// Open modal for Editing
function openEditModal(proj) {
  document.getElementById("modal-title").textContent = "Edit Project Details";
  document.getElementById("edit-project-id").value = proj.id;
  document.getElementById("proj-name").value = proj.name;
  document.getElementById("proj-tech").value = proj.tech;
  document.getElementById("proj-complexity").value = proj.complexity;
  document.getElementById("proj-status").value = proj.status;
  
  document.getElementById("project-modal").classList.add("active");
}

// Save Project Form Action (create/update)
function saveProjectForm() {
  const id = document.getElementById("edit-project-id").value;
  const name = document.getElementById("proj-name").value.trim();
  const tech = document.getElementById("proj-tech").value.trim();
  const complexity = document.getElementById("proj-complexity").value;
  const status = document.getElementById("proj-status").value;
  
  if (id) {
    // Editing existing
    const proj = projects.find(p => p.id === id);
    if (proj) {
      proj.name = name;
      proj.tech = tech;
      proj.complexity = complexity;
      proj.status = status;
    }
  } else {
    // Add new
    const newProj = {
      id: "proj-" + Date.now(),
      name,
      tech,
      complexity,
      status
    };
    projects.unshift(newProj);
  }
  
  saveState();
  renderBoard();
  document.getElementById("project-modal").classList.remove("active");
}

// Delete project
function deleteProject(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    projects = projects.filter(p => p.id !== id);
    saveState();
    renderBoard();
  }
}

// Generate Markdown Table Export
function generateMarkdownExport() {
  let md = "# Project Progress: From Basic to Advanced\n\n";
  md += "This is a chronological and complexity-based list of your projects, showcasing your journey from learning the fundamentals of CSS to building complex multi-cloud storage applications and SaaS systems.\n\n";
  md += "| # | Project Name | Tech Category | Complexity Level |\n";
  md += "|---|---|---|---|\n";
  
  // Render in hierarchical order of status: Highlights -> Completed -> Progress -> Backlog
  const order = ["highlights", "completed", "progress", "backlog"];
  let globalRank = 1;
  
  order.forEach(colStatus => {
    const colProjects = projects.filter(p => p.status === colStatus);
    colProjects.forEach(proj => {
      // Clean tags style markup if needed
      md += `| ${globalRank} | \`${proj.name}\` | ${proj.tech} | ${proj.complexity} |\n`;
      globalRank++;
    });
  });
  
  document.getElementById("markdown-output").value = md;
  document.getElementById("export-modal").classList.add("active");
}

// Launch application
window.onload = init;
