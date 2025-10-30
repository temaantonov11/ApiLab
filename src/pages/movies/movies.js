const API_KEY = 'd9cf6dd5';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;


// Элементы DOM
const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const moviesResult = document.getElementById('moviesResult');

// Поиск фильмов
async function searchMovies() {
    const searchTerm = movieInput.value.trim();
    
    if (!searchTerm) {
        showError('Введите название фильма');
        return;
    }

    try {
        showLoading();
        
        const response = await fetch(`${API_URL}s=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            showError('Фильмы не найдены');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка при поиске фильмов');
    }
}

// Отображение фильмов
function displayMovies(movies) {
    moviesResult.innerHTML = `
        <div class="movies-grid">
            ${movies.map(movie => `
                <div class="movie-card">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/vite.svg'}" 
                         alt="${movie.Title}" 
                         class="movie-poster"
                         onerror="this.src='/vite.svg'">
                    <div class="movie-info">
                        <h3>${movie.Title}</h3>
                        <p>Год: ${movie.Year}</p>
                        <p>Тип: ${getTypeText(movie.Type)}</p>
                        <button class="details-btn" data-imdbid="${movie.imdbID}">Подробнее</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Добавляем обработчики для всех кнопок "Подробнее"
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const imdbID = this.getAttribute('data-imdbid');
            showMovieDetails(imdbID);
        });
    });
}

// Получение деталей фильма
async function showMovieDetails(imdbID) {
    try {
        
        const response = await fetch(`${API_URL}i=${imdbID}`);
        const movie = await response.json();
        
        createMovieModal(movie);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Не удалось загрузить подробную информацию о фильме');
    }
}

// Создание модального окна с информацией о фильме
function createMovieModal(movie) {
    // Удаляем предыдущее модальное окно если есть
    const existingModal = document.getElementById('movie-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'movie-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button id="close-modal" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 16px;
            ">×</button>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/vite.svg'}" 
                     alt="${movie.Title}" 
                     style="width: 150px; height: 220px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='/vite.svg'">
                <div>
                    <h2 style="margin: 0 0 10px 0; color: #2d3748;">${movie.Title}</h2>
                    <p><strong>Год:</strong> ${movie.Year}</p>
                    <p><strong>Рейтинг IMDB:</strong> ⭐ ${movie.imdbRating || 'N/A'}/10</p>
                    <p><strong>Длительность:</strong> ${movie.Runtime || 'N/A'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p><strong>Жанр:</strong> ${movie.Genre || 'N/A'}</p>
                <p><strong>Режиссер:</strong> ${movie.Director || 'N/A'}</p>
                <p><strong>Актеры:</strong> ${movie.Actors || 'N/A'}</p>
            </div>
            
            <div>
                <h3 style="margin-bottom: 10px;">Сюжет</h3>
                <p style="line-height: 1.5; color: #4a5568;">${movie.Plot !== 'N/A' ? movie.Plot : 'Описание отсутствует'}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Закрытие при клике на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Вспомогательные функции
function getTypeText(type) {
    const types = {
        'movie': 'Фильм',
        'series': 'Сериал',
        'episode': 'Эпизод'
    };
    return types[type] || type;
}

function showLoading() {
    moviesResult.innerHTML = '<div class="loading">Ищем фильмы...</div>';
}

function showError(message) {
    moviesResult.innerHTML = `<div class="error">${message}</div>`;
}

// Обработчики событий
searchBtn.addEventListener('click', searchMovies);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});