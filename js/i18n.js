// 双语文案字典
const i18nData = {
    zh: {
        title: "影格流光 - FrameFlow",
        "main-title": "影格流光",
        subtitle: "图片胶片滚动展示",
        loading: "正在加载图片..."
    },
    en: {
        title: "FrameFlow - Image Gallery",
        "main-title": "FrameFlow", 
        subtitle: "Rolling Image Gallery Experience",
        loading: "Loading images..."
    }
};

// 当前语言
let currentLanguage = localStorage.getItem('language') || 'en';

// 初始化多语言
function initI18n() {
    // 设置HTML语言属性
    document.documentElement.lang = currentLanguage;
    
    // 更新所有文案
    updateTexts();
    
    // 更新语言按钮状态
    updateLanguageButtons();
    
    // 绑定语言切换事件
    bindLanguageEvents();
}

// 更新页面文案
function updateTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18nData[currentLanguage] && i18nData[currentLanguage][key]) {
            element.textContent = i18nData[currentLanguage][key];
        }
    });
    
    // 更新页面标题
    if (i18nData[currentLanguage]['title']) {
        document.title = i18nData[currentLanguage]['title'];
    }
}

// 更新语言按钮状态
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// 绑定语言切换事件
function bindLanguageEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.getAttribute('data-lang');
            if (newLang !== currentLanguage) {
                currentLanguage = newLang;
                localStorage.setItem('language', currentLanguage);
                updateTexts();
                updateLanguageButtons();
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initI18n); 