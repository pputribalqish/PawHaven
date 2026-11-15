// =====================================================
// PAW HAVEN - ANIMAL SHELTER MANAGEMENT SYSTEM
// MAIN JAVASCRIPT
// =====================================================


// =====================================================
// 1. DEFAULT DATA
// =====================================================

const DEFAULT_ADMIN = {
    name: "Paw Haven Admin",
    email: "admin@pawhaven.com",
    username: "admin",
    password: "pawhaven123",
    role: "admin"
};

const DEFAULT_ANIMALS = [
    {
        id: 1,
        name: "Milo",
        type: "Cat",
        breed: "Persian",
        age: "2 years",
        gender: "Male",
        status: "Available"
    },
    {
        id: 2,
        name: "Luna",
        type: "Cat",
        breed: "Domestic Shorthair",
        age: "1 year",
        gender: "Female",
        status: "Available"
    },
    {
        id: 3,
        name: "Buddy",
        type: "Dog",
        breed: "Golden Retriever",
        age: "3 years",
        gender: "Male",
        status: "Adopted"
    },
    {
        id: 4,
        name: "Coco",
        type: "Dog",
        breed: "Poodle",
        age: "8 months",
        gender: "Female",
        status: "Under Care"
    },
    {
        id: 5,
        name: "Oreo",
        type: "Rabbit",
        breed: "Mini Lop",
        age: "1 year",
        gender: "Male",
        status: "Available"
    }
];

const DEFAULT_APPLICATIONS = [
    {
        id: 1,
        applicant: "Sarah Tan",
        animal: "Milo",
        email: "sarah@gmail.com",
        date: "2026-10-20",
        status: "Pending"
    },
    {
        id: 2,
        applicant: "Adam Lee",
        animal: "Buddy",
        email: "adam@gmail.com",
        date: "2026-10-22",
        status: "Approved"
    },
    {
        id: 3,
        applicant: "Aina Rahman",
        animal: "Luna",
        email: "aina@gmail.com",
        date: "2026-10-25",
        status: "Pending"
    },
    {
        id: 4,
        applicant: "Daniel Wong",
        animal: "Coco",
        email: "daniel@gmail.com",
        date: "2026-10-28",
        status: "Declined"
    }
];


// =====================================================
// 2. LOCAL STORAGE FUNCTIONS
// =====================================================

function getStorageData(key, defaultValue) {
    try {
        const savedData = localStorage.getItem(key);

        if (savedData === null) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }

        return JSON.parse(savedData);
    } catch (error) {
        console.error("Storage error:", error);
        return defaultValue;
    }
}

function saveStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Unable to save data:", error);
        return false;
    }
}

function getAnimals() {
    const animals = getStorageData("pawhaven_animals", DEFAULT_ANIMALS);
    return Array.isArray(animals) ? animals : DEFAULT_ANIMALS;
}

function saveAnimals(animals) {
    return saveStorageData("pawhaven_animals", animals);
}

function getApplications() {
    const applications = getStorageData(
        "pawhaven_applications",
        DEFAULT_APPLICATIONS
    );

    return Array.isArray(applications)
        ? applications
        : DEFAULT_APPLICATIONS;
}

function saveApplications(applications) {
    return saveStorageData("pawhaven_applications", applications);
}

function getUsers() {
    const users = getStorageData("pawhaven_users", []);
    return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
    return saveStorageData("pawhaven_users", users);
}


// =====================================================
// 3. GENERAL HELPER FUNCTIONS
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function showMessage(elementId, message, type = "danger") {
    const element = getElement(elementId);

    if (!element) return;

    element.textContent = message;
    element.className = "form-feedback alert alert-" + type;
    element.style.display = "block";
}

function hideMessage(elementId) {
    const element = getElement(elementId);

    if (!element) return;

    element.textContent = "";
    element.style.display = "none";
}

function getCurrentUser() {
    try {
        const savedUser = localStorage.getItem("pawhaven_current_user");

        if (!savedUser) return null;

        return JSON.parse(savedUser);
    } catch (error) {
        console.error("Current user error:", error);
        return null;
    }
}

function formatDate(date) {
    if (!date) return "-";

    const formattedDate = new Date(date + "T00:00:00");

    if (isNaN(formattedDate.getTime())) {
        return date;
    }

    return formattedDate.toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getStatusClass(status) {
    const statusClasses = {
        "Available": "status-available",
        "Adopted": "status-adopted",
        "Under Care": "status-care",
        "Pending": "status-pending",
        "Approved": "status-approved",
        "Declined": "status-declined"
    };

    return statusClasses[status] || "";
}

function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}


// =====================================================
// 4. LOGIN
// =====================================================

function handleLogin(event) {
    event.preventDefault();

    hideMessage("loginMessage");

    const usernameInput = getElement("username");
    const passwordInput = getElement("password");

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showMessage(
            "loginMessage",
            "Please enter your username and password."
        );
        return;
    }

    let loggedInUser = null;

    if (
        username === DEFAULT_ADMIN.username &&
        password === DEFAULT_ADMIN.password
    ) {
        loggedInUser = DEFAULT_ADMIN;
    } else {
        loggedInUser = getUsers().find(function (user) {
            return (
                user.username.toLowerCase() === username.toLowerCase() &&
                user.password === password
            );
        });
    }

    if (!loggedInUser) {
        showMessage(
            "loginMessage",
            "Incorrect username or password. Please try again."
        );
        return;
    }

    const currentUser = {
        name: loggedInUser.name,
        email: loggedInUser.email,
        username: loggedInUser.username,
        role: loggedInUser.role || "user"
    };

    if (saveStorageData("pawhaven_current_user", currentUser)) {
        window.location.href = "dashboard.html";
    } else {
        showMessage(
            "loginMessage",
            "Unable to save your login session. Please try again."
        );
    }
}


// =====================================================
// 5. REGISTRATION
// =====================================================

function handleRegistration(event) {
    event.preventDefault();

    hideMessage("registerMessage");

    const fullName = getElement("fullName")?.value.trim();
    const email = getElement("email")?.value.trim();
    const username = getElement("username")?.value.trim();
    const password = getElement("password")?.value;
    const confirmPassword = getElement("confirmPassword")?.value;

    if (!fullName || !email || !username || !password || !confirmPassword) {
        showMessage(
            "registerMessage",
            "Please complete all required fields."
        );
        return;
    }

    // Check a terms checkbox if the registration page has one.
    const termsCheckbox =
        getElement("terms") ||
        getElement("agreeTerms") ||
        getElement("termsCheckbox");

    if (termsCheckbox && !termsCheckbox.checked) {
        showMessage(
            "registerMessage",
            "Please agree to the terms and conditions."
        );
        return;
    }

    if (password.length < 6) {
        showMessage(
            "registerMessage",
            "Password must contain at least 6 characters."
        );
        return;
    }

    if (password !== confirmPassword) {
        showMessage(
            "registerMessage",
            "Passwords do not match."
        );
        return;
    }

    const users = getUsers();

    const existingUser = users.find(function (user) {
        return (
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );
    });

    if (
        username.toLowerCase() === "admin" ||
        email.toLowerCase() === "admin@pawhaven.com" ||
        existingUser
    ) {
        showMessage(
            "registerMessage",
            "This username or email is already registered."
        );
        return;
    }

    users.push({
        id: Date.now(),
        name: fullName,
        email: email,
        username: username,
        password: password,
        role: "user"
    });

    if (!saveUsers(users)) {
        showMessage(
            "registerMessage",
            "Registration failed. Please try again."
        );
        return;
    }

    showMessage(
        "registerMessage",
        "Registration successful! Redirecting to login...",
        "success"
    );

    setTimeout(function () {
        window.location.href = "login.html";
    }, 1500);
}


// =====================================================
// 6. LOGOUT AND SESSION PROTECTION
// =====================================================

function handleLogout(event) {
    if (event) event.preventDefault();

    localStorage.removeItem("pawhaven_current_user");
    window.location.replace("index.html");
}

function checkLoginSession() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const protectedPages = [
        "dashboard.html",
        "animals.html",
        "applications.html",
        "about.html"
    ];

    const currentUser = getCurrentUser();

    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.replace("login.html");
        return;
    }

    if (
        (currentPage === "login.html" ||
         currentPage === "registration.html") &&
        currentUser
    ) {
        window.location.replace("dashboard.html");
    }
}


// =====================================================
// 7. USER PROFILE
// =====================================================

function displayUserProfile() {
    const user = getCurrentUser();

    if (!user) return;

    setText("adminName", user.name);
    setText("adminTopbarName", user.name);

    const avatar = getElement("adminAvatar");

    if (avatar) {
        const initials = user.name
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

        avatar.textContent = initials;
    }
}


// =====================================================
// 8. STATISTICS
// =====================================================

function updateDashboardStats() {
    const animals = getAnimals();
    const applications = getApplications();

    setText("totalAnimals", animals.length);

    setText(
        "availableAnimals",
        animals.filter(animal => animal.status === "Available").length
    );

    setText(
        "adoptedAnimals",
        animals.filter(animal => animal.status === "Adopted").length
    );

    setText(
        "pendingApplications",
        applications.filter(app => app.status === "Pending").length
    );

    setText(
        "sidePending",
        applications.filter(app => app.status === "Pending").length
    );
}

function updateAnimalPageStats() {
    const animals = getAnimals();

    setText("animalTotalCount", animals.length);

    setText(
        "animalAvailableCount",
        animals.filter(animal => animal.status === "Available").length
    );

    setText(
        "animalAdoptedCount",
        animals.filter(animal => animal.status === "Adopted").length
    );

    setText(
        "animalCareCount",
        animals.filter(animal => animal.status === "Under Care").length
    );
}

function updateApplicationStats() {
    const applications = getApplications();

    const pending = applications.filter(
        app => app.status === "Pending"
    ).length;

    const approved = applications.filter(
        app => app.status === "Approved"
    ).length;

    const declined = applications.filter(
        app => app.status === "Declined"
    ).length;

    setText("totalApplicationCount", applications.length);
    setText("pendingApplicationCount", pending);
    setText("approvedApplicationCount", approved);
    setText("declinedApplicationCount", declined);

    setText("sidePending", pending);
    setText("sideApproved", approved);
    setText("sideDeclined", declined);
}

function refreshAllStatistics() {
    updateDashboardStats();
    updateAnimalPageStats();
    updateApplicationStats();
}


// =====================================================
// 9. DASHBOARD RECENT ANIMALS
// =====================================================

function displayRecentAnimals() {
    const tableBody = getElement("recentAnimalsTable");

    if (!tableBody) return;

    const recentAnimals = getAnimals().slice(-5).reverse();

    if (recentAnimals.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No animal records available.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = recentAnimals.map(animal => `
        <tr>
            <td>${escapeHTML(animal.name)}</td>
            <td>${escapeHTML(animal.type)}</td>
            <td>${escapeHTML(animal.breed)}</td>
            <td>${escapeHTML(animal.age)}</td>
            <td>
                <span class="status-badge ${getStatusClass(animal.status)}">
                    ${escapeHTML(animal.status)}
                </span>
            </td>
        </tr>
    `).join("");
}


// =====================================================
// 10. DASHBOARD CHARTS
// Lecturer requirements:
// 1. Animals by species
// 2. Adoption applications per month
// =====================================================

function createDashboardCharts() {
    if (typeof ApexCharts === "undefined") {
        console.warn("ApexCharts is not loaded.");
        return;
    }

createMalaysiaAdoptionChart();

    const animals = getAnimals();
    const applications = getApplications();



    // ANIMALS BY SPECIES - DONUT CHART
    const speciesChartElement = getElement("statusChart");

    if (speciesChartElement) {
        const speciesCounts = {};

        animals.forEach(animal => {
            const species = animal.type || "Other";
            speciesCounts[species] = (speciesCounts[species] || 0) + 1;

createMalaysiaAdoptionChart();
            
        });

        const speciesLabels = Object.keys(speciesCounts);
        const speciesValues = Object.values(speciesCounts);

        if (speciesChartElement._apexChart) {
            speciesChartElement._apexChart.destroy();
        }

        speciesChartElement.innerHTML = "";

        speciesChartElement._apexChart = new ApexCharts(
            speciesChartElement,
            {
                chart: {
                    type: "donut",
                    height: 280
                },
                series: speciesValues,
                labels: speciesLabels,
                colors: ["#71836b", "#e8b99e", "#b8a9cc", "#d6c6a8"],
                legend: {
                    position: "bottom"
                },
                dataLabels: {
                    enabled: true
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "65%"
                        }
                    }
                }
            }
        );

        speciesChartElement._apexChart.render();
    }

    // APPROVED ADOPTION APPLICATIONS PER MONTH - AREA CHART
    const adoptionChartElement = getElement("adoptionChart");

    if (adoptionChartElement) {
        const year = new Date().getFullYear();

        const monthLabels = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyAdoptions = Array(12).fill(0);

        applications.forEach(application => {
            if (application.status !== "Approved" || !application.date) {
                return;
            }

            const date = new Date(application.date + "T00:00:00");

            if (!isNaN(date.getTime()) && date.getFullYear() === year) {
                monthlyAdoptions[date.getMonth()]++;
            }
        });

        if (adoptionChartElement._apexChart) {
            adoptionChartElement._apexChart.destroy();
        }

        adoptionChartElement.innerHTML = "";

        adoptionChartElement._apexChart = new ApexCharts(
            adoptionChartElement,
            {
                chart: {
                    type: "area",
                    height: 280,
                    toolbar: {
                        show: false
                    }
                },
                series: [{
                    name: "Approved Adoptions",
                    data: monthlyAdoptions
                }],
                xaxis: {
                    categories: monthLabels
                },
                colors: ["#71836b"],
                stroke: {
                    curve: "smooth",
                    width: 3
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        opacityFrom: 0.4,
                        opacityTo: 0.05
                    }
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    borderColor: "#e9e6de"
                },
                yaxis: {
                    min: 0,
                    forceNiceScale: true
                },
                legend: {
                    show: false
                }
            }
        );

        adoptionChartElement._apexChart.render();
    }
}


// =====================================================
// 11. ANIMAL MANAGEMENT
// =====================================================

function renderAnimalRows(animals) {
    const tableBody = getElement("animalsTable");

    if (!tableBody) return;

    if (animals.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No animal records found.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = animals.map(animal => `
        <tr>
            <td>${escapeHTML(animal.name)}</td>
            <td>${escapeHTML(animal.type)}</td>
            <td>${escapeHTML(animal.breed)}</td>
            <td>${escapeHTML(animal.age)}</td>
            <td>${escapeHTML(animal.gender)}</td>
            <td>
                <span class="status-badge ${getStatusClass(animal.status)}">
                    ${escapeHTML(animal.status)}
                </span>
            </td>
            <td>
                <button
                    class="btn btn-sm btn-outline-danger"
                    type="button"
                    onclick="deleteAnimal(${Number(animal.id)})"
                    aria-label="Delete ${escapeHTML(animal.name)}"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function displayAnimals() {
    renderAnimalRows(getAnimals());
}

function addAnimal(event) {
    event.preventDefault();

    const name = getElement("animalName")?.value.trim();
    const type = getElement("animalType")?.value;
    const breed = getElement("animalBreed")?.value.trim();
    const age = getElement("animalAge")?.value.trim();
    const gender = getElement("animalGender")?.value;
    const status = getElement("animalStatus")?.value;

    if (!name || !type || !breed || !age || !gender || !status) {
        alert("Please complete all animal details.");
        return;
    }

    const animals = getAnimals();

    animals.push({
        id: Date.now(),
        name,
        type,
        breed,
        age,
        gender,
        status
    });

    if (!saveAnimals(animals)) {
        alert("Unable to save animal record.");
        return;
    }

    const form = getElement("animalForm");

    if (form) form.reset();

    closeAnimalModal();

    displayAnimals();
    displayRecentAnimals();
    refreshAllStatistics();
    createDashboardCharts();

    alert("Animal record added successfully!");
}

function deleteAnimal(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this animal record?"
    );

    if (!confirmDelete) return;

    const animals = getAnimals().filter(
        animal => Number(animal.id) !== Number(id)
    );

    saveAnimals(animals);

    displayAnimals();
    displayRecentAnimals();
    refreshAllStatistics();
    createDashboardCharts();

    alert("Animal record deleted successfully!");
}

function openAnimalModal() {
    const modal = getElement("addAnimalModal");

    if (modal) {
        modal.classList.add("show");
    }
}

function closeAnimalModal() {
    const modal = getElement("addAnimalModal");

    if (modal) {
        modal.classList.remove("show");
    }
}

function setupAnimalSearch() {
    const searchInput = getElement("animalSearch");
    const filterInput = getElement("animalFilter");

    if (!searchInput && !filterInput) return;

    function filterAnimals() {
        const searchValue = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const filterValue = filterInput
            ? filterInput.value
            : "";

        const filteredAnimals = getAnimals().filter(animal => {
            const name = String(animal.name || "").toLowerCase();
            const type = String(animal.type || "").toLowerCase();
            const breed = String(animal.breed || "").toLowerCase();

            const matchesSearch =
                name.includes(searchValue) ||
                type.includes(searchValue) ||
                breed.includes(searchValue);

            const matchesStatus =
                filterValue === "" || animal.status === filterValue;

            return matchesSearch && matchesStatus;
        });

        renderAnimalRows(filteredAnimals);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterAnimals);
    }

    if (filterInput) {
        filterInput.addEventListener("change", filterAnimals);
    }
}


// =====================================================
// 12. APPLICATION MANAGEMENT
// =====================================================

function renderApplicationRows(applications) {
    const tableBody = getElement("applicationsTable");

    if (!tableBody) return;

    if (applications.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No adoption applications found.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = applications.map((application, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHTML(application.applicant)}</td>
            <td>${escapeHTML(application.animal)}</td>
            <td>${escapeHTML(application.email)}</td>
            <td>${formatDate(application.date)}</td>
            <td>
                <span class="status-badge ${getStatusClass(application.status)}">
                    ${escapeHTML(application.status)}
                </span>
            </td>
            <td>
                <select
                    class="form-select form-select-sm status-select"
                    aria-label="Update application status"
                    onchange="updateApplicationStatus(${Number(application.id)}, this.value)"
                >
                    <option value="Pending" ${application.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>
                    <option value="Approved" ${application.status === "Approved" ? "selected" : ""}>
                        Approved
                    </option>
                    <option value="Declined" ${application.status === "Declined" ? "selected" : ""}>
                        Declined
                    </option>
                </select>
            </td>
        </tr>
    `).join("");
}

function displayApplications() {
    renderApplicationRows(getApplications());
}

function updateApplicationStatus(id, newStatus) {
    const validStatuses = ["Pending", "Approved", "Declined"];

    if (!validStatuses.includes(newStatus)) return;

    const applications = getApplications();

    const applicationIndex = applications.findIndex(
        application => Number(application.id) === Number(id)
    );

    if (applicationIndex === -1) return;

    applications[applicationIndex].status = newStatus;

    if (!saveApplications(applications)) {
        alert("Unable to update application status.");
        return;
    }

    // Update the animal record based on all applications for that animal.
    const selectedApplication = applications[applicationIndex];
    const animals = getAnimals();

    const relatedAnimal = animals.find(
        animal => animal.name === selectedApplication.animal
    );

    if (relatedAnimal) {
        const hasApprovedApplication = applications.some(application =>
            application.animal === selectedApplication.animal &&
            application.status === "Approved"
        );

        if (hasApprovedApplication) {
            relatedAnimal.status = "Adopted";
        } else if (relatedAnimal.status === "Adopted") {
            relatedAnimal.status = "Available";
        }

        saveAnimals(animals);
    }

    displayApplications();
    displayAnimals();
    displayRecentAnimals();

    refreshAllStatistics();
    createDashboardCharts();
    createMalaysiaAdoptionChart();

    alert("Application status updated successfully!");
}

function setupApplicationSearch() {
    const searchInput = getElement("applicationSearch");
    const filterInput = getElement("applicationFilter");

    if (!searchInput && !filterInput) return;

    function filterApplications() {
        const searchValue = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const filterValue = filterInput
            ? filterInput.value
            : "";

        const filteredApplications = getApplications().filter(application => {
            const applicant = String(application.applicant || "").toLowerCase();
            const animal = String(application.animal || "").toLowerCase();
            const email = String(application.email || "").toLowerCase();

            const matchesSearch =
                applicant.includes(searchValue) ||
                animal.includes(searchValue) ||
                email.includes(searchValue);

            const matchesStatus =
                filterValue === "" || application.status === filterValue;

            return matchesSearch && matchesStatus;
        });

        renderApplicationRows(filteredApplications);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterApplications);
    }

    if (filterInput) {
        filterInput.addEventListener("change", filterApplications);
    }
}


// =====================================================
// 13. MOBILE MENU AND SIDEBAR
// =====================================================

function setupMobileMenu() {
    const menuButton =
        getElement("menuToggle") ||
        getElement("mobileMenuBtn");

    const sidebar = document.querySelector(".ph-sidebar") ||
                document.querySelector(".sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        sidebar.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (
            !sidebar.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            sidebar.classList.remove("active");
        }
    });
}

function setActiveSidebarLink() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".side-nav a, .ph-navigation a").forEach(link => {
    link.classList.toggle(
        "active",
        link.getAttribute("href") === currentPage
    );
});
}


// =====================================================
// 14. PAGE INITIALISATION
// =====================================================

function initialiseLoginPage() {
    const loginForm = getElement("loginForm");

    if (loginForm) {
        loginForm.onsubmit = handleLogin;
    }
}

function initialiseRegistrationPage() {
    const registrationForm =
        getElement("registrationForm") ||
        getElement("registerForm");

    if (registrationForm) {
        registrationForm.onsubmit = handleRegistration;
    }
}

function initialiseDashboardPage() {
    if (!getElement("totalAnimals")) return;

    updateDashboardStats();
    displayRecentAnimals();
    createDashboardCharts();
}

function initialiseAnimalsPage() {
    if (!getElement("animalsTable")) return;

    displayAnimals();
    updateAnimalPageStats();
    setupAnimalSearch();

    const animalForm = getElement("animalForm");

    if (animalForm) {
        // Assigning onsubmit replaces any inline onsubmit handler,
        // preventing the form from adding the same animal twice.
        animalForm.onsubmit = addAnimal;
    }
}

function initialiseApplicationsPage() {
    if (!getElement("applicationsTable")) return;

    displayApplications();
    updateApplicationStats();
    setupApplicationSearch();
}

function initialiseAboutPage() {
    // About Us content is provided directly in about.html.
}


// =====================================================
// 15. MAIN INITIALISATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // Check whether the current user is allowed to view this page.
    checkLoginSession();

    // Display the signed-in user's information.
    displayUserProfile();

    // Set the current year in the footer.
    setText("currentYear", new Date().getFullYear());

    // Connect all logout links.
    const logoutLink = getElement("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", handleLogout);
    }

    // Initialise the current page.
    initialiseLoginPage();
    initialiseRegistrationPage();
    initialiseDashboardPage();
    initialiseAnimalsPage();
    initialiseApplicationsPage();
    initialiseAboutPage();

    // Navigation functions.
    setupMobileMenu();
    setActiveSidebarLink();

    // Keep page statistics synchronised.
    refreshAllStatistics();
});


function createMalaysiaAdoptionChart() {

    const element = document.getElementById("malaysiaAdoptionChart");

    if (!element) return;

    // Prevent duplicate charts
    if (element._apexChart) {
        element._apexChart.destroy();
    }

    element.innerHTML = "";

    const options = {

        series: [{
            name: "Animals Adopted",
            data: [10, 57, 12, 108]
        }],

        chart: {
            type: "bar",
            height: 320,
            toolbar: {
                show: false
            },
            fontFamily: "DM Sans, sans-serif"
        },

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "45%",
                borderRadius: 7,
                distributed: true
            }
        },

        colors: [
            "#71836b",
            "#e8b99e",
            "#b8a9cc",
            "#d8c9a7"
        ],

        dataLabels: {
            enabled: true,
            style: {
                fontSize: "12px",
                colors: ["#ffffff"]
            }
        },

        xaxis: {
            categories: [
                "Dogs",
                "Puppies",
                "Cats",
                "Kittens"
            ],
            labels: {
                style: {
                    colors: "#52616b",
                    fontSize: "12px"
                }
            }
        },

        yaxis: {
            title: {
                text: "Number of Animals Adopted"
            },
            min: 0,
            max: 120,
            tickAmount: 4
        },

        grid: {
            borderColor: "#eee9e1",
            strokeDashArray: 4
        },

        legend: {
            show: false
        },

        tooltip: {
            y: {
                formatter: function(value) {
                    return value + " animals adopted";
                }
            }
        },

        responsive: [{
            breakpoint: 600,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: "60%"
                    }
                }
            }
        }]
    };

    element._apexChart = new ApexCharts(element, options);

    element._apexChart.render();
}


function createMalaysiaAdoptionChart() {

    const chartElement = document.getElementById(
        "malaysiaAdoptionChart"
    );

    if (!chartElement) return;

    if (typeof ApexCharts === "undefined") {
        console.error("ApexCharts is not loaded.");
        return;
    }

    if (chartElement._apexChart) {
        chartElement._apexChart.destroy();
    }

    const options = {

        series: [{
            name: "Animals Adopted",
            data: [235, 187, 153]
        }],

        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false
            },
            fontFamily: "DM Sans, sans-serif"
        },

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "35%",
                borderRadius: 7
            }
        },

        colors: ["#71836b"],

        dataLabels: {
            enabled: true,
            style: {
                colors: ["#71836b"]
            }
        },

        xaxis: {
            categories: ["2023", "2024", "2025"]
        },

        yaxis: {
            min: 0,
            max: 250,
            tickAmount: 5,
            title: {
                text: "Number of animals adopted"
            }
        },

        grid: {
            borderColor: "#eee9e1",
            strokeDashArray: 4
        },

        legend: {
            show: false
        },

        tooltip: {
            y: {
                formatter: function(value) {
                    return value + " animals adopted";
                }
            }
        }
    };

    chartElement._apexChart = new ApexCharts(
        chartElement,
        options
    );

    chartElement._apexChart.render();
}


