'use strict';

function _getArtHTML(name, imageB64) {
    if (imageB64) {
        return '<img src="' + imageB64 + '" alt="Арт карты ' + name + '" style="width:100%;height:100%;object-fit:contain;background:#c8ba90;padding:4px;display:block;image-rendering:pixelated"/>';
    }
    var url = CARD_ARTS[name];
    if (url) {
        return '<img src="' + url + '" alt="Арт карты ' + name + '" style="width:100%;height:100%;object-fit:contain;background:#c8ba90;padding:4px;display:block;image-rendering:pixelated"/>';
    }
    return '<div class="card-art-placeholder">' + name + '</div>';
}

class Card {
    constructor(data) {
        if (new.target === Card) {
            throw new Error('Card — абстрактный класс. Используй Beast, Undead или Insect.');
        }
        this.id = data.id || 'c_' + Math.random().toString(36).slice(2, 8);
        this.name = data.name || '???';
        this.power = Number(data.power) || 0;
        this.health = Number(data.health) || 1;
        this.blood = Number(data.blood) || 0;
        this.bones = Number(data.bones) || 0;
        this.sigils = Array.isArray(data.sigils) ? data.sigils.slice() : [];
        this.imageB64 = data.imageB64 || '';
        this.flavor = data.flavor || '';
        this.rarity = data.rarity || 'common';
    }

    get typeName() { throw new Error('typeName не реализован в ' + this.constructor.name); }
    get typeKey() { throw new Error('typeKey не реализован в ' + this.constructor.name); }

    hpIcon() { return ICON_HEART; }

    costHTML() {
        if (this.blood === 0 && this.bones === 0) {
            return '<span class="cost-free">FREE</span>';
        }
        var html = '';
        for (let i = 0; i < this.blood; i++) {
            html += BLOOD_DROP_URL ?
                '<div class="drop"><img src="' + BLOOD_DROP_URL + '" alt="кровь"/></div>' :
                '<div class="drop css-drop"></div>';
        }
        for (let j = 0; j < this.bones; j++) {
            html += BONE_URL ?
                '<div class="drop"><img src="' + BONE_URL + '" alt="кость"/></div>' :
                '<div class="bonepiece"></div>';
        }
        return html;
    }

    sigilsHTML() {
        if (!this.sigils.length) {
            return '<span class="no-sigil">нет способностей</span>';
        }
        return this.sigils.map(s => '<span class="sigil-tag">' + sigilRu(s) + '</span>').join('');
    }

    toHTML() {
        var delay = (Math.random() * 0.4).toFixed(2);
        return (
            '<article class="card-wrap rarity-' + this.rarity + '" data-id="' + this.id + '" style="animation-delay:' + delay + 's">' +
            '<div class="card" id="card-' + this.id + '">' +
            '<div class="card-namebar">' +
            '<h3 class="card-name-text">' + this.name + '</h3>' +
            '</div>' +
            '<figure class="card-art-section">' +
            _getArtHTML(this.name, this.imageB64) +
            '<div class="cost-badge" aria-label="Стоимость">' + this.costHTML() + '</div>' +
            '</figure>' +
            '<div class="card-sigils" aria-label="Способности">' + this.sigilsHTML() + '</div>' +
            '<p class="card-flavor">' + (this.flavor ? '&laquo;' + this.flavor + '&raquo;' : '') + '</p>' +
            '<div class="card-footer">' +
            '<div class="stat-block atk" aria-label="Атака">' +
            '<span class="stat-number">' + this.power + '</span>' +
            '<span class="stat-icn" aria-hidden="true">' + ICON_PAW + '</span>' +
            '</div>' +
            '<div class="stat-block hp" aria-label="Здоровье">' +
            '<span class="stat-number">' + this.health + '</span>' +
            '<span class="stat-icn" aria-hidden="true">' + this.hpIcon() + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="rarity-bar" aria-label="Редкость: ' + this.rarity + '"><div class="r-pip"></div></div>' +
            this._editOverlayHTML() +
            '</div>' +
            '</article>'
        );
    }

    _editOverlayHTML() {
        return (
            '<div class="card-edit-overlay" role="form" aria-label="Редактировать карту">' +
            '<div class="ei-row"><label class="ei-lbl">Название</label><input class="ei-inp" data-field="name" value="' + this.name + '"/></div>' +
            '<div class="ei-row-2">' +
            '<div class="ei-row"><label class="ei-lbl">Атака</label><input class="ei-inp" data-field="power" value="' + this.power + '" type="number"/></div>' +
            '<div class="ei-row"><label class="ei-lbl">Здоровье</label><input class="ei-inp" data-field="health" value="' + this.health + '" type="number"/></div>' +
            '</div>' +
            '<div class="ei-row-2">' +
            '<div class="ei-row"><label class="ei-lbl">Кровь</label><input class="ei-inp" data-field="blood" value="' + this.blood + '" type="number" min="0" max="4"/></div>' +
            '<div class="ei-row"><label class="ei-lbl">Кости</label><input class="ei-inp" data-field="bones" value="' + this.bones + '" type="number" min="0" max="13"/></div>' +
            '</div>' +
            '<div class="ei-row"><label class="ei-lbl">Способности</label><input class="ei-inp" data-field="sigils" value="' + this.sigils.join(', ') + '"/></div>' +
            '<div class="ei-row"><label class="ei-lbl">Цитата</label><textarea class="ei-ta" data-field="flavor">' + this.flavor + '</textarea></div>' +
            '<div class="ei-actions">' +
            '<button class="btn-save" data-id="' + this.id + '">Сохранить</button>' +
            '<button class="btn-del" data-id="' + this.id + '">&#x2715;</button>' +
            '</div>' +
            '</div>'
        );
    }

    toData() {
        return {
            type: this.typeKey,
            id: this.id,
            name: this.name,
            power: this.power,
            health: this.health,
            blood: this.blood,
            bones: this.bones,
            sigils: this.sigils.slice(),
            flavor: this.flavor,
            rarity: this.rarity,
            imageB64: this.imageB64,
        };
    }
}

class Beast extends Card {
    constructor(data) { super(data); }
    get typeName() { return 'Зверь'; }
    get typeKey() { return 'beast'; }
}

class Undead extends Card {
    constructor(data) {
        super(data);
        this.boneYield = (data.boneYield != null) ? Number(data.boneYield) : 1;
    }
    get typeName() { return 'Нежить'; }
    get typeKey() { return 'undead'; }
    hpIcon() { return ICON_BONE; }
    costHTML() {
        var base = super.costHTML();
        if (this.boneYield > 0) {
            base += '<span class="cost-free" title="Даёт ' + this.boneYield + ' кост. при смерти">+' + this.boneYield + '🦴</span>';
        }
        return base;
    }
    toData() {
        var d = super.toData();
        d.boneYield = this.boneYield;
        return d;
    }
}

class Insect extends Card {
    constructor(data) { super(data); }
    get typeName() { return 'Насекомое'; }
    get typeKey() { return 'insect'; }
    sigilsHTML() {
        if (!this.sigils.length) {
            return '<span class="no-sigil">нет способностей</span>';
        }
        return this.sigils.map(s => {
            var label = sigilRu(s);
            if (s === 'Swarm') label += ' ×2';
            return '<span class="sigil-tag">' + label + '</span>';
        }).join('');
    }
}

function createCard(data) {
    switch (data.type) {
        case 'undead':
            return new Undead(data);
        case 'insect':
            return new Insect(data);
        default:
            return new Beast(data);
    }
}