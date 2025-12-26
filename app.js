// Получаем объект WebApp из Telegram
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

// Показываем имя пользователя
const user = tg.initDataUnsafe.user;
document.getElementById('user-greeting').textContent = `Привет, ${user.first_name}!`;

// Загружаем "трек дня" из data/daily.json
async function loadDailyTrack() {
  try {
    const res = await fetch('data/daily.json');
    const track = await res.json();

    document.getElementById('title').textContent = track.title;
    document.getElementById('artist').textContent = track.artist;
    document.getElementById('cover').src = track.cover_url;

    window.currentTrack = track;
  } catch (e) {
    console.error("Не удалось загрузить трек дня:", e);
    alert("Ошибка загрузки трека");
  }
}

// Обновляем значения ползунков
function updateValues() {
  document.getElementById('rhymes').oninput = () => document.getElementById('rhymes-val').textContent = this.value;
  document.getElementById('rhythm').oninput = () => document.getElementById('rhythm-val').textContent = this.value;
  document.getElementById('style').oninput = () => document.getElementById('style-val').textContent = this.value;
  document.getElementById('charisma').oninput = () => document.getElementById('charisma-val').textContent = this.value;
  document.getElementById('vibe').oninput = () => document.getElementById('vibe-val').textContent = this.value;
}

// Открываем форму оценки
document.getElementById('open-rating').onclick = () => {
  document.getElementById('daily-track').style.display = 'none';
  document.getElementById('rating-section').style.display = 'block';
};

// Отправляем оценку в бота
document.getElementById('submit-rating').onclick = () => {
  const ratings = {
    rhymes: +document.getElementById('rhymes').value,
    rhythm: +document.getElementById('rhythm').value,
    style: +document.getElementById('style').value,
    charisma: +document.getElementById('charisma').value,
    vibe: +document.getElementById('vibe').value,
  };

  const total = Object.values(ratings).reduce((a, b) => a + b, 0);

  // Отправляем данные в бота
  tg.sendData(JSON.stringify({
    type: 'review',
    user_id: user.id,
    username: user.username || user.first_name,
    track_id: window.currentTrack.id,
    track_title: window.currentTrack.title,
    track_artist: window.currentTrack.artist,
    ratings,
    total,
    timestamp: new Date().toISOString()
  }));

  alert(`✅ Оценка отправлена!\nОбщий балл: ${total}/90`);
  tg.close(); // Закрываем окно
};

// Загружаем всё при старте
document.addEventListener('DOMContentLoaded', () => {
  loadDailyTrack();
  updateValues();
});