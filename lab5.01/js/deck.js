'use strict';

var STORAGE_KEY = 'inscryption_v3';
var deck = [];
var activeFilter = 'all';
var activeSortKey = 'default';
var activeSortDir = 1;

function loadDeck() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            deck = JSON.parse(saved).map(createCard);
            return;
        }
    } catch (err) {
        console.warn('Не удалось загрузить колоду из localStorage:', err);
    }
    deck = DEFAULT_DECK.map(createCard);
}

function saveDeck() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deck.map(c => c.toData())));
    } catch (err) {
        console.warn('Не удалось сохранить колоду:', err);
    }
}

function addCard(card) {
    deck.push(card);
    saveDeck();
}

function removeCard(id) {
    deck = deck.filter(c => c.id !== id);
    saveDeck();
}

function updateCardField(id, field, value) {
    var card = deck.find(c => c.id === id);
    if (!card) return;
    if (field === 'sigils') {
        card.sigils = String(value).split(',').map(s => s.trim()).filter(Boolean);
    } else if (['power', 'health', 'blood', 'bones'].includes(field)) {
        card[field] = Number(value) || 0;
    } else {
        card[field] = value;
    }
    saveDeck();
}

var RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, unique: 3 };

function getFilteredDeck() {
    var result = activeFilter === 'all' ?
        deck.slice() :
        deck.filter(c => c.typeKey === activeFilter);

    if (activeSortKey === 'default') return result;

    result.sort((a, b) => {
        var va, vb;
        switch (activeSortKey) {
            case 'power':
                va = a.power;
                vb = b.power;
                break;
            case 'health':
                va = a.health;
                vb = b.health;
                break;
            case 'blood':
                va = a.blood;
                vb = b.blood;
                break;
            case 'bones':
                va = a.bones;
                vb = b.bones;
                break;
            case 'rarity':
                va = RARITY_ORDER[a.rarity] || 0;
                vb = RARITY_ORDER[b.rarity] || 0;
                break;
            case 'name':
                va = a.name.toLowerCase();
                vb = b.name.toLowerCase();
                return activeSortDir * va.localeCompare(vb);
            default:
                return 0;
        }
        return activeSortDir * (va - vb);
    });

    return result;
}

function setFilter(filterKey) {
    activeFilter = filterKey;
}

function setSort(sortKey) {
    if (sortKey === activeSortKey) {
        activeSortDir *= -1;
    } else {
        activeSortKey = sortKey;
        activeSortDir = 1;
    }
}

function calcStats() {
    var total = deck.length;
    if (total === 0) {
        return { total: 0, blood: 0, bones: 0, free: 0, avgPower: '0.0', avgHealth: '0.0' };
    }
    return {
        total,
        blood: deck.filter(c => c.blood > 0).length,
        bones: deck.filter(c => c.bones > 0).length,
        free: deck.filter(c => c.blood === 0 && c.bones === 0).length,
        avgPower: (deck.reduce((s, c) => s + c.power, 0) / total).toFixed(1),
        avgHealth: (deck.reduce((s, c) => s + c.health, 0) / total).toFixed(1),
    };
}