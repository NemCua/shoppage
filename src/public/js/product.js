import { Modal } from "./modal.js"
import ToastMessage from "./toast.js"
let formAddProducs = new Modal(
    
    `
    <div class="content-modal">
    <h1>Nhập thông tin sản phẩm</h1>
    <form action="">
  <div class="form-group">
    <label for="productName">Tên sản phẩm</label>
    <input id="productName" name="name" type="text" placeholder="Nhập tên sản phẩm">
  </div>

  <div class="form-group">
    <label for="description">Mô tả</label>
    <textarea id="description" name="description" placeholder="Nhập mô tả sản phẩm"></textarea>
  </div>

  <div class="form-group">
    <label for="price">Giá</label>
    <input id="price" name="price" type="number" step="0.01" placeholder="Nhập giá">
  </div>

  <div class="form-group">
    <label for="available">Khả dụng</label>
    <input id="available" name="available" type="checkbox"> Có sẵn
  </div>

  <div class="form-group">
    <label for="tags">Tags</label>
    <input id="tags" name="tags" type="text" placeholder="Nhập các tag, cách nhau bằng dấu phẩy">
  </div>

  <div class="form-group">
    <label for="propose">Treo hàng</label>
    <input id="propose" name="propose" type="checkbox" > Treo hàng
  </div>

  <div class="form-group">
    <label for="imageUrl">Ảnh sản phẩm (URL)</label>
    <input id="imageUrl" name="imageUrl" type="url" placeholder="Dán link ảnh vào đây">
  </div>

  <div class="form-group">
    <label for="unit">Đơn vị</label>
    <select id="unit" name="unit">
      <option value="ly">Ly</option>
      <option value="chai">Chai</option>
      <option value="kg">Kg</option>
      <option value="g">Gram</option>
    </select>
  </div>

  <button class="button-enter-submit" type="submit">Xác nhận</button>
</form>
</div>
    `
)


async function crateModal(modal){
     
    try {
        let data = await modal.openModal()
        if(data){
            modal.closeModal()
        }
        const response = await fetch(`/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("thanh cong")
            new ToastMessage("Thêm sản phẩm thành công", "success").openToast()
            modal.closeModal();
        } else {
            new ToastMessage("Không phản hồi", "problem").openToast()
        }
    } catch (error) {
        new ToastMessage("Thêm sản phẩm thất bại", "fail").openToast()
    }
}

let btnDelete = document.querySelectorAll(".delete-product")
btnDelete.forEach(btn =>{
    btn.onclick = async function(e){
        
        let card = e.target.closest(".product-card")
        let id = card.getAttribute("data-id")
        let isDelete = confirm("ban co muon xoa kh")
        if(!isDelete){
            new ToastMessage("khong xoa", "problem").openToast()
            return
        }
        try {
            const response = await fetch(`/products/${id}`, { // Thay đổi URL nếu endpoint xóa của bạn khác
                method: 'DELETE',
            });

            if (response.ok) {
                card.remove(); 
                new ToastMessage("Xóa  thành công!", "success").openToast()
            } else {
                const errorData = await response.json();
                new ToastMessage("Đã xảy ra lỗi khi xóa ", "fail").openToast()
                
            }
        } catch (error) {
            new ToastMessage("Đã xảy ra lỗi", "fail").openToast()
        }
        finally{
            
        }
    }
})
let btnInformation = document.querySelectorAll(".view-product")
btnInformation.forEach(btn =>{
    btn.onclick = async function(e){
        let card = e.target.closest(".product-card")
        let id = card.getAttribute("data-id")
        console.log(id)
        try {
            // Gọi API để lấy thông tin sản phẩm
            let res = await fetch(`/products/${id}`);  
            let product = await res.json();

            // Hiển thị modal
            let productModal = new Modal(`
                <div class="content-modal">
                    <h2>Chi tiết sản phẩm</h2>
                    <img src="${product.imageUrl}" style="width:100%;border-radius:8px; max-height:500px;object-fit: cover;" />
                    <p><strong>Tên:</strong> ${product.name}</p>
                    <p><strong>Mô tả:</strong> ${product.description}</p>
                    <p><strong>Giá:</strong> ${product.price}</p>
                    <p><strong>Đơn vị:</strong> ${product.unit}</p>
                    <p><strong>Tags:</strong> ${product.tags}</p>
                    <p><strong>Trạng thái:</strong> ${product.available ? "Còn hàng" : "Hết hàng"}</p>
                    <p><strong>Treo hàng:</strong> ${product.propose ? "Có" : "Không"}</p>
                </div>
            `);

            productModal.openModal();
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
    }
})
let btnEdit = document.querySelectorAll(".edit-product")
btnEdit.forEach(btn => {
    btn.onclick = async function (e) {
        let card = e.target.closest(".product-card")
        let id = card.getAttribute("data-id")
        let newDataProducts = await formAddProducs.openModal() 
        console.log(newDataProducts)
        try {
            const response = await fetch(`/products/${id}`, {
                method: 'PUT', // Hoặc PATCH nếu chỉ cập nhật một phần
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    newDataProducts
                    ),
            });
            formAddProducs.closeModal() 
            new ToastMessage("sửa thành công!", "success").openToast()
        } catch (error) {
            new ToastMessage("Đã xảy ra lỗi ", "fail").openToast()
            
            
        }
        
    }
})
document.querySelector("#add-product-btn").onclick = function(){
    crateModal(formAddProducs)
}
