const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const rabbitmqFunc = require('../config/rabbitmq')
const jwt = require('jsonwebtoken')
var XLSX = require("xlsx");
const path = require('path');

const createUser = async (req, res) => {
    try {

        const { name, email, password, phone,language } = req.body

        const regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

        const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;

        const isCheckEmail = regEmail.test(email)

        const isCheckPhone = phoneRegex.test(phone)

        if (!email || !password || !name || !phone) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
            })

        } else if (!isCheckEmail) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Kiểm tra định dạng Email!'
            })

        }

        else if (!isCheckPhone) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Kiểm tra lại định dạng Phone!'
            })

        }

        else if (password.length < 6) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mật khẩu không được nhỏ hơn 6 kí tự'
            });

        }

        const response = await UserService.createUser(req.body)

        if (response && response != undefined) {

            const messageData = {
                type: 'register',
                _id: response?.data?.createdUser?._id,
                email: response?.data?.createdUser?.email,
                language: language
            };

            rabbitmqFunc.send_msg(messageData)

            console.log(`Sent message: ${JSON.stringify(messageData)}`);
        }

        return res.status(response.code).json(response);

    } catch (e) {
        
        console.log('Có lỗi khi createUser', e);

        return res.status(500).json({
            code: 500,
            success: false,
            message: e + '',
        });
    }
}
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
            })
        }

        const response = await UserService.loginUser(req.body)

        const { ...newReponse } = response

        if (response?.data?.refresh_token) {

            res.cookie('refresh_token', response.data.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
        }

        return res.status(response.code).json({ ...newReponse })
    } catch (e) {

        console.log('Có lỗi khi loginUser', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e.message
        })
    }
}
const updateUser = async (req, res) => {
    try {

        const userId = req.params.id

        const data = req.body
       
        console.log('data', data)

        const { phone } = data.dataEdit

        const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;

        const isCheckPhone = phoneRegex.test(phone)

        if (!userId) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu cần vào đủ (userId)'
            })
        }
       
        if (!isCheckPhone) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Kiểm tra lại định dạng Phone!'
            })
        }

        const response = await UserService.updateUser(userId, data.dataEdit)

        return res.status(response.code).json(response)
    } catch (e) {

        console.log('err updateUser ', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e.message
        })
    }
}
const deleteUser = async (req, res) => {
    try {

        const userId = req.params.id

        if (!userId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu cần vào đủ (userId)'
            })
        }

        const response = await UserService.deleteUser(userId)

        return res.status(response.code).json(response)
    } catch (e) {

        console.log('co loi khi deleteUser', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e.message
        })
    }
}
const deleteMany = async (req, res) => {
    try {

        const ids = req.query.ids; // Đọc danh sách các ID từ query parameters

        if (!ids) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu cần chứa một mảng các userId'
            });
        }

        // Tách chuỗi IDs thành mảng và loại bỏ khoảng trắng
        const idArray = ids.split(',').map(id => id.trim());

        // Kiểm tra xem mảng có rỗng hoặc không
        if (idArray.length === 0 || idArray[0] === '') {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu cần chứa một mảng các userId'
            });
        }

        const response = await UserService.deleteManyUser(idArray);

        return res.status(response.code).json(response);
    } catch (e) {

        console.log('Có lỗi khi deleteMany', e);

        return res.status(500).json({
            code: 500,
            success: false,
            message: e.message
        });
    }
};
const getAllUser = async (req, res) => {
    try {
        const { limit, page } = req.query

        const response = await UserService.getAllUser(Number(limit) || null, Number(page) || 0)

        return res.status(response.code).json(response)

    } catch (e) {

        console.log('getAllUser err', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e + ''
        })
    }
}
const getAllUserSearch = async (req, res) => {
    try {

        const response = await UserService.getAllUserSearch(req.query)

        return res.status(response.code).json(response)

    } catch (e) {

        console.log('getAllUser err', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e + ''
        })
    }
}
const getDetailsUser = async (req, res) => {
    try {

        const userId = req.params.id

        if (!userId) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Yêu cầu đầy đủ userId!'
            })
        }

        const response = await UserService.getDetailsUser(userId)

        return res.status(response.code).json(response)
    } catch (e) {

        return res.status(500).json({
            code: 500,
            success: false,
            message: e + ''
        })
    }
}
const logoutUser = async (req, res) => {
    try {

        res.clearCookie('refresh_token')

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Đăng xuất thành công!'
        })

    } catch (e) {
        console.log('logoutUser', e)
        return res.status(500).json({
            code: 500,
            success: false,
            message: e + ''
        })
    }
}
const updatePassword = async (req, res) => {
    try {

        const token = req.headers.token;

        const accessToken = token.split(" ")[1];

        // Sử dụng Promise để chờ xác thực token
        const user = await new Promise((resolve, reject) => {

            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {

                if (err) {
                    console.log('Lỗi khi xác thực token:', err);

                    reject('Lỗi xác thực token');
                } else {
                    resolve(user);
                }
            });
        });

        const userId = user.id;

        const { newPassword, confirmNewPassword } = req.body

        if (!newPassword || !confirmNewPassword) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Yêu cầu nhập đủ dữ liệu đầu vào!'
            })
        } else if (newPassword.length < 6) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mật khẩu không được nhỏ hơn 6 kí tự'
            });
        }
        else if (newPassword !== confirmNewPassword) {

            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Nhập lại mật khẩu sai!'
            });
        }

        const response = await UserService.updatePasswordService(userId, req.body)

        return res.status(response.code).json(response)

    } catch (e) {
        console.log('Co loi trong viec updatePassword', e)
        return res.status(500).json({
            message: e + ''
        })
    }
}
const exportExcel = async (req, res) => {

    try {

        const response = await UserService.exportExcel();

        if (!response) {
            return res.status(400).json({
                message: "No data available for export."
            });
        }

        const data = response.data;

        const rows = data.map(user => [
            user.id || '',
            user.name || '',
            user.email || '',
            user.phone || '',
            user.address || '',
        ]);

        // Thêm header
        const headers = ['ID', 'Họ tên', 'Email', 'SĐT', 'Địa chỉ'];

        rows.unshift(headers);

        // Tạo worksheet, thêm data, bắt đầu từ ô A1
        const worksheet = XLSX.utils.aoa_to_sheet(rows, { origin: "A1" });

        const MAX_COLUMN_WIDTH = 1000;
        // Tính chiều rộng tối đa của mỗi cột
        const columnWidths = rows[0].map((_, colIndex) =>
            Math.min(
                MAX_COLUMN_WIDTH,
                rows.reduce((acc, row) => Math.max(acc, `${row[colIndex]}`.length), headers[colIndex].length)
            )
        );

        // Thêm chiều rộng cột vào worksheet
        worksheet['!cols'] = columnWidths.map(width => ({ wch: width }));

        // Tạo workbook và thêm worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
        // XLSX.writeFile(workbook, 'dataUser.xlsx'); 
        // Lưu file Excel vào memory buffer
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Set header Content-Disposition
        res.setHeader('Content-Disposition', 'attachment; filename=userData123.xlsx');
        // Set content type
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the Excel file as a response
        res.send(buffer);

        return res.status(200);
    } catch (error) {
        console.error('Export Excel ERR: ', error);
        return res.status(500).json({
            message: "Internal server error during Excel export."
        });
    }
};
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    logoutUser,
    deleteMany,
    updatePassword,
    getAllUserSearch,
    exportExcel
}
