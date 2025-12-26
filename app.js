const tg = window.Telegram.WebApp;
tg.expand();

// Загружаем "трек дня"
async function loadDailyTrack() {
  try {
    const res = await fetch('data/daily.json');
    const track = await res.json();

    document.getElementById('title').textContent = track.title;
    document.getElementById('artist').textContent = track.artist;
    document.getElementById('cover').src = track.cover_url;
    document.getElementById('rating-title').textContent = `Оцени: ${track.title}`;

    window.currentTrack = track;
  } catch (e) {
    console.error("Ошибка загрузки трека:", e);
    alert("Не удалось загрузить трек дня.");
  }
}

// Обновляем значения и сумму
function updateValues() {
  const inputs = ['rhymes', 'rhythm', 'style', 'charisma', 'vibe'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    el.oninput = () => {
      document.getElementById(`${id}-val`).textContent = el.value;
      updateTotal();
    };
  });
}

function updateTotal() {
  const sum = ['rhymes', 'rhythm', 'style', 'charisma', 'vibe']
    .reduce((a, b) => a + +document.getElementById(b).value, 0);
  document.getElementById('total-display').textContent = `Сумма: ${sum}/90`;
}

// Переход к оценке
document.getElementById('open-rating').onclick = () => {
  document.getElementById('daily-track').style.display = 'none';
  document.getElementById('rating-section').style.display = 'block';
};

// Отправка в бота
document.getElementById('submit-rating').onclick = () => {
  const ratings = {
    rhymes: +document.getElementById('rhymes').value,
    rhythm: +document.getElementById('rhythm').value,
    style: +document.getElementById('style').value,
    charisma: +document.getElementById('charisma').value,
    vibe: +document.getElementById('vibe').value,
  };

  const total = Object.values(ratings).reduce((a, b) => a + b, 0);

  const user = tg.initDataUnsafe.user;

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
  tg.close();
};

document.addEventListener('DOMContentLoaded', () => {
  loadDailyTrack();
  updateValues();
});