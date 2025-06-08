// 图片数据配置
const imageData = {
    row1: [
        { id: 'img01', title: '图片1', path: 'Pictures/row1/img01.jpg' },
        { id: 'img02', title: '图片2', path: 'Pictures/row1/img02.jpg' },
        { id: 'img03', title: '图片3', path: 'Pictures/row1/img03.jpg' },
        { id: 'img04', title: '图片4', path: 'Pictures/row1/img04.jpg' },
        { id: 'img05', title: '图片5', path: 'Pictures/row1/img05.jpg' },
        { id: 'img06', title: '图片6', path: 'Pictures/row1/img06.jpg' }
    ],
    row2: [
        { id: 'img07', title: '图片7', path: 'Pictures/row2/img07.jpg' },
        { id: 'img08', title: '图片8', path: 'Pictures/row2/img08.jpg' },
        { id: 'img09', title: '图片9', path: 'Pictures/row2/img09.jpg' },
        { id: 'img10', title: '图片10', path: 'Pictures/row2/img10.jpg' },
        { id: 'img11', title: '图片11', path: 'Pictures/row2/img11.jpg' },
        { id: 'img12', title: '图片12', path: 'Pictures/row2/img12.jpg' }
    ]
};

// 全局状态
let filmStripRow1 = null;
let filmStripRow2 = null;
let animationId = null;
let currentPositionRow1 = 0;
let currentPositionRow2 = 0;
let isPaused = false;
const speed = 0.5; // 每帧移动的像素数，可以调整速度

// 初始化胶片滑动器
function initSlider() {
    filmStripRow1 = document.getElementById('filmStripRow1');
    filmStripRow2 = document.getElementById('filmStripRow2');
    
    // 生成胶片帧
    generateFilmFrames();
    
    // 绑定交互事件
    bindSliderEvents();
    
    // 隐藏加载提示
    hideLoading();
}

// 生成胶片帧
function generateFilmFrames() {
    if (!filmStripRow1 || !filmStripRow2) return;
    
    // 为了实现无缝循环，复制一份图片数据
    const duplicatedRow1Data = [...imageData.row1, ...imageData.row1];
    const duplicatedRow2Data = [...imageData.row2, ...imageData.row2];
    
    // 生成第一行胶片帧
    duplicatedRow1Data.forEach((image, index) => {
        const frame = createFilmFrame(image, index);
        filmStripRow1.appendChild(frame);
    });
    
    // 生成第二行胶片帧
    duplicatedRow2Data.forEach((image, index) => {
        const frame = createFilmFrame(image, index);
        filmStripRow2.appendChild(frame);
    });
}

// 创建单个胶片帧
function createFilmFrame(image, index) {
    const frame = document.createElement('div');
    frame.className = 'film-frame';
    frame.setAttribute('data-image-id', image.id);
    frame.setAttribute('data-title', image.title);
    
    // 创建图片元素
    const img = document.createElement('img');
    img.src = image.path;
    img.alt = image.title;
    img.setAttribute('aria-label', image.title);
    
    // 图片加载错误处理
    img.addEventListener('error', () => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>🖼️</span>
                <p>图片加载失败</p>
                <small>${image.title}</small>
            </div>
        `;
        frame.replaceChild(errorDiv, img);
    });
    
    frame.appendChild(img);
    return frame;
}

// 绑定滑动器事件
function bindSliderEvents() {
    if (!filmStripRow1 || !filmStripRow2) return;
    
    // 为两行胶片条绑定鼠标事件
    [filmStripRow1, filmStripRow2].forEach(filmStrip => {
        // 鼠标进入胶片条 - 暂停滑动
        filmStrip.addEventListener('mouseenter', () => {
            isPaused = true;
            filmStrip.classList.add('paused');
        });
        
        // 鼠标离开胶片条 - 恢复滑动
        filmStrip.addEventListener('mouseleave', () => {
            isPaused = false;
            filmStrip.classList.remove('paused');
        });
    });
}

// 隐藏加载提示
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// 开始无限循环动画
function startInfiniteAnimation() {
    function animate() {
        if (!isPaused && filmStripRow1 && filmStripRow2) {
            // 第一行向左滑动（负方向）
            currentPositionRow1 -= speed;
            
            // 第二行向右滑动（正方向，但需要从负位置开始）
            currentPositionRow2 += speed;
            
            // 计算胶片总宽度的一半（因为我们复制了一份数据）
            const totalFrames = imageData.row1.length; // 原始图片数量
            const halfWidthRow1 = filmStripRow1.scrollWidth / 2; // 第一行一半宽度
            const halfWidthRow2 = filmStripRow2.scrollWidth / 2; // 第二行一半宽度
            
            // 第一行：当移动超过一半宽度时，重置到起始位置
            if (Math.abs(currentPositionRow1) >= halfWidthRow1) {
                currentPositionRow1 = 0;
            }
            
            // 第二行：当移动超过一半宽度时，重置到起始位置
            if (currentPositionRow2 >= halfWidthRow2) {
                currentPositionRow2 = -halfWidthRow2;
            }
            
            filmStripRow1.style.transform = `translateX(${currentPositionRow1}px)`;
            filmStripRow2.style.transform = `translateX(${currentPositionRow2}px)`;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 初始化第二行位置（从右边开始）
    // 等待图片加载完成后再计算初始位置
    setTimeout(() => {
        const halfWidthRow2 = filmStripRow2.scrollWidth / 2;
        currentPositionRow2 = -halfWidthRow2;
        filmStripRow2.style.transform = `translateX(${currentPositionRow2}px)`;
    }, 100);
    
    animate();
}

// 停止动画
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initSlider();
        startInfiniteAnimation();
    }, 100);
}); 