// laba3.js

/**
 * Игра "Карточный фараон" (упрощенный блэкджек)
 * Игрок и дилер тянут карты. Нужно набрать сумму очков ближе к 21, но не больше.
 * Используются все типы всплывающих окон: alert, prompt, confirm.
 */

function startCardGame() {
    // Приветствие и правила игры (alert)
    alert("🃏 ДОБРО ПОЖАЛОВАТЬ В КАРТОЧНЫЙ ФАРАОН!\n\n" +
        "ПРАВИЛА ИГРЫ:\n" +
        "• У тебя есть 1000 фишек\n" +
        "• Ты делаешь ставку (от 10 до 1000 фишек)\n" +
        "• Тянешь карты (6, 7, 8, 9, 10, Валет, Дама, Король, Туз)\n" +
        "• Нужно набрать сумму очков как можно ближе к 21, но не больше\n" +
        "• Если у тебя перебор (>21) - ты проиграл\n" +
        "• Валет, Дама, Король = 10 очков\n" +
        "• Туз = 11 очков (или 1, если перебор)\n\n" +
        "ВЫИГРЫШИ:\n" +
        "🔥 21 очко → выигрыш x3 от ставки\n" +
        "👍 Победа (больше дилера и не перебор) → выигрыш x2\n" +
        "👎 Ничья → возврат ставки\n" +
        "👎 Проигрыш → потеря ставки");

    // Запрашиваем подтверждение на начало игры (confirm)
    let wantToPlay = confirm("Сыграем? Нажми ОК, если готов, или Отмена, если хочешь сохранить фишки.");

    if (!wantToPlay) {
        alert("Жаль, фишки ждут тебя в следующий раз! 💰");
        return;
    }

    // Начальный капитал
    let chips = 1000;
    let gameActive = true;

    // Основной игровой цикл
    while (gameActive && chips > 0) {
        // Показываем текущий капитал
        alert(`💰 Твой текущий капитал: ${chips} фишек`);

        // Запрашиваем ставку (prompt)
        let betInput = prompt(`Сделай ставку (от 10 до ${chips} фишек):`);

        // Проверка на отмену
        if (betInput === null) {
            let confirmExit = confirm("Точно хочешь уйти? Твой выигрыш может быть огромным!");
            if (confirmExit) {
                alert(`Ты уходишь с ${chips} фишками. Заходи ещё!`);
                gameActive = false;
                continue;
            } else {
                continue; // Продолжаем игру
            }
        }

        // Проверка на пустой ввод
        if (betInput.trim() === "") {
            alert("⚠️ Ошибка: Введи число фишек!");
            continue;
        }

        // Преобразуем в число
        let bet = Number(betInput.trim());

        // Проверки ставки
        if (isNaN(bet)) {
            alert("❌ Ошибка: Это не число!");
            continue;
        }

        if (!Number.isInteger(bet)) {
            alert("❌ Ошибка: Ставка должна быть целым числом!");
            continue;
        }

        if (bet < 10) {
            alert("⚠️ Ошибка: Минимальная ставка 10 фишек!");
            continue;
        }

        if (bet > chips) {
            alert(`⚠️ Ошибка: У тебя только ${chips} фишек!`);
            continue;
        }

        // Начинаем игру
        alert(`🃏 Ставка ${bet} фишек принята! Начинаем раздачу...`);

        // ===== ИГРОК ТЯНЕТ КАРТЫ =====
        let playerCards = [];
        let playerScore = 0;
        let playerHasAce = false;
        let playerBusted = false;

        // Функция для получения случайной карты
        function drawCard() {
            const cards = [
                { name: "6", value: 6 },
                { name: "7", value: 7 },
                { name: "8", value: 8 },
                { name: "9", value: 9 },
                { name: "10", value: 10 },
                { name: "Валет", value: 10 },
                { name: "Дама", value: 10 },
                { name: "Король", value: 10 },
                { name: "Туз", value: 11 } // Туз может быть 11 или 1
            ];
            return cards[Math.floor(Math.random() * cards.length)];
        }

        // Первая карта игроку
        let firstCard = drawCard();
        playerCards.push(firstCard.name);
        playerScore += firstCard.value;
        if (firstCard.name === "Туз") playerHasAce = true;

        alert(`🎴 Твоя первая карта: ${firstCard.name} (${playerScore} очков)`);

        // Игрок тянет карты
        let playerTurn = true;
        while (playerTurn && playerScore < 21) {
            let action = confirm(`У тебя ${playerScore} очков. Тянуть ещё карту?`);

            if (action) {
                // Тянем карту
                let newCard = drawCard();
                playerCards.push(newCard.name);
                playerScore += newCard.value;

                if (newCard.name === "Туз") {
                    playerHasAce = true;
                }

                // Проверка на перебор с тузом (если перебор, туз становится 1)
                if (playerScore > 21 && playerHasAce) {
                    playerScore -= 10; // Превращаем туз из 11 в 1
                    playerHasAce = false; // Уже использовали
                    alert(`🃏 Ты вытянул ${newCard.name}! Туз превратился в 1, теперь у тебя ${playerScore} очков`);
                } else {
                    alert(`🃏 Ты вытянул ${newCard.name}! Теперь у тебя ${playerScore} очков`);
                }

                // Проверка на перебор
                if (playerScore > 21) {
                    alert(`💥 ПЕРЕБОР! У тебя ${playerScore} очков`);
                    playerBusted = true;
                    playerTurn = false;
                }
            } else {
                playerTurn = false;
            }
        }

        // Если игрок остановился до 21 или набрал 21
        if (!playerBusted) {
            alert(`🛑 Ты остановился на ${playerScore} очках`);
        }

        // ===== ХОД ДИЛЕРА =====
        if (!playerBusted) {
            alert("🤵 Ход дилера...");

            let dealerCards = [];
            let dealerScore = 0;
            let dealerHasAce = false;

            // Дилер тянет карты
            while (dealerScore < 17) { // Дилер обязан тянуть до 17
                let newCard = drawCard();
                dealerCards.push(newCard.name);
                dealerScore += newCard.value;

                if (newCard.name === "Туз") {
                    dealerHasAce = true;
                }

                // Проверка на перебор с тузом
                if (dealerScore > 21 && dealerHasAce) {
                    dealerScore -= 10;
                    dealerHasAce = false;
                }
            }

            // Показываем карты дилера
            alert(`🤵 Карты дилера: ${dealerCards.join(", ")} (${dealerScore} очков)`);

            // ===== ОПРЕДЕЛЕНИЕ РЕЗУЛЬТАТА =====
            let result = "";
            let winAmount = 0;

            // Проверка на перебор дилера
            if (dealerScore > 21) {
                result = "🎉 ДИЛЕР ПЕРЕБРАЛ! ТЫ ПОБЕДИЛ!";
                winAmount = bet * 2;
                chips += winAmount;
            } else {
                // Сравнение очков
                if (playerScore > dealerScore) {
                    if (playerScore === 21) {
                        result = "🔥 БЛЭКДЖЕК! ТЫ ВЫИГРАЛ С МАКСИМАЛЬНЫМ КОЭФФИЦИЕНТОМ!";
                        winAmount = bet * 3;
                    } else {
                        result = "👍 ТЫ ПОБЕДИЛ!";
                        winAmount = bet * 2;
                    }
                    chips += winAmount;
                } else if (playerScore === dealerScore) {
                    result = "🤝 НИЧЬЯ! Ставка возвращена.";
                    winAmount = bet;
                    chips += winAmount;
                } else {
                    result = "👎 ДИЛЕР ПОБЕДИЛ!";
                    winAmount = 0;
                    chips -= bet;
                }
            }

            // Показываем результат
            alert(`${result}\n💰 Твой капитал: ${chips} фишек`);

        } else {
            // Игрок перебрал
            chips -= bet;
            alert(`💔 Ты проиграл ставку. Осталось фишек: ${chips}`);
        }

        // Проверка на окончание игры
        if (chips <= 0) {
            alert("💸 ТЫ ПРОИГРАЛ ВСЕ ФИШКИ! Игра окончена.");

            let playAgain = confirm("Хочешь начать заново с 1000 фишек?");
            if (playAgain) {
                chips = 1000;
                alert("🔄 Новая игра! Тебе снова дали 1000 фишек.");
            } else {
                gameActive = false;
            }
        } else {
            // Спрашиваем, хочет ли игрок продолжать
            let continueGame = confirm(`У тебя ${chips} фишек. Хочешь сыграть ещё раунд?`);
            if (!continueGame) {
                alert(`🎊 Ты уходишь с ${chips} фишками. Поздравляю!`);
                gameActive = false;
            }
        }
    }

    // Прощание
    if (chips <= 0) {
        alert("Приходи в следующий раз, когда накопишь фишки! 🎰");
    }
}

// Ждем полной загрузки страницы, чтобы добавить обработчик на кнопку
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку по ID и добавляем обработчик события
    const gameButton = document.getElementById('startGameBtn');
    if (gameButton) {
        gameButton.addEventListener('click', startCardGame);
    }
});