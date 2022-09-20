"use strict";

window.addEventListener("DOMContentLoaded", async () => {
    // Fetch the info about the org
    const org_response = await fetch(
        "https://api.github.com/users/thedustyard/repos?sort=pushed"
    );

    if (!org_response.ok) {
        console.error(
            `Error fetching repositories: ${response.status}, ${response.statusText}`
        );
        return;
    }

    // Fetch language information
    const lang_response = await fetch(
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
    const repos = await org_response.json();

    /**
     * @type {{
     *    [x: string]: {
     *       color: string,
     *       url: string
     *    }
     * }}
     */
    const langs = await lang_response.json();

    // Get the wrapper element to put the repos into
    const wrapper_element = document.getElementById("repositories");

    /**
     * @type {HTMLTemplateElement}
     */
    const template = document.querySelector("#repositories template");

    // loop through the repos
    for (const repo of repos) {
        // Get the repo language color
        const repo_language_color =
            (repo.language === undefined
                ? undefined
                : langs[repo.language]?.color) || "#808080";

        // The div.repo element
        /** @type {HTMLDivElement} */
        const element = template.content.firstElementChild.cloneNode(true);
        element.style.borderColor = repo_language_color;

        // Set the title
        /** @type {HTMLAnchorElement} */
        const title = element.querySelector("a.title");
        title.href = repo.html_url;
        title.innerText = repo.name;

        // Set the description
        /** @type {HTMLDivElement} */
        const description = element.querySelector("div.description");
        description.innerText = repo.description;

        // Set the pushed date
        /** @type {HTMLSpanElement} */
        const pushed = element.querySelector("div.pushed.at");
        pushed.innerText = dayjs(repo.pushed_at).format("MMMM D, YYYY");

        // Set the created date
        /** @type {HTMLSpanElement} */
        const created = element.querySelector("div.created.at");
        created.innerText = dayjs(repo.created_at).format("MMMM D, YYYY");

        // Set the language
        /** @type {HTMLDivElement} */
        const language = element.querySelector("div.language.label");
        language.innerText = repo.language || "None";
        language.style.backgroundColor = repo_language_color;

        // Add the repo element to the wrapper
        wrapper_element.appendChild(element);
    }
});
