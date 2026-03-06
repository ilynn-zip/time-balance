document.addEventListener('DOMContentLoaded', function() {
    const birthdateInput = document.getElementById('birthdate');
    const lifeExpectancyInput = document.getElementById('life-expectancy');

    const STORAGE_BIRTHDATE = 'lifeCounter.birthdate';
    const STORAGE_LIFE_EXP = 'lifeCounter.lifeExpectancy';

    // Элементы прогресс-бара
    const progressFilled = document.getElementById('progress-filled');
    const percentText = document.getElementById('percent-text');

    function loadFromCache() {
        const savedBirthdate = localStorage.getItem(STORAGE_BIRTHDATE);
        const savedLifeExp = localStorage.getItem(STORAGE_LIFE_EXP);

        if (savedBirthdate) {
            birthdateInput.value = savedBirthdate;
        } else {
            const defaultDate = new Date();
            defaultDate.setFullYear(defaultDate.getFullYear() - 30);
            const year = defaultDate.getFullYear();
            const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
            const day = String(defaultDate.getDate()).padStart(2, '0');
            birthdateInput.value = `${year}-${month}-${day}`;
        }

        if (savedLifeExp) {
            lifeExpectancyInput.value = savedLifeExp;
        } else {
            lifeExpectancyInput.value = 80;
        }
    }

    function saveToCache() {
        localStorage.setItem(STORAGE_BIRTHDATE, birthdateInput.value);
        localStorage.setItem(STORAGE_LIFE_EXP, lifeExpectancyInput.value);
    }

    function updateResults() {
        const birthdateStr = birthdateInput.value;
        const lifeExpectancy = parseFloat(lifeExpectancyInput.value);

        if (!birthdateStr || isNaN(lifeExpectancy) || lifeExpectancy <= 0) {
            return;
        }

        const birthdate = new Date(birthdateStr);
        const now = new Date();

        if (birthdate > now) {
            alert('Дата рождения не может быть в будущем!');
            return;
        }

        const livedMs = now - birthdate;
        const totalLifeMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
        let leftMs = Math.max(totalLifeMs - livedMs, 0);

        const msInYear = 365.25 * 24 * 60 * 60 * 1000;
        const msInMonth = msInYear / 12;
        const msInWeek = 7 * 24 * 60 * 60 * 1000;
        const msInDay = 24 * 60 * 60 * 1000;
        const msInHour = 60 * 60 * 1000;

        function formatNumber(value) {
            return value.toFixed(2);
        }

        document.getElementById('years-lived').textContent = formatNumber(livedMs / msInYear);
        document.getElementById('years-left').textContent = formatNumber(leftMs / msInYear);
        document.getElementById('months-lived').textContent = formatNumber(livedMs / msInMonth);
        document.getElementById('months-left').textContent = formatNumber(leftMs / msInMonth);
        document.getElementById('weeks-lived').textContent = formatNumber(livedMs / msInWeek);
        document.getElementById('weeks-left').textContent = formatNumber(leftMs / msInWeek);
        document.getElementById('days-lived').textContent = formatNumber(livedMs / msInDay);
        document.getElementById('days-left').textContent = formatNumber(leftMs / msInDay);
        document.getElementById('hours-lived').textContent = formatNumber(livedMs / msInHour);
        document.getElementById('hours-left').textContent = formatNumber(leftMs / msInHour);

        let progressPercent = (livedMs / totalLifeMs) * 100;
        if (progressPercent > 100) progressPercent = 100;
        if (progressPercent < 0) progressPercent = 0;

        // Обновляем ширину заполненной части и текст с процентами
        progressFilled.style.width = progressPercent + '%';
        percentText.textContent = progressPercent.toFixed(2) + '%';

        saveToCache();
    }

    loadFromCache();

    birthdateInput.addEventListener('change', updateResults);
    birthdateInput.addEventListener('input', updateResults);
    lifeExpectancyInput.addEventListener('input', updateResults);

    updateResults();
});