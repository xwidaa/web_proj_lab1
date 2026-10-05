// ==========================
// TREAPTA 3
// Skills din backend
// ==========================

const form =
    document.getElementById("skillForm");

const input =
    document.getElementById("skillInput");

const skillsList =
    document.getElementById("skillsList");

const message =
    document.getElementById("message");



async function loadSkills() {

    try {

        const response =
            await fetch("/api/skills");

        const skills =
            await response.json();

        skillsList.innerHTML = "";


        skills.forEach(
            function(skill) {

                const li =
                    document.createElement("li");


                const skillText =
                    document.createElement("span");

                skillText.textContent =
                    skill.name;


                const editButton =
                    document.createElement("button");

                editButton.textContent =
                    "Editeaza";

                editButton.style.marginLeft =
                    "10px";


                editButton.addEventListener(
                    "click",
                    function() {

                        editSkill(
                            skill.id,
                            skill.name
                        );

                    }
                );


                const deleteButton =
                    document.createElement("button");

                deleteButton.textContent =
                    "Sterge";

                deleteButton.style.marginLeft =
                    "5px";


                deleteButton.addEventListener(
                    "click",
                    function() {

                        deleteSkill(
                            skill.id
                        );

                    }
                );


                li.appendChild(
                    skillText
                );

                li.appendChild(
                    editButton
                );

                li.appendChild(
                    deleteButton
                );

                skillsList.appendChild(
                    li
                );

            }
        );

    }

    catch (error) {

        message.textContent =
            "Nu s-au putut incarca skill-urile.";

    }
}



// CREATE
form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const skill =
            input.value.trim();


        if (skill.length < 2) {

            message.textContent =
                "Skill-ul trebuie sa contina cel putin 2 caractere.";

            return;
        }


        try {

            const response =
                await fetch(
                    "/api/skills",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                name:
                                    skill
                            })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.error;

                return;
            }


            message.textContent =
                "Skill adaugat cu succes!";


            input.value = "";


            loadSkills();

        }

        catch (error) {

            message.textContent =
                "A aparut o eroare.";

        }

    }
);



// UPDATE
async function editSkill(
    id,
    oldName
) {

    const newName =
        prompt(
            "Modifica skill-ul:",
            oldName
        );


    if (newName === null) {
        return;
    }


    if (newName.trim().length < 2) {

        message.textContent =
            "Skill invalid.";

        return;
    }


    try {

        const response =
            await fetch(
                "/api/skills/" + id,
                {
                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            name:
                                newName.trim()
                        })
                }
            );


        if (!response.ok) {

            message.textContent =
                "Nu s-a putut modifica skill-ul.";

            return;
        }


        message.textContent =
            "Skill modificat.";


        loadSkills();

    }

    catch (error) {

        message.textContent =
            "A aparut o eroare.";

    }

}



// DELETE
async function deleteSkill(id) {

    try {

        const response =
            await fetch(
                "/api/skills/" + id,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            message.textContent =
                "Nu s-a putut sterge skill-ul.";

            return;
        }


        message.textContent =
            "Skill sters.";


        loadSkills();

    }

    catch (error) {

        message.textContent =
            "A aparut o eroare.";

    }

}



// incarcam skills la deschiderea paginii
loadSkills();



// ==========================
// TREAPTA 2
// Open Library API
// ==========================

const bookInput =
    document.getElementById("bookInput");

const searchButton =
    document.getElementById("searchButton");

const loading =
    document.getElementById("loading");

const bookError =
    document.getElementById("bookError");

const bookResults =
    document.getElementById("bookResults");



searchButton.addEventListener(
    "click",
    searchBooks
);


async function searchBooks() {

    const title =
        bookInput.value.trim();

    bookResults.innerHTML = "";

    bookError.textContent = "";


    if (title === "") {

        bookError.textContent =
            "Introdu un titlu.";

        return;
    }


    loading.textContent =
        "Se incarca...";


    try {

        const url =
            "https://openlibrary.org/search.json?title="
            + encodeURIComponent(title)
            + "&limit=5";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Eroare la API"
            );

        }


        const data =
            await response.json();


        if (data.docs.length === 0) {

            bookResults.textContent =
                "Nu s-au gasit carti.";

            return;
        }


        data.docs.forEach(
            function(book) {

                const div =
                    document.createElement("div");

                div.className =
                    "book";


                let author =
                    "Autor necunoscut";


                if (book.author_name) {

                    author =
                        book.author_name[0];

                }


                div.innerHTML =
                    "<strong>"
                    + book.title
                    + "</strong>"
                    + "<br>"
                    + author;


                bookResults.appendChild(
                    div
                );

            }
        );

    }

    catch (error) {

        bookError.textContent =
            "A aparut o eroare la cautarea cartii.";

    }

    finally {

        loading.textContent = "";

    }

}