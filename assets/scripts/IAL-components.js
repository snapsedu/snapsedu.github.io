class QuestionPapersComponent extends HTMLElement {
    connectedCallback() {
        const { subject, board, papers } = examData;

        papers.forEach(({ year, sittings }) => {
            const yearContainer = document.createElement('div');
            yearContainer.classList.add('links', 'collapseable');

            // Collapsible header
            const collapsibleHeader = document.createElement('h1');
            collapsibleHeader.classList.add('collapsible-header');
            collapsibleHeader.textContent = year;
            yearContainer.appendChild(collapsibleHeader);

            // Container for papers and mark schemes
            const papersContainer = document.createElement('div');
            papersContainer.classList.add('papers');

            // Question Paper and Mark Scheme sections
            ["qp", "ms"].forEach((type) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.classList.add(type);

                // Section headings
                const sectionHeading = document.createElement('h2');
                sectionHeading.textContent = type === "qp" ? "Question Paper" : "Mark Scheme";
                sectionDiv.appendChild(sectionHeading);

                // Loop through each sitting
                sittings.forEach(({ month, [type]: paperList }) => {
                    const sittingHeading = document.createElement('h3');
                    sittingHeading.textContent = month;
                    sectionDiv.appendChild(sittingHeading);

                    const sessionList = document.createElement('ul');
                    sessionList.classList.add('sessions');

                    // Loop through papers within a sitting
                    paperList.forEach((paper) => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        console.log(month.toLowerCase())
                        link.href = `https://snapsedu.com/assets/files/${board}/IAL/${subject}/${year}/${month.toLowerCase()}_${type === "qp" ? "QP" : "MS"}_${paper}.pdf`;
                        link.textContent = `Unit ${paper}`;
                        listItem.appendChild(link);
                        sessionList.appendChild(listItem);
                    });

                    sectionDiv.appendChild(sessionList);
                });

                papersContainer.appendChild(sectionDiv);
            });

            yearContainer.appendChild(papersContainer);
            this.appendChild(yearContainer);

            // Add click event listener for the collapsible header
            collapsibleHeader.addEventListener('click', () => {
                const isExpanded = papersContainer.style.maxHeight;
                papersContainer.style.maxHeight = isExpanded ? null : papersContainer.scrollHeight + "px"; // Toggle max height
            });
        });
    }
}

// Define the custom element
customElements.define('question-papers-component', QuestionPapersComponent);

// Inject the component into the HTML and load the data
document.getElementById('links-container').innerHTML = `
  <question-papers-component></question-papers-component>
`;
