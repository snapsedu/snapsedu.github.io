const urlParams = new URLSearchParams(window.location.search);
const fileLevel = urlParams.get('level');
document.addEventListener('DOMContentLoaded', function () {
    const subjectDropdown = document.getElementById('subjectDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const sessionDropdown = document.getElementById('sessionDropdown');
    const unitDropdown = document.getElementById('unitDropdown');
    const resultsDiv = document.querySelector('.results');

    let data = [];
    let allSubjects = new Set();
    let allYears = new Set();
    let allSessions = new Set();
    let allUnits = new Set();

    if (fileLevel == "OL") {
        document.getElementById('unitlabel').innerText = "Paper: "
    }

    fetch(`http://127.0.0.1:5500/api/${fileLevel}.json`)
        .then(response => response.json())
        .then(responseData => {
            data = responseData.map(file => file.name);

            data.forEach(filename => {
                const [year, subject, unit, sessionWithExtension] = filename.split('_');
                const session = sessionWithExtension.replace('.pdf', '');

                allSubjects.add(subject);
                allYears.add(year);
                allSessions.add(session);
                allUnits.add(unit);
            });

            populateDropdown(subjectDropdown, allSubjects);
            populateDropdown(yearDropdown, [...allYears].sort((a, b) => a - b));
            populateDropdown(sessionDropdown, allSessions);
            populateDropdown(unitDropdown, ['All', ...allUnits]);

            displayResults(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function populateDropdown(dropdown, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });
    }

    subjectDropdown.addEventListener('change', function () {
        updateUnitDropdown();
        filterAndDisplayResults();
    });

    function updateUnitDropdown() {
        const selectedSubject = subjectDropdown.value;
        unitDropdown.innerHTML = '';

        if (selectedSubject === 'Math') {
            const filteredUnits = Array.from(allUnits).filter(unit => !unit.startsWith('U'));
            populateDropdown(unitDropdown, ['All', ...filteredUnits]);
        } else if (selectedSubject !== "") {
            const filteredUnits = Array.from(allUnits).filter(unit => unit.startsWith('U'));
            populateDropdown(unitDropdown, ['All', ...filteredUnits]);
        } else {
            populateDropdown(unitDropdown, ['All', ...allUnits]);
        }
    }

    yearDropdown.addEventListener('change', filterAndDisplayResults);
    sessionDropdown.addEventListener('change', filterAndDisplayResults);
    unitDropdown.addEventListener('change', filterAndDisplayResults);

    function filterAndDisplayResults() {
        const selectedSubject = subjectDropdown.value;
        const selectedYear = yearDropdown.value;
        const selectedSession = sessionDropdown.value;
        const selectedUnit = unitDropdown.value;

        const filteredData = data.filter(filename => {
            const [year, subject, unit, sessionWithExtension] = filename.split('_');
            const session = sessionWithExtension.replace('.pdf', '');

            return (selectedSubject === "" || selectedSubject === subject) &&
                (selectedYear === "" || selectedYear === year) &&
                (selectedSession === "" || selectedSession === session) &&
                (selectedUnit === "All" || selectedUnit === "" || selectedUnit === unit);
        });

        if (filteredData.length === 0) {
            resultsDiv.innerHTML = '<p>No results found with the selected options.</p>';
        } else {
            displayResults(filteredData);
        }
    }

    function displayResults(filenames) {
        resultsDiv.innerHTML = '';
        filenames.forEach(filename => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');
            resultDiv.textContent = filename;

            resultDiv.addEventListener('click', function () {
                window.location.href = `https://snapsedu.github.io/reader/?file=${filename}`;
            });

            resultsDiv.appendChild(resultDiv);
        });
    }
});
