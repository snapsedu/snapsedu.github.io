class QuestionPapersComponent extends HTMLElement {
  connectedCallback() {
      const papersData = JSON.parse(this.getAttribute('papers'));

      papersData.forEach(({ year, sittings }) => {
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
              Object.entries(sittings).forEach(([sitting, paperTypes]) => {
                  const sittingHeading = document.createElement('h3');
                  sittingHeading.textContent = sitting;
                  sectionDiv.appendChild(sittingHeading);

                  const sessionList = document.createElement('ul');
                  sessionList.classList.add('sessions');

                  // Loop through papers within a sitting
                  paperTypes[type].forEach((paper) => {
                      const listItem = document.createElement('li');
                      const link = document.createElement('a');
                      link.href = `../../QP/OL/math_b/${sitting}_${year}_${type === "qp" ? "QP" : "MS"}_${paper}.pdf`;
                      link.textContent = `Paper ${paper}`;
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

// Injecting the component and passing the data
document.getElementById('links-container').innerHTML = `
  <question-papers-component papers='${JSON.stringify(papers)}'></question-papers-component>
`;