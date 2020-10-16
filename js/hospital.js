

/* 
    Code JS here
*/ 

window.SystemCore = {
    /* Tạo đường dẫn */
    apiUrl: "https://5f2c125affc88500167b89b2.mockapi.io/hospitals",

                                                                /************ HIỂN THỊ **********/ 

     /* 
        Hiển thị dữ liệu
    */
    fetchData: function() {
        // Gửi request lên đường dẫn
        axios.get(this.apiUrl)
        // Trả về dữ liệu
        .then(response => {
            if(response.statusText === "OK") {
                // Xóa tất cả thể có trong DOM id = target
                document.querySelector("tbody").innerHTML = '';
                // Gán biến data
                var data = response.data;
                var content = '';
                // Chạy vòng lặp tạo thẻ li
                data.forEach(element => {
                    content += `<tr id="row-${element.id}">
                                    <th scope="row">${element.id}</th>
                                    <td>${element.name}</td>
                                    <td>
                                        <img src="${element.logo}" class="border-images">
                                    </td>
                                    <td>${element.address}</td>
                                    <td>${element.bed_number}</td>
                                    <td>
                                        <a href="../patients/index.html?id=${element.id}" class="patient"><i class="fas fa-procedures"></i></a>
                                    </td>

                                    <td>
                                        <a href="edit.html?id=${element.id}" class="edit_admin"><i class="fas fa-edit"></i></a>
                                    </td>
                                    <td>
                                        <a href="# class="delete_admin" onclick="SystemCore.removeHospital(${element.id})"><i class="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>`;
                });
                // Gán thẻ li vào DOM có id = target
                document.querySelector("tbody").innerHTML = content;
            }
        })
    },
     /* 
        Hết hiển thị
    */


                                                                                     /************ THÊM **********/ 
    /* 
        Khởi tạo thêm bệnh viện 
    */
   createHospital: function() {
    // Láy thông tin input form
    const name = document.querySelector('[name="name"]').value;
    const logo = document.querySelector('[name="logo"]').value;
    const address = document.querySelector('[name="address"]').value;
    const bed_number = document.querySelector('[name="bed_number"]').value;
    // Tạo ra 1 Json có obj chứa data
    const requestObj = {
        name: name,
        logo: logo,
        address: address,
        bed_number: bed_number
    }
    console.log(requestObj);

    // Gưi request lên mockapi để thêm khách sạn
    // Tham số thử 2 là object
    axios.post(this.apiUrl, requestObj)
    // Gửi dữ liệu lên
    .then(data => {
        // console.log(data);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bạn đã thêm thành công',
            showConfirmButton: false,
            timer: 3000
            })
        if(data.statusText === "Created") {
            setTimeout(function(){
                window.location.href = 'index.html'; 
            },2000);
            
        }
    })
    return false;
    },
    /* 
        Hết thêm mới 
    */

    /*
        Add Validate
    */
    validateForm: function() {        
        var validator = new Validator(document.querySelector('#add-hospital-form'), function(err, res) {
            //res trả về trạng thái xem có thành công không
            //console.log(res);
            if(res === true) {
                return SystemCore.createHospital();
            }
            return false;
        },{
            // thêm rules check ảnh
            rules: {
                checkImgUrl: function(value, params) {
                    //console.log(value);
                    // sử dụng pattend để check ảnh
                    return (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(value);
                },
                checkNumber: function(value) {
                    return (/^[1-9][0-9]*$/).test(value);
                }
            },
            messages: {
                en: {
                    required: {
                        empty: 'Không được để trống - vui lòng nhập thông tin - vui lòng nhập lại',
                        incorrect: 'Thông tin bạn nhập vào không chính xác - vui lòng nhập lại'
                    },
                    minlength: {
                        empty: 'Hãy nhập tối thiếu trên {0} ký tự - vui lòng nhập lại',
                        incorrect: 'Bạn đã nhập ít hơn {0} ký tự - vui lòng nhập lại'
                    },
                    checkImgUrl: {
                        empty: 'Nhập đường dẫn ảnh - vui lòng nhập lại',
                        incorrect: 'Đường dẫn ảnh không đúng định dạng - vui lòng nhập lại'
                    },
                    integer: {
                        empty: 'Nhập vào giá trị là số - vui lòng nhập lại',
                        incorrect: 'Giá trị bạn nhập vào không phải là số - vui lòng nhập lại'
                    },
                    checkNumber: {
                        empty: 'Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại',
                        incorrect: 'Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại'
                    }
                }
            }
        });
    },

    /*
        Validate End
    */



                                                                                    /************ SỬA **********/ 
     /*
        Sủa dữ liệu
    */

    // Lấy thông tin rồi điển vào form
   getHospitalInfo: function() {
       // Lấy tham số id trên đường dẫn
       const urlParams = new URLSearchParams(window.location.search);
       id = urlParams.get('id');
       // Gửi request lên mockapi để lấy thông tin khách sạn về
       const getHospitalInfoUrl = this.apiUrl + "/" + id;
       axios.get(getHospitalInfoUrl)
       .then(response => {
        response
           if(response.statusText === "OK"){
               HospitalInfo = response.data;
               console.log('HospitalInfo: ', HospitalInfo);
               
               // Điền dữ liệu được lấy từ api vào trong form
               document.querySelector('[name="name"]').value = HospitalInfo.name;
               document.querySelector('[name="logo"]').value = HospitalInfo.logo;
               document.querySelector('[name="address"]').value = HospitalInfo.address;
               document.querySelector('[name="bed_number"]').value = HospitalInfo.bed_number;
           }
       })
   },

   // Lưu thông tin đã lấy
   editHospital: function() {
       // Láy thông tin input form
       const name = document.querySelector('[name="name"]').value;
       const logo = document.querySelector('[name="logo"]').value;
       const address = document.querySelector('[name="address"]').value;
       const bed_number = document.querySelector('[name="bed_number"]').value;
       HospitalInfo.name = name;
       HospitalInfo.logo = logo;
       HospitalInfo.address = address;
       HospitalInfo.bed_number = bed_number;

       // Gưi request lên mockapi để thêm khách sạn
       const updateHospitalUrl = this.apiUrl + "/" + id;
       // Tham số thử 2 là object
       axios.put(updateHospitalUrl, HospitalInfo)
       // Gửi dữ liệu lên
       .then(data => {
           // console.log(data);
           Swal.fire({
               position: 'center',
               icon: 'success',
               title: 'Bạn đã chỉnh sửa thành công',
               showConfirmButton: false,
               timer: 3000
               })
           if(data.statusText === "OK") {
               setTimeout(function(){
                   window.location.href = 'index.html'; 
               },2000);
               
           }
       })
       return false;
   },
   /*
        Sủa dữ liệu hết 
    */
    /*
        Add Validate
    */
    validateFormEdit: function() {        
        var validator = new Validator(document.querySelector('#edit-hospital-form'), function(err, res) {
            //res trả về trạng thái xem có thành công không
            //console.log(res);
            if(res === true) {
                return SystemCore.editHospital()
            }
            return false;
        },{
            // thêm rules check ảnh
            rules: {
                checkImgUrl: function(value, params) {
                    //console.log(value);
                    // sử dụng pattend để check ảnh
                    return (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(value);
                },
                checkNumber: function(value) {
                    return (/^[1-9][0-9]*$/).test(value);
                }
            },
            messages: {
                en: {
                    required: {
                        empty: 'Không được để trống - vui lòng nhập thông tin - vui lòng nhập lại',
                        incorrect: 'Thông tin bạn nhập vào không chính xác - vui lòng nhập lại'
                    },
                    minlength: {
                        empty: 'Hãy nhập tối thiếu trên {0} ký tự - vui lòng nhập lại',
                        incorrect: 'Bạn đã nhập ít hơn {0} ký tự - vui lòng nhập lại'
                    },
                    checkImgUrl: {
                        empty: 'Nhập đường dẫn ảnh - vui lòng nhập lại',
                        incorrect: 'Đường dẫn ảnh không đúng định dạng - vui lòng nhập lại'
                    },
                    integer: {
                        empty: 'Nhập vào giá trị là số - vui lòng nhập lại',
                        incorrect: 'Giá trị bạn nhập vào không phải là số - vui lòng nhập lại'
                    },
                    checkNumber: {
                        empty: 'Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại',
                        incorrect: 'Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại'
                    }
                }
            }
        });
    },

    /*
        Validate End
    */


                                                                                /************ XÓA **********/ 
    /* 
       Xóa dữ liệu 
    */
    removeHospital:  function (removeId) {
        // Xác nhận trước khi xóa
        Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa bản ghi không?',
        text: "Lưu ý: Sau khi thực hiện xóa dữ liệu không còn được lưu trữ !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Không đồng ý'
        }).then((result) => {
            // Nếu người dùng đồng ý xóa thì gửi request lên server
            if (result.value) {
                // Đường dẫn xóa
                var deleteUrl = this.apiUrl + "/" + removeId;;
                console.log('deleteUrl: ', deleteUrl);
                
                axios.delete(deleteUrl)
                .then(response => {
                    console.log(response);
                })
                // Xóa dữ liệu khỏi DOM
                .then(( )=> {
                    // Xóa theo class row-id
                    document.querySelector("#row-" + removeId).remove();
                    // Thông báo xóa thành công
                    Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Bạn đã xóa thành công',
                    showConfirmButton: false,
                    timer: 1500
                    })
                });

            }
        })

    },

     /* 
        Hết xóa dữ liệu
    */
}