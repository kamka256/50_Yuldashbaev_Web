'use strict';

function renderStatBox(value, label, cssClass) {
    cssClass = cssClass || '';
    return (
        '<div class="stat-box ' + cssClass + '">' +
        '<span class="stat-val">' + value + '</span>' +
        '<span class="stat-lbl">' + label + '</span>' +
        '</div>'
    );
}

function renderStats() {
    var stats = calcStats();
    var target = document.getElementById('statsRow');
    target.innerHTML =
        renderStatBox(stats.total, 'Карт', '') +
        renderStatBox(stats.blood, 'Кровью', 'blood') +
        renderStatBox(stats.bones, 'Костями', 'bones') +
        renderStatBox(stats.free, 'Бесплатно', 'free') +
        renderStatBox(stats.avgPower, 'Ср. атака', '') +
        renderStatBox(stats.avgHealth, 'Ср. здоровье', '');
}

var SORT_OPTIONS = [
    { key: 'default', label: 'По умолчанию' },
    { key: 'name', label: 'Название' },
    { key: 'power', label: 'Атака' },
    { key: 'health', label: 'Здоровье' },
    { key: 'blood', label: 'Кровь' },
    { key: 'bones', label: 'Кости' },
    { key: 'rarity', label: 'Редкость' },
];

function renderSortBar() {
    var target = document.getElementById('sortBar');
    var html = '<span class="sort-lbl">Сортировка:</span>';
    html += SORT_OPTIONS.map(function(opt) {
        var isActive = activeSortKey === opt.key;
        var arrow = '';
        if (isActive && opt.key !== 'default') {
            arrow = '<span class="sort-arrow">' + (activeSortDir === 1 ? '↑' : '↓') + '</span>';
        }
        return '<button class="sbtn' + (isActive ? ' active' : '') + '" data-s="' + opt.key + '">' + opt.label + arrow + '</button>';
    }).join('');
    target.innerHTML = html;
}

var FILTER_OPTIONS = [
    { key: 'all', label: 'Все карты' },
    { key: 'beast', label: 'Звери' },
    { key: 'undead', label: 'Нежить' },
    { key: 'insect', label: 'Насекомые' },
];

function renderFilters() {
    var target = document.getElementById('filterBar');
    var btns = FILTER_OPTIONS.map(function(opt) {
        var isActive = (activeFilter === opt.key) ? ' active' : '';
        return '<button class="fbtn' + isActive + '" data-f="' + opt.key + '">' + opt.label + '</button>';
    }).join('');
    target.innerHTML = btns;
}

function renderGrid() {
    var target = document.getElementById('deckGrid');
    var cards = getFilteredDeck();

    target.innerHTML =
        cards.map(function(c) { return c.toHTML(); }).join('') +
        '<button class="add-card-btn" id="addBtn">' +
        '<span class="plus" aria-hidden="true">+</span>' +
        '<span>Добавить карту</span>' +
        '</button>';

    _bindSaveButtons(target);
    _bindDeleteButtons(target);
    _bindAddButton();
    _bindCardClicks(target);
}

function _bindSaveButtons(grid) {
    grid.querySelectorAll('.btn-save').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var overlay = btn.closest('.card-edit-overlay');
            overlay.querySelectorAll('[data-field]').forEach(function(inp) {
                updateCardField(btn.dataset.id, inp.dataset.field, inp.value);
            });
            buildSite();
        });
    });
}

function _bindDeleteButtons(grid) {
    grid.querySelectorAll('.btn-del').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeCard(btn.dataset.id);
            buildSite();
        });
    });
}

function _bindAddButton() {
    var btn = document.getElementById('addBtn');
    if (btn) btn.addEventListener('click', function() { openAddModal(); });
}

function _bindCardClicks(grid) {
    grid.querySelectorAll('.card-wrap').forEach(function(el) {
        el.addEventListener('click', function(e) {
            if (document.body.classList.contains('edit-mode')) return;
            if (e.target.closest('.card-edit-overlay')) return;
            var card = deck.find(function(c) { return c.id === el.dataset.id; });
            if (card) openDetailModal(card);
        });
    });
}

var _isShuffling = false;

function _runShuffleAnimation(onMidpoint, onDone) {
    if (_isShuffling) return;
    _isShuffling = true;

    var cards = Array.from(document.querySelectorAll('#deckGrid .card-wrap'));
    var total = cards.length;

    if (total === 0) {
        onMidpoint();
        buildSite();
        _isShuffling = false;
        if (onDone) onDone();
        return;
    }

    cards.forEach(function(el) {
        el.style.animation = 'none';
        el.style.setProperty('--shuffle-rot', (Math.random() * 60 - 30).toFixed(1) + 'deg');
    });

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            cards.forEach(function(el, i) {
                el.style.animation = '';
                el.style.animationDelay = (i * 0.04) + 's';
                el.classList.remove('shuffle-in');
                el.classList.add('shuffle-out');
            });

            setTimeout(function() {
                onMidpoint();
                buildSite();

                var newCards = Array.from(document.querySelectorAll('#deckGrid .card-wrap'));
                newCards.forEach(function(el) {
                    el.style.animation = 'none';
                    el.style.setProperty('--shuffle-rot', (Math.random() * 40 - 20).toFixed(1) + 'deg');
                });

                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        newCards.forEach(function(el, i) {
                            el.style.animation = '';
                            el.style.animationDelay = (i * 0.05) + 's';
                            el.classList.remove('shuffle-out');
                            el.classList.add('shuffle-in');
                        });

                        setTimeout(function() {
                            _isShuffling = false;
                            if (onDone) onDone();
                        }, 500 + newCards.length * 50 + 200);
                    });
                });

            }, 400 + total * 40 + 150);
        });
    });
}

function animateFilter(filterKey) {
    _runShuffleAnimation(function() { setFilter(filterKey); });
}

function animateSort(sortKey) {
    _runShuffleAnimation(function() { setSort(sortKey); });
}

function buildSite() {
    renderStats();
    renderFilters();
    renderSortBar();
    renderGrid();
}

function buildSiteAnimated() {
    buildSite();
}

function openAddModal() {
    document.getElementById('addModal').classList.add('open');
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('open');
}

function openDetailModal(card) {
    var rarityLabels = { common: 'Обычная', uncommon: 'Необычная', rare: 'Редкая', unique: 'Уникальная' };
    var typeLabels = { beast: 'Зверь', undead: 'Нежить', insect: 'Насекомое' };

    var sigilsHTML = card.sigils.length ?
        card.sigils.map(function(s) { return '<span class="detail-sigil">' + sigilRu(s) + '</span>'; }).join('') :
        '<span class="detail-sigil" style="opacity:0.5">нет способностей</span>';

    var costParts = [];
    if (card.blood > 0) costParts.push(card.blood + ' кровью');
    if (card.bones > 0) costParts.push(card.bones + ' костями');
    var costStr = costParts.length ? costParts.join(' + ') : 'бесплатно';

    document.getElementById('detailContent').innerHTML =
        '<div class="detail-card-col">' +
        card.toHTML().replace(/animation-delay:[^"]*"/, '"') +
        '</div>' +
        '<div class="detail-info-col">' +
        '<h2 class="detail-name">' + card.name + '</h2>' +
        '<p class="detail-type">' + (typeLabels[card.typeKey] || card.typeKey) + '</p>' +
        '<div class="detail-stats">' +
        '<div class="detail-stat"><span class="detail-stat-val">' + card.power + '</span><span class="detail-stat-lbl">Атака</span></div>' +
        '<div class="detail-stat"><span class="detail-stat-val">' + card.health + '</span><span class="detail-stat-lbl">Здоровье</span></div>' +
        '<div class="detail-stat"><span class="detail-stat-val">' + costStr + '</span><span class="detail-stat-lbl">Стоимость</span></div>' +
        '</div>' +
        '<div>' +
        '<p class="detail-section-title">Способности</p>' +
        '<div class="detail-sigils">' + sigilsHTML + '</div>' +
        '</div>' +
        (card.flavor ? '<p class="detail-flavor">&laquo;' + card.flavor + '&raquo;</p>' : '') +
        '<p class="detail-rarity rarity-' + card.rarity + '">&#9670; ' + (rarityLabels[card.rarity] || card.rarity) + '</p>' +
        '</div>';

    document.getElementById('detailModal').classList.add('open');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('open');
}

var _pendingImageBase64 = '';

function readModalForm() {
    return {
        type: document.getElementById('nType').value,
        rarity: document.getElementById('nRarity').value,
        name: document.getElementById('nName').value.trim() || '???',
        power: Number(document.getElementById('nPow').value) || 0,
        health: Number(document.getElementById('nHp').value) || 1,
        blood: Number(document.getElementById('nBlood').value) || 0,
        bones: Number(document.getElementById('nBones').value) || 0,
        sigils: document.getElementById('nSigils').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
        flavor: document.getElementById('nFlavor').value.trim(),
        imageB64: _pendingImageBase64,
    };
}

function clearModalForm() {
    ['nName', 'nPow', 'nHp', 'nBlood', 'nBones', 'nSigils', 'nFlavor']
    .forEach(function(id) { document.getElementById(id).value = ''; });
    _clearImagePreview();
}

function _clearImagePreview() {
    _pendingImageBase64 = '';
    document.getElementById('nImage').value = '';
    document.getElementById('imgUploadText').textContent = 'Выбрать файл...';
    document.getElementById('imgPreview').src = '';
    document.getElementById('imgPreviewWrap').style.display = 'none';
}

function initModal() {
    document.getElementById('mClose').addEventListener('click', closeAddModal);
    document.getElementById('mCancel').addEventListener('click', closeAddModal);

    document.getElementById('addModal').addEventListener('click', function(e) {
        if (e.target === document.getElementById('addModal')) closeAddModal();
    });

    document.getElementById('nImage').addEventListener('change', function() {
        var file = this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            _pendingImageBase64 = e.target.result;
            document.getElementById('imgUploadText').textContent = file.name;
            document.getElementById('imgPreview').src = _pendingImageBase64;
            document.getElementById('imgPreviewWrap').style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('imgClear').addEventListener('click', _clearImagePreview);

    document.getElementById('mAdd').addEventListener('click', function() {
        var card = createCard(readModalForm());
        addCard(card);
        activeFilter = 'all';
        buildSite();
        closeAddModal();
        clearModalForm();
    });
}