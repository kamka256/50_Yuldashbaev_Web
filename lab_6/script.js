
const POSTS_API = 'https://jsonplaceholder.typicode.com/posts';
const COUNTRIES_API = 'https://restcountries.com/v3.1';
const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const FAKE_API = 'https://jsonplaceholder.typicode.com';
let currentPostsPage = 1;
let currentUsersPage = 1;
let allUsers = []; 
const itemsPerPage = 6;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading-spinner"></div>';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.dataset.page;
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(`page-${pageId}`).classList.add('active');

        if (pageId === 'posts') {
            loadPosts(currentPostsPage);
        } else if (pageId === 'countries') {
            loadCountries();
        } else if (pageId === 'users') {
            loadUsers(currentUsersPage);
        }
    });
});

async function loadPosts(page = 1) {
    const container = document.getElementById('posts-list');
    showLoading('posts-list');

    try {
        const response = await fetch(`${POSTS_API}?_page=${page}&_limit=${itemsPerPage}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        const totalCount = response.headers.get('x-total-count') || 100;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        renderPosts(posts);
        renderPagination('posts-pagination', page, totalPages, loadPosts);
        currentPostsPage = page;
    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Ошибка загрузки постов: ${error.message}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadPosts(1)">🔄 Повторить</button>
            </div>
        `;
        showToast('Ошибка загрузки постов', 'error');
    }
}

function renderPosts(posts) {
    const container = document.getElementById('posts-list');

    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>Нет постов</p></div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-item" data-id="${post.id}">
            <div class="post-header">
                <span class="post-title">${escapeHtml(post.title)}</span>
                <span class="post-id">ID: ${post.id}</span>
            </div>
            <div class="post-body">${escapeHtml(post.body)}</div>
            <div class="post-actions">
                <button class="edit-btn" onclick='openEditModal(${post.id}, ${JSON.stringify(escapeHtml(post.title))}, ${JSON.stringify(escapeHtml(post.body))})'>✏️ Редактировать</button>
                <button class="delete-btn" onclick="deletePost(${post.id})">🗑️ Удалить</button>
            </div>
        </div>
    `).join('');
}

async function createPost() {
    const title = document.getElementById('post-title').value.trim();
    const body = document.getElementById('post-body').value.trim();

    if (!title || !body) {
        showToast('Заполните заголовок и содержание', 'error');
        return;
    }

    try {
        const response = await fetch(POSTS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newPost = await response.json();
        showToast('Пост успешно создан!', 'success');

        // Clear form
        document.getElementById('post-title').value = '';
        document.getElementById('post-body').value = '';

        loadPosts(1);
    } catch (error) {
        console.error('Error creating post:', error);
        showToast('Ошибка создания поста', 'error');
    }
}

function openEditModal(id, title, body) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-body').value = body;
    openModal('edit-modal');
}

async function updatePost() {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const body = document.getElementById('edit-body').value.trim();

    if (!title || !body) {
        showToast('Заполните заголовок и содержание', 'error');
        return;
    }

    try {
        const response = await fetch(`${POSTS_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, body, userId: 1 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToast('Пост успешно обновлен!', 'success');
        closeModal('edit-modal');
        loadPosts(currentPostsPage);
    } catch (error) {
        console.error('Error updating post:', error);
        showToast('Ошибка обновления поста', 'error');
    }
}

async function deletePost(id) {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
        const response = await fetch(`${POSTS_API}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Пост успешно удален!', 'success');
            loadPosts(currentPostsPage);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        showToast('Ошибка удаления поста', 'error');
    }
}

async function loadCountries() {
    const container = document.getElementById('countries-grid');
    showLoading('countries-grid');

    try {
        const response = await fetch(`${COUNTRIES_API}/all?fields=name,flags,capital,region,population`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const countries = await response.json();
        renderCountries(countries.slice(0, 30));
    } catch (error) {
        console.error('Error loading countries:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Ошибка загрузки стран: ${error.message}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadCountries()">🔄 Повторить</button>
            </div>
        `;
        showToast('Ошибка загрузки стран', 'error');
    }
}

async function searchCountries() {
    const query = document.getElementById('country-search').value.trim();
    const container = document.getElementById('countries-grid');

    if (!query) {
        loadCountries();
        return;
    }

    showLoading('countries-grid');

    try {
        const response = await fetch(`${COUNTRIES_API}/name/${query}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Страна не найдена');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>${error.message}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadCountries()">🌍 Показать все страны</button>
            </div>
        `;
        showToast(error.message, 'error');
    }
}

async function loadRegion(region) {
    const container = document.getElementById('countries-grid');
    showLoading('countries-grid');

    try {
        const response = await fetch(`${COUNTRIES_API}/region/${region}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        console.error('Error loading region:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Ошибка загрузки региона</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadCountries()">🔄 Повторить</button>
            </div>
        `;
    }
}

function renderCountries(countries) {
    const container = document.getElementById('countries-grid');

    if (!countries || countries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🌍</div><p>Страны не найдены</p></div>';
        return;
    }

    container.innerHTML = countries.map(country => `
        <div class="country-card">
            <div class="country-flag">
                ${country.flags?.svg ? 
                    `<img src="${country.flags.svg}" alt="${country.name?.common || 'Flag'}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 8px;">` : 
                    '🏳️'}
            </div>
            <div class="country-name">${country.name?.common || 'Неизвестно'}</div>
            <div class="country-info">🏛️ Столица: ${country.capital?.[0] || '—'}</div>
            <div class="country-info">🌍 Регион: ${country.region || '—'}</div>
            <div class="country-info">👥 Население: ${(country.population || 0).toLocaleString()}</div>
        </div>
    `).join('');
}

async function loadUsers(page = 1) {
    const container = document.getElementById('users-list');
    showLoading('users-list');
    
    try {
        const response = await fetch(`${USERS_API}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        allUsers = users;
        
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = users.slice(startIndex, endIndex);
        const totalPages = Math.ceil(users.length / itemsPerPage);
        
        renderUsers(paginatedUsers);
        renderPagination('users-pagination', page, totalPages, loadUsers);
        currentUsersPage = page;
        
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Ошибка загрузки пользователей: ${error.message}</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">💡 Проверьте подключение к интернету и попробуйте снова.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="loadUsers(1)">🔄 Повторить</button>
            </div>
        `;
        showToast('Ошибка загрузки пользователей', 'error');
    }
}

function renderUsers(users) {
    const container = document.getElementById('users-list');
    
    if (!users || users.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>Нет пользователей</p></div>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-card" data-id="${user.id}">
            <div class="user-avatar">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white;">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
            </div>
            <div class="user-name">${escapeHtml(user.name)}</div>
            <div class="user-email">📧 ${escapeHtml(user.email)}</div>
            <div class="user-phone">📞 ${escapeHtml(user.phone || '—')}</div>
            <div class="user-website">🌐 ${escapeHtml(user.website || '—')}</div>
            <div class="user-actions">
                <button class="edit-user-btn" onclick='openUserModal(${user.id}, ${JSON.stringify(escapeHtml(user.name))}, ${JSON.stringify(escapeHtml(user.company?.name || ""))})'>✏️ Редактировать</button>
                <button class="delete-user-btn" onclick="deleteUser(${user.id})">🗑️ Удалить</button>
            </div>
        </div>
    `).join('');
}

async function createUser() {
    const name = document.getElementById('user-name').value.trim();
    const job = document.getElementById('user-job').value.trim();
    
    if (!name || !job) {
        showToast('Заполните имя и должность', 'error');
        return;
    }
    
    const createBtn = document.querySelector('#page-users .btn-primary');
    const originalText = createBtn.innerHTML;
    createBtn.innerHTML = '<span>⏳</span> Создание...';
    createBtn.disabled = true;
    
    try {
        const response = await fetch(`${FAKE_API}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                title: name, 
                body: job,
                userId: Math.floor(Math.random() * 100) + 10
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newItem = await response.json();
        
        const newUser = {
            id: newItem.id,
            name: name,
            email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            phone: '+7 (999) 123-45-67',
            website: `${name.toLowerCase().replace(/\s/g, '')}.example.com`,
            company: { name: job }
        };
        
        allUsers.unshift(newUser);
        
        showToast(`✅ Пользователь "${name}" успешно создан! (ID: ${newUser.id})`, 'success');
        
        document.getElementById('user-name').value = '';
        document.getElementById('user-job').value = '';
        
        loadUsers(currentUsersPage);
        
    } catch (error) {
        console.error('Error creating user:', error);
        showToast('Ошибка создания пользователя: ' + error.message, 'error');
    } finally {
        createBtn.innerHTML = originalText;
        createBtn.disabled = false;
    }
}

function openUserModal(id, name, company) {
    document.getElementById('umod-id').value = id;
    document.getElementById('umod-name').value = name;
    document.getElementById('umod-job').value = company;
    openModal('user-modal');
}

async function patchUser() {
    const id = parseInt(document.getElementById('umod-id').value);
    const name = document.getElementById('umod-name').value.trim();
    const job = document.getElementById('umod-job').value.trim();
    
    if (!job) {
        showToast('Введите должность', 'error');
        return;
    }
    
    const updateBtn = document.querySelector('#user-modal .btn-warning');
    const originalText = updateBtn.innerHTML;
    updateBtn.innerHTML = '⏳ Сохранение...';
    updateBtn.disabled = true;
    
    try {
        const response = await fetch(`${FAKE_API}/posts/${id}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ title: name, body: job })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userIndex = allUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            allUsers[userIndex].name = name;
            allUsers[userIndex].company = { name: job };
        }
        
        showToast(`✅ Пользователь обновлен! Имя: ${name}, Должность: ${job}`, 'success');
        closeModal('user-modal');
        
        loadUsers(currentUsersPage);
        
    } catch (error) {
        console.error('Error updating user:', error);
        showToast('Ошибка обновления пользователя: ' + error.message, 'error');
    } finally {
        updateBtn.innerHTML = originalText;
        updateBtn.disabled = false;
    }
}

async function deleteUser(id) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
        const response = await fetch(`${FAKE_API}/posts/${id}`, {
            method: 'DELETE'
        });
        
        allUsers = allUsers.filter(user => user.id !== id);
        
        showToast('✅ Пользователь успешно удален!', 'success');
        
        loadUsers(currentUsersPage);
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Ошибка удаления пользователя: ' + error.message, 'error');
    }
}

function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!totalPages || totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';

    html += `<button class="page-btn" onclick="if(${currentPage} > 1) ${onPageChange.name}(${currentPage - 1})" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>←</button>`;
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="${onPageChange.name}(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-dots">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="${onPageChange.name}(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
        html += `<button class="page-btn" onclick="${onPageChange.name}(${totalPages})">${totalPages}</button>`;
    }
    
    html += `<button class="page-btn" onclick="if(${currentPage} < ${totalPages}) ${onPageChange.name}(${currentPage + 1})" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>→</button>`;
    
    container.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('API Explorer initialized');
    loadPosts(1);
    loadCountries();
    loadUsers(1);
});

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .user-phone, .user-website {
        color: var(--text-secondary);
        font-size: 0.8rem;
        margin: 0.2rem 0;
    }
    
    .page-dots {
        display: inline-block;
        padding: 0.5rem 0.75rem;
        color: var(--text-muted);
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-muted);
        background: var(--bg-card);
        border-radius: 20px;
    }
    
    .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .country-flag img {
        width: 60px;
        height: 40px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(additionalStyles);
