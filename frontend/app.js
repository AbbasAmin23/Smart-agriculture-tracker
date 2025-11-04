
document.addEventListener('DOMContentLoaded', () => {
    let translations = {};

    const fetchSessionAndContent = async () => {
        try {
            const sessionResponse = await fetch('/backend/api/auth/get_session.php');
            const sessionData = await sessionResponse.json();

            const lang = sessionData.language || 'ur'; // Default to Urdu
            document.getElementById('language-switcher').value = lang;

            const contentResponse = await fetch(`/backend/api/content.php?lang=${lang}`);
            translations = await contentResponse.json();

            if (sessionData.loggedin) {
                document.getElementById('login-link').style.display = 'none';
                document.getElementById('register-link').style.display = 'none';
                document.getElementById('logout-link').style.display = 'block';
                document.getElementById('welcome-message').textContent = `${translations.welcome}, ${sessionData.username}!`;
            } else {
                document.getElementById('login-link').style.display = 'block';
                document.getElementById('register-link').style.display = 'block';
                document.getElementById('logout-link').style.display = 'none';
                document.getElementById('welcome-message').textContent = translations.welcome_guest;
            }
            
            updateUI(lang);

        } catch (error) {
            console.error('Error fetching session or content:', error);
        }
    };

    fetchSessionAndContent();

    document.getElementById('language-switcher').addEventListener('change', async (e) => {
        const newLang = e.target.value;
        try {
            const response = await fetch('/backend/api/auth/switch_language.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: newLang })
            });

            if (response.ok) {
                const contentResponse = await fetch(`/backend/api/content.php?lang=${newLang}`);
                translations = await contentResponse.json();
                updateUI(newLang);
            } else {
                console.error('Failed to switch language');
            }
        } catch (error) {
            console.error('Error switching language:', error);
        }
    });

    document.getElementById('logout-link').addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await fetch('/backend/api/auth/logout.php');
        if (response.ok) {
            window.location.href = 'login.html';
        }
    });

    function updateUI(lang) {
        document.getElementById('login-link').textContent = translations.login;
        document.getElementById('register-link').textContent = translations.register;
        document.getElementById('forum-link').textContent = translations.community_forum;
        document.getElementById('logout-link').textContent = translations.logout;
        document.getElementById('hero-text').textContent = translations.hero_text;
        document.getElementById('get-started-button').textContent = translations.get_started;
        document.getElementById('features-title').textContent = translations.features;
        document.getElementById('market-data-title').textContent = translations.market_data;
        document.getElementById('market-data-text').textContent = translations.market_data_text;
        document.getElementById('weather-updates-title').textContent = translations.weather_updates;
        document.getElementById('weather-updates-text').textContent = translations.weather_updates_text;
        document.getElementById('price-trends-title').textContent = translations.price_trends;
        document.getElementById('price-trends-text').textContent = translations.price_trends_text;
        document.getElementById('community-forum-title').textContent = translations.community_forum;
        document.getElementById('community-forum-text').textContent = translations.community_forum_text;
    }
});
