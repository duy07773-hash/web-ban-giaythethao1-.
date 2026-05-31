let cart = [];
let selectedSizeValue = null; // Biến lưu kích thước giày được chọn

// Bật/Tắt thanh giỏ hàng (Sidebar)
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

// CẬP NHẬT HÀM MỞ CHI TIẾT SẢN PHẨM (CÓ NHIỀU ẢNH)
function openProductDetail(name, price, imgList, description) {
    // Ẩn trang chủ, hiện trang chi tiết
    document.getElementById('home-page').classList.add('style-hidden');
    document.getElementById('detail-page').classList.remove('style-hidden');

    // Đổ dữ liệu chữ
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-price').innerText = price.toLocaleString() + ' đ';
    document.getElementById('detail-desc').innerText = description;

    // Xử lý hiển thị ảnh lớn mặc định là tấm ảnh đầu tiên trong danh sách
    const mainImg = document.getElementById('detail-img');
    mainImg.src = Array.isArray(imgList) ? imgList[0] : imgList;

    // Xử lý danh sách ảnh nhỏ (Thumbnails)
    const thumbContainer = document.getElementById('detail-thumbnails');
    thumbContainer.innerHTML = ''; // Xóa các ảnh nhỏ cũ đi

    if (Array.isArray(imgList) && imgList.length > 1) {
        imgList.forEach((imgUrl, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgUrl;
            thumb.classList.add('thumb-img');
            if (index === 0) thumb.classList.add('active'); // Ảnh đầu tiên sẽ có viền đỏ trước

            // Khi người dùng click vào ảnh nhỏ, đổi ảnh lớn thành ảnh này
            thumb.onclick = function() {
                mainImg.src = imgUrl;
                // Đổi viền đỏ sang cho ảnh nhỏ vừa click
                document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };

            thumbContainer.appendChild(thumb);
        });
    }

    // Reset lại trạng thái chọn size
    selectedSizeValue = null;
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));

    // Gắn sự kiện khi bấm nút mua hàng
    const buyBtn = document.getElementById('detail-add-btn');
    buyBtn.onclick = function() {
        if (!selectedSizeValue) {
            alert("Vui lòng chọn Kích cỡ (Size) giày trước khi thêm vào giỏ hàng!");
            return;
        }
        addToCart(`${name} (Size ${selectedSizeValue})`, price);
        alert(`Đã thêm ${name} - Size ${selectedSizeValue} vào giỏ hàng!`);
    };
    
    window.scrollTo(0, 0);
}

// HÀM QUAY LẠI TRANG CHỦ
function homePage() {
    document.getElementById('home-page').classList.remove('style-hidden');
    document.getElementById('detail-page').classList.add('style-hidden');
}
function contactPage() {
    // Ẩn trang chủ và trang chi tiết sản phẩm
    document.getElementById('home-page').classList.add('style-hidden');
    document.getElementById('detail-page').classList.add('style-hidden');
    
    // Hiện trang liên hệ lên
    document.getElementById('contact-page').classList.remove('style-hidden');

    // Đổi trạng thái active trên thanh menu
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
    // Tự động cuộn lên đầu trang
    window.scrollTo(0, 0);
}

// CẬP NHẬT LẠI HÀM QUAY VỀ TRANG CHỦ CŨ ĐỂ ẨN TRANG LIÊN HỆ KHI KHÁCH BẤM VỀ TRANG CHỦ
function homePage() {
    document.getElementById('home-page').classList.remove('style-hidden');
    document.getElementById('detail-page').classList.add('style-hidden');
    document.getElementById('contact-page').classList.add('style-hidden'); // Ẩn liên hệ
}

// HÀM XỬ LÝ KHI KHÁCH BẤM NÚT GỬI TIN NHẮN
function handleSendContact(event) {
    event.preventDefault(); // Ngăn trang bị load lại
    alert("Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
    event.target.reset(); // Xóa sạch dữ liệu vừa nhập trong form
}
// HÀM XỬ LÝ CHỌN SIZE GIÀY
function selectSize(element) {
    // Xóa màu đỏ của tất cả các nút size khác
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    // Thêm màu đỏ vào nút vừa chọn
    element.classList.add('selected');
    // Lưu số size vào biến
    selectedSizeValue = element.innerText; 
}

// Hàm thêm sản phẩm vào giỏ
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    updateCartUI();
}

// Cập nhật giao diện giỏ hàng và số lượng trên icon
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Giỏ hàng đang trống.</p>';
        cartTotal.innerText = '0 đ';
        return;
    }

    let totalPrice = 0;
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>${item.price.toLocaleString()} đ x ${item.quantity}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4757; cursor:pointer;">Xóa</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotal.innerText = totalPrice.toLocaleString() + ' đ';
}

// Hàm xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Hàm xử lý thanh toán đơn giản
function checkout() {
    if(cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    alert("Cảm ơn bạn đã mua sắm! Đơn hàng đang được xử lý.");
    cart = [];
    updateCartUI();
    toggleCart();
}