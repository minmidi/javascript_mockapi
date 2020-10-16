window.SystemCore = {
  /* Tạo đường dẫn */
  apiUrl: "https://5f2c125affc88500167b89b2.mockapi.io/hospitals",

  /* dùng chung */
  setting: function(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log('id: ', id);
  },

  /************ HIỂN THỊ **********/

  fetchData: function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const getDataUrl = this.apiUrl + "/" + id + "/" + "patients";

    axios
      .get(getDataUrl)
      // Trả về dữ liệu
      .then((response) => {
        if (response.statusText === "OK") {
          // Xóa tất cả thể có trong DOM id = target
          document.querySelector("tbody").innerHTML = "";
          // Gán biến data
          var data = response.data;
          var content = "";
          // Chạy vòng lặp tạo thẻ li
          data.forEach((element) => {
            content += `<tr id="row-${element.id}">
                                    <th scope="row">${element.id}</th>
                                    <td>
                                        <img src="${element.images}" class="border-images">
                                    </td>
                                    <td>${element.name}</td>
                                    <td>${element.age}</td>
                                    <td>${element.bed_no}</td>
                                    <td>
                                        <a href="info.html?id=${element.id}&hospitalId=${id}"><i class="far fa-address-card"><i class="fas fa-address-card"></i></a>
                                    </td>
                                    <td>
                                        <a href="edit.html?id=${element.id}&hospitalId=${id}" class="edit_admin"><i class="fas fa-edit"></i></a>
                                    </td>
                                    <td>
                                        <a href="# class="delete_admin" onclick="SystemCore.removePratiens(${element.id})"><i class="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>`;
          });
          // Gán thẻ li vào DOM có id = target
          document.querySelector("tbody").innerHTML = content;
        }
      });
  },

                                                         /************ THÊM **********/

  // Lấy dữ liệu điền form select
  getDataSelect: function () {
      
    // Lấy thông tin bệnh viện
    axios.get(this.apiUrl).then((res) => {
      if (res.statusText === "OK") {
        document.querySelector('[name="hospitalId"]').innerHTML = "";
        var data = res.data;
        var content = "";
        data.forEach((element) => {
          content += `<option id="hospitals/${element.id}" value="${element.id}">
                                    ${element.name}
                                </option>`;
        });
        document.querySelector('[name="hospitalId"]').innerHTML = content;
      }
    });
  },

  // Thêm dữ liệu
  createdPatients: function () {
    // Láy thông tin input form
    const hospitalId = document.querySelector('[name="hospitalId"]').value;
    const images = document.querySelector('[name="images"]').value;
    const name = document.querySelector('[name="name"]').value;
    const age = document.querySelector('[name="age"]').value;
    const bed_no = document.querySelector('[name="bed_no"]').value;
    const description = document.querySelector('[name="description"]').value;

    // Tạo ra 1 Json có obj chứa data
    const requestObj = {
      images: images,
      hospitalId: hospitalId,
      name: name,
      age: age,
      bed_no: bed_no,
      description: description,
    };
    console.log(requestObj);
    var addHospitalUrl = this.apiUrl + "/" + hospitalId + "/patients";
    console.log("addHospitalUrl: ", addHospitalUrl);

    axios.post(addHospitalUrl, requestObj).then((data) => {
      // console.log(data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bạn đã thêm thành công",
        showConfirmButton: false,
        timer: 3000,
      });
      if (data.statusText === "Created") {
        setTimeout(function () {
          window.location.href = "index.html?id=" + hospitalId;
        }, 2000);
      }
    });

    return false;
  },

  /*
        Add Validate
    */
  validateForm: function () {
    var validator = new Validator(
      document.querySelector("#add-hospital-form"),
      function (err, res) {
        //res trả về trạng thái xem có thành công không
        //console.log(res);
        if (res === true) {
          return SystemCore.createdPatients();
        }
        return false;
      },
      {
        // thêm rules check ảnh
        rules: {
          checkImgUrl: function (value, params) {
            //console.log(value);
            // sử dụng pattend để check ảnh
            return /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(value);
          },
          checkNumber: function (value) {
            return (/^[1-9][0-9]*$/).test(value);
          },
        },
        messages: {
          en: {
            required: {
              empty: "Không được để trống - vui lòng nhập thông tin - vui lòng nhập lại",
              incorrect: "Thông tin bạn nhập vào không chính xác - vui lòng nhập lại",
            },
            minlength: {
              empty: "Hãy nhập tối thiếu trên {0} ký tự - vui lòng nhập lại",
              incorrect: "Bạn đã nhập ít hơn {0} ký tự - vui lòng nhập lại",
            },
            checkImgUrl: {
              empty: "Nhập đường dẫn ảnh - vui lòng nhập lại",
              incorrect: "Đường dẫn ảnh không đúng định dạng - vui lòng nhập lại",
            },
            integer: {
              empty: "Nhập vào giá trị là số - vui lòng nhập lại",
              incorrect: "Giá trị bạn nhập vào không phải là số - vui lòng nhập lại",
            },
            checkNumber: {
              empty: "Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại",
              incorrect: "Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại",
            },
            checkAge: {
              empty: "Số tối đa có thể nhập là 150",
              incorrect: "Số tối đa có thể nhập là 150",
            },
          },
        },
      }
    );
  },

                                                         /************ SỬA **********/
    getDataPatient: function() {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get("id");
      const hospitalId = urlParams.get("hospitalId");
      var getDataPatients = this.apiUrl + "/" + hospitalId + "/patients/" + id;
      console.log('getDataPatients: ', getDataPatients);
     axios.get(getDataPatients)
     .then(response=>{
         if(response.statusText = "OK") {
          PatientsInfo = response.data;
              // Điền dữ liệu được lấy từ api vào trong form
             document.querySelector('[name="images"]').value = PatientsInfo.images;
             document.querySelector('[name="name"]').value = PatientsInfo.name;
             document.querySelector('[name="age"]').value = PatientsInfo.age;
             document.querySelector('[name="bed_no"]').value = PatientsInfo.bed_no;
             document.querySelector('[name="description"]').value = PatientsInfo.description;
         }
     })
    },

    editPatients: function() {
      const hospitalId = document.querySelector('[name="hospitalId"]').value;
        const images = document.querySelector('[name="images"]').value;
        const name = document.querySelector('[name="name"]').value;
        const age = document.querySelector('[name="age"]').value;
        const bed_no = document.querySelector('[name="bed_no"]').value;
        const description = document.querySelector('[name="description"]').value;
        PatientsInfo.hospitalId = hospitalId;
        PatientsInfo.images = images;
        PatientsInfo.name = name;
        PatientsInfo.age = age;
        PatientsInfo.bed_no = bed_no;
        PatientsInfo.description = description;
        var updateDataUrl = this.apiUrl + "/" + hospitalId + "/patients/" + id;
        axios.put(updateDataUrl, PatientsInfo)
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
                   window.location.href = '../hospital/index.html'; 
               },2000);
               
           }
       })
       return false;
    },

    /*
        Add Validate
    */
  validateFormEdit: function () {
    var validator = new Validator(
      document.querySelector("#edit-hospital-form"),
      function (err, res) {
        //res trả về trạng thái xem có thành công không
        //console.log(res);
        if (res === true) {
          SystemCore.editPatients();
        }
        return false;
      },
      {
        // thêm rules check ảnh
        rules: {
          checkImgUrl: function (value, params) {
            //console.log(value);
            // sử dụng pattend để check ảnh
            return /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(value);
          },
          checkNumber: function (value) {
            return (/^[1-9][0-9]*$/).test(value);
          },
        },
        messages: {
          en: {
            required: {
              empty: "Không được để trống - vui lòng nhập thông tin - vui lòng nhập lại",
              incorrect: "Thông tin bạn nhập vào không chính xác - vui lòng nhập lại",
            },
            minlength: {
              empty: "Hãy nhập tối thiếu trên {0} ký tự - vui lòng nhập lại",
              incorrect: "Bạn đã nhập ít hơn {0} ký tự - vui lòng nhập lại",
            },
            checkImgUrl: {
              empty: "Nhập đường dẫn ảnh - vui lòng nhập lại",
              incorrect: "Đường dẫn ảnh không đúng định dạng - vui lòng nhập lại",
            },
            integer: {
              empty: "Nhập vào giá trị là số - vui lòng nhập lại",
              incorrect: "Giá trị bạn nhập vào không phải là số - vui lòng nhập lại",
            },
            checkNumber: {
              empty: "Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại",
              incorrect: "Chỉ có thể bắt đầu bắng số 1, vui lòng nhập lại",
            },
          },
        },
      }
    );
  },

    removePratiens: function(removeId) {

        const urlParams = new URLSearchParams(window.location.search);
        const idtest = urlParams.get("id");
        
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
                    // Gửi request lên mockapi để lấy thông tin khách sạn về
                    const deleteData = this.apiUrl + "/" + idtest + "/patients/" + removeId;
                    console.log('deleteData: ', deleteData);
                    
                    axios.delete(deleteData)
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


                                                    /***** MORE INFO ******/



    morInfo: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        const  hospitalId = urlParams.get("hospitalId");
        const getDataUrl = this.apiUrl + "/" + hospitalId + "/patients/" + id;
        console.log('getDataUrl: ', getDataUrl);

        axios.get(getDataUrl)
      // Trả về dữ liệu
      .then((response) => {
        if (response.statusText === "OK") {
            // Xóa tất cả thể có trong DOM id = target
            document.querySelector("tbody").innerHTML = "";
            // Gán biến data
            var data = response.data;
            var content = "";
              content = `<tr>
                            <th scope="row">Hình ảnh</th>
                            <td>
                                <img src="${data.images}" width = "200" height = "250">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Tên bệnh nhân</th>
                            <td>${data.name}</td>
                        </tr>
                        <tr>
                            <th scope="row">Tuổi bệnh nhân</th>
                            <td>${data.age}</td>
                        </tr>
                        <tr>
                            <th scope="row">Số giường</th>
                            <td>${data.bed_no}</td>
                        </tr>
                        <tr>
                            <th scope="row">Bệnh án</th>
                            <td>${data.description}</td>
                        </tr>`;
            // Gán thẻ li vào DOM có id = target
            document.querySelector("tbody").innerHTML = content;
          }
        
      });
    
        
      },

                                                    /***** MORE INFO ******/

      hospitalInfo: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const  hospitalId = urlParams.get("hospitalId");
        const getDataUrl = this.apiUrl + "/" + hospitalId;

        axios.get(getDataUrl)
      // Trả về dữ liệu
      .then((response) => {
        if (response.statusText === "OK") {
            // Xóa tất cả thể có trong DOM id = target
            document.querySelector("#hospitalInfo").innerHTML = "";
            // Gán biến data
            var data = response.data;
            var content = "";
              content = `<a class="nav-link" href="index.html">Bệnh viện: ${data.name}</a>`;
            // Gán thẻ li vào DOM có id = target
            document.querySelector("#hospitalInfo").innerHTML = content;
          }
        
      });
    
        
      },

};
