"use strict";

window.addEventListener("DOMContentLoaded", async () => {
    // Fetch the info about the org
    let org_response = await fetch(
        "https://api.github.com/users/thedustyard/repos?sort=pushed"
    );

    if (!org_response.ok) {
        console.error(
            `Error fetching repositories: ${response.status}, ${response.statusText}`
        );
        return;
    }

    // Fetch language information
    let lang_response = await fetch(
        "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
    );

    if (!lang_response.ok) {
        console.error(
            `Error fetching languages: ${response.status}, ${response.statusText}`
        );
        return;
    }

    /**
     * @type {{
     *    name: string,
     *    html_url: string,
     *    description: string,
     *    language: string | undefined,
     *    created_at: string,
     *    updated_at: string
     * }[]}
     */
    let repos = await org_response.json();

    /**
     * @type {{
     *    [x: string]: {
     *       color: string,
     *       url: string
     *    }
     * }}
     */
    let langs = await lang_response.json();

    // Get the wrapper element to put the repos into
    let wrapper_element = document.getElementById("repositories");

    // loop through the repos
    for (let repo of repos) {
        // Get the repo language color
        let repo_language_color =
            (repo.language === undefined
                ? undefined
                : langs[repo.language]?.color) || "#808080";

        // Create the outer element
        let element = document.createElement("div");
        element.className = "repo";
        element.style.borderColor = repo_language_color;

        // Create the title element
        let title = document.createElement("a");
        title.className = "title";
        title.href = repo.html_url;
        title.innerText = repo.name;
        element.appendChild(title);

        // Create the description element
        let description = document.createElement("div");
        description.className = "description";
        description.innerText = repo.description;
        element.appendChild(description);

        // Create the pushed element
        let pushed = document.createElement("div");
        pushed.className = "pushed";
        let pushed_at = dayjs(repo.pushed_at).format("MMMM D, YYYY");
        pushed.innerText = `Last pushed on ${pushed_at}`;
        element.appendChild(pushed);

        // Create the created element
        let created = document.createElement("div");
        created.className = "created";
        let created_at = dayjs(repo.created_at).format("MMMM D, YYYY");
        created.innerText = `Created on ${created_at}`;
        element.appendChild(created);

        // Create the language element
        let language = document.createElement("div");
        language.className = "language";
        element.appendChild(language);

        let language_text = document.createElement("div");
        language_text.className = "label";
        language_text.innerText = repo.language || "None";
        language_text.style.color = repo_language_color;
        language.appendChild(language_text);

        // Add the repo element to the wrapper
        wrapper_element.appendChild(element);
    }
});
