// Получаем объект WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

// Авторизация
const user = tg.initDataUnsafe.user;
document.getElementById('user').textContent = `Привет, ${user.first_name}!`;

// Загружаем трек дня
async function loadTrack() {
  const res = await fetch('data/daily.json');
  const track = await res.json();

  document.getElementById('title').textContent = track.title;
  document.getElementById('artist').textContent = track.artist;
  document.getElementById('cover').src = track.cover_url;

  window.currentTrack = track;
}

document.getElementById('rate-btn').onclick = () => {
  document.getElementById('daily-track').style.display = 'none';
  document.getElementById('rating').style.display = 'block';
};

document.getElementById('submit').onclick = () => {
  const ratings = {
    rhymes: +document.getElementById('rhymes').value,
    rhythm: +document.getElementById('rhythm').value,
    style: +document.getElementById('style').value,
    charisma: +document.getElementById('charisma').value,
    vibe: +document.getElementById('vibe').value,
  };

  const total = Object.values(ratings).reduce((a, b) => a + b, 0);

  // Отправляем результат в бота
  tg.sendData(JSON.stringify({
    type: 'review',
    user_id: user.id,
    track_id: window.currentTrack.id,
    ratings,
    total,
    timestamp: new Date().toISOString()
  }));

  alert(`Оценка отправлена! ${total}/90`);
  tg.close();
};

// Загружаем при старте
loadTrack();