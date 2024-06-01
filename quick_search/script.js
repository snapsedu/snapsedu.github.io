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

    // Fetch data from the URL once
    fetch('https://api.github.com/repos/NazSnippets/NazSnippets.github.io/contents/test')
        .then(response => response.json())
        .then(responseData => {
            // Extract filenames from the data
            data = responseData.map(file => file.name);

            // Extract unique values for each dropdown
            data.forEach(filename => {
                const [year, subject, unit, sessionWithExtension] = filename.split('_');
                const session = sessionWithExtension.replace('.pdf', '');

                allSubjects.add(subject);
                allYears.add(year);
                allSessions.add(session);
                allUnits.add(unit);
            });

            // Populate dropdowns with extracted values
            populateDropdown(subjectDropdown, allSubjects);
            populateDropdown(yearDropdown, allYears);
            populateDropdown(sessionDropdown, allSessions);
            populateDropdown(unitDropdown, ['ALL', ...allUnits]); // Add 'ALL' option

            // Show all results initially
            displayResults(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Populate dropdown with options
    function populateDropdown(dropdown, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });
    }

    // Add event listener to subject dropdown to handle unit selection and update results
    subjectDropdown.addEventListener('change', function() {
        updateUnitDropdown();
        filterAndDisplayResults();
    });

    // Function to update unit dropdown based on selected subject
    function updateUnitDropdown() {
        const selectedSubject = subjectDropdown.value;
        unitDropdown.innerHTML = ''; // Clear existing options

        if (selectedSubject === 'Math') {
            // Populate with special units for Math
            const specialUnits = ['M1', 'P1', 'P2', 'S1', 'S2'];
            populateDropdown(unitDropdown, ['ALL', ...specialUnits]); // Add 'ALL' option
        } else {
            // Populate with normal units
            populateDropdown(unitDropdown, ['ALL', ...allUnits]); // Add 'ALL' option
        }
    }

    // Add event listeners to update results based on selections
    yearDropdown.addEventListener('change', filterAndDisplayResults);
    sessionDropdown.addEventListener('change', filterAndDisplayResults);
    unitDropdown.addEventListener('change', filterAndDisplayResults);

    // Filter and display results based on selected values
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
                   (selectedUnit === "ALL" || selectedUnit === "" || selectedUnit === unit);
        });

        if (filteredData.length === 0) {
            // Display message when no results are found
            resultsDiv.innerHTML = '<p>No results found with the selected options.</p>';
        } else {
            displayResults(filteredData);
        }
    }

    // Display results in the results div
    function displayResults(filenames) {
        resultsDiv.innerHTML = ''; // Clear previous results
        filenames.forEach(filename => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');
            resultDiv.textContent = filename;
            resultDiv.addEventListener('click', function() {
                // Redirect when a result is clicked
                window.location.href = '#'; // Change '#' to your desired URL
            });
            resultsDiv.appendChild(resultDiv);
        });
    }
});
