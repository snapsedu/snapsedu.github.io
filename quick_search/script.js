const data = [
    { subject: "math", year: 2022, session: "May" },
    { subject: "english", year: 2020, session: "Jan" },
    { subject: "math", year: 2021, session: "Jan" },
    { subject: "english", year: 2022, session: "May" },
];

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    attachEventListeners();
    filterResults(); // Display all results initially
});

function populateDropdowns() {
    const uniqueValues = (key) => [...new Set(data.map(item => item[key].toString().toLowerCase()))];
    populateDropdown('subject', uniqueValues('subject'));
    populateDropdown('year', uniqueValues('year'));
    populateDropdown('session', uniqueValues('session'));
}

function populateDropdown(id, values) {
    const select = document.getElementById(id);
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = capitalize(value);
        select.appendChild(option);
    });
}

function attachEventListeners() {
    document.getElementById('subject').addEventListener('change', filterResults);
    document.getElementById('year').addEventListener('change', filterResults);
    document.getElementById('session').addEventListener('change', filterResults);
}

function filterResults() {
    const subject = document.getElementById('subject').value.toLowerCase();
    const year = document.getElementById('year').value;
    const session = document.getElementById('session').value.toLowerCase();

    const filteredData = data.filter(({subject: s, year: y, session: se}) =>
        (!subject || s.toLowerCase() === subject) &&
        (!year || y == year) &&
        (!session || se.toLowerCase() === session)
    );

    displayResults(filteredData);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = results.length ? 
        results.map(({subject, year, session}) => 
            `<div class="result-item">Subject: ${capitalize(subject)}, Year: ${year}, Session: ${capitalize(session)}</div>`
        ).join('') : 
        'No results found 🗿';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
