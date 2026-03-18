'use strict';

function buildDOM() {
	document.body.innerHTML =
		'<canvas id="particlesCanvas" aria-hidden="true"></canvas>' +
		'<canvas id="forestCanvas" aria-hidden="true"></canvas>' +

		'<div id="introOverlay" aria-hidden="true">' +
			'<p class="intro-title">&#9881; <span>Inscryption</span></p>' +
			'<div class="intro-divider"></div>' +
			'<p class="intro-sub">Колода Лешего</p>' +
		'</div>' +

		'<header class="site-header">' +
			'<p class="logo">&#9881; <span>Inscryption</span> &#8212; Колода Лешего</p>' +
			'<div class="header-right">' +
				'<label class="edit-toggle-label" for="editToggle">' +
					'Редактировать' +
					'<span class="toggle-switch">' +
						'<input type="checkbox" id="editToggle" aria-label="Режим редактирования"/>' +
						'<span class="toggle-track"></span>' +
					'</span>' +
				'</label>' +
			'</div>' +
		'</header>' +


		'<main class="section" id="mainContent">' +

			'<div class="edit-banner" role="alert" aria-live="polite">' +
				'&#9888; РЕЖИМ РЕДАКТИРОВАНИЯ АКТИВЕН &#9888;' +
			'</div>' +

			'<section class="hero" aria-label="Заголовок колоды">' +
				'<h1 class="hero-title">Колода Лешего</h1>' +
				'<p class="hero-sub">Акт I &middot; Хижина в лесу &middot; Жертвы кровью и костями</p>' +
			'</section>' +

			'<section class="stats-row" id="statsRow" aria-label="Статистика колоды"></section>' +

			'<nav class="filters" id="filterBar" aria-label="Фильтры карт"></nav>' +

			'<nav class="sort-bar" id="sortBar" aria-label="Сортировка карт"></nav>' +

			'<section class="deck-grid" id="deckGrid" aria-label="Карты колоды"></section>' +

			'<div class="modal-overlay" id="detailModal" role="dialog" aria-modal="true" aria-labelledby="detailTitle">' +
				'<div class="detail-modal">' +
					'<button class="mclose" id="detailClose" aria-label="Закрыть">&#x2715;</button>' +
					'<div class="detail-content" id="detailContent"></div>' +
				'</div>' +
			'</div>' +

			'<div class="modal-overlay" id="addModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
				'<div class="modal">' +
					'<button class="mclose" id="mClose" aria-label="Закрыть">&#x2715;</button>' +
					'<h2 class="modal-title" id="modalTitle">&#x2726; Добавить карту</h2>' +
					'<div class="mfields">' +
						'<div class="mrow2">' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nType">Тип</label>' +
								'<select class="msel" id="nType">' +
									'<option value="beast">Зверь</option>' +
									'<option value="undead">Нежить</option>' +
									'<option value="insect">Насекомое</option>' +
								'</select>' +
							'</div>' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nRarity">Редкость</label>' +
								'<select class="msel" id="nRarity">' +
									'<option value="common">Common</option>' +
									'<option value="uncommon">Uncommon</option>' +
									'<option value="rare">Rare</option>' +
									'<option value="unique">Unique</option>' +
								'</select>' +
							'</div>' +
						'</div>' +
						'<div class="mfield">' +
							'<label class="mlbl" for="nName">Название</label>' +
							'<input class="minp" id="nName" placeholder="Имя существа..."/>' +
						'</div>' +
						'<div class="mrow2">' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nPow">Атака</label>' +
								'<input class="minp" id="nPow" type="number" min="0" max="99" placeholder="1"/>' +
							'</div>' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nHp">Здоровье</label>' +
								'<input class="minp" id="nHp" type="number" min="1" max="99" placeholder="2"/>' +
							'</div>' +
						'</div>' +
						'<div class="mrow2">' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nBlood">Стоимость кровью</label>' +
								'<input class="minp" id="nBlood" type="number" min="0" max="4" placeholder="0"/>' +
							'</div>' +
							'<div class="mfield">' +
								'<label class="mlbl" for="nBones">Стоимость костями</label>' +
								'<input class="minp" id="nBones" type="number" min="0" max="13" placeholder="0"/>' +
							'</div>' +
						'</div>' +
						'<div class="mfield">' +
							'<label class="mlbl" for="nSigils">Способности (через запятую)</label>' +
							'<input class="minp" id="nSigils" placeholder="Airborne, Unkillable..."/>' +
						'</div>' +
						'<div class="mfield">' +
							'<label class="mlbl" for="nFlavor">Цитата</label>' +
							'<textarea class="mta" id="nFlavor" placeholder="Лес помнит всех..."></textarea>' +
						'</div>' +
						'<div class="mfield">' +
							'<label class="mlbl">Картинка карты</label>' +
							'<label class="img-upload-label" for="nImage">' +
								'<span class="img-upload-icon">🖼</span>' +
								'<span class="img-upload-text" id="imgUploadText">Выбрать файл...</span>' +
								'<input type="file" id="nImage" accept="image/*" style="display:none"/>' +
							'</label>' +
							'<div class="img-preview-wrap" id="imgPreviewWrap" style="display:none">' +
								'<img class="img-preview" id="imgPreview" src="" alt="Предпросмотр"/>' +
								'<button class="img-clear-btn" id="imgClear" type="button">&#x2715; Убрать</button>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="mactions">' +
						'<button class="btn-mcancel" id="mCancel">Отмена</button>' +
						'<button class="btn-madd" id="mAdd">Создать</button>' +
					'</div>' +
				'</div>' +
			'</div>' +

		'</main>' +
		'<footer class="site-footer">' +
			'<p>Inscryption &copy; Daniel Mullins Games / Devolver Digital &nbsp;|&nbsp; Фан-проект</p>' +
		'</footer>';
}

buildDOM();

document.addEventListener('DOMContentLoaded', function () {
	document.body.classList.add('intro-active');

	setTimeout(function () {
		var overlay = document.getElementById('introOverlay');
		if (overlay) overlay.remove();
		document.body.classList.remove('intro-active');
	}, 3300);

	initEditToggle();
	initFilterBar();
	initSortBar();
	loadDeck();
	buildSiteAnimated();
	initModal();

	document.getElementById('detailClose').addEventListener('click', closeDetailModal);
	document.getElementById('detailModal').addEventListener('click', function(e) {
		if (e.target === this) closeDetailModal();
	});
});

function initEditToggle() {
	document.getElementById('editToggle').addEventListener('change', function () {
		document.body.classList.toggle('edit-mode', this.checked);
	});
}

function initFilterBar() {
	document.getElementById('filterBar').addEventListener('click', function(e) {
		var btn = e.target.closest('.fbtn');
		if (!btn) return;
		animateFilter(btn.dataset.f);
	});
}

function initSortBar() {
	document.getElementById('sortBar').addEventListener('click', function(e) {
		var btn = e.target.closest('.sbtn');
		if (!btn) return;
		animateSort(btn.dataset.s);
	});
}
