'use strict';

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
