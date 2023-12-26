const User = require("../models/UserModel")
const UserVerification = require("../models/UserVerification")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
const UserResetPassword = require("../models/UserResetPassword")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {

        const { name, email, password, phone, address } = newUser

        try {

            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser !== null) {

                resolve({
                    code: 404,
                    success: false,
                    message: 'Email này đã tồn tại, vui lòng đăng ký bằng Email khác!',
                    data: []
                })

            }

            const hash = bcrypt.hashSync(password, 10)

            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
                verified: false,
                address
            })

            resolve({
                code: 200,
                success: true,
                message: 'Đăng ký thành công!',
                data: { createdUser }
            })

        } catch (e) {
            reject(e)
        }
    })
}
const loginUser = (userLogin) => {

    return new Promise(async (resolve, reject) => {

        const { email, password } = userLogin

        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser === null) {

                resolve({
                    code: 404,
                    success: false,
                    message: 'Email này không tồn tại, vui lòng đăng ký!'
                })

            } else {

                if (!checkUser.isAdmin) {

                    resolve({
                        code: 404,
                        success: false,
                        message: 'Bạn không có quyền để login!'
                    })
                }

                const comparePassword = bcrypt.compareSync(password, checkUser.password)

                if (!comparePassword) {
                    resolve({
                        code: 404,
                        success: false,
                        message: 'Sai mật khẩu. Vui lòng thử lại!'
                    })
                }

                const access_token = await generalAccessToken({
                    id: checkUser.id,
                    isAdmin: checkUser.isAdmin
                })

                const refresh_token = await generalRefreshToken({
                    id: checkUser.id,
                    isAdmin: checkUser.isAdmin
                })

                resolve({
                    code: 200,
                    success: true,
                    message: 'Đăng nhập thành công!',
                    data: {
                        access_token,
                        refresh_token
                    }
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {

    return new Promise(async (resolve, reject) => {

        try {

            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Không tìm thấy đối tượng để sửa!'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, { ...data }, { new: true },)

            resolve({
                code: 200,
                success: true,
                message: 'Sửa thành công!',
                data: updatedUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {

            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Không tìm thấy đối tượng để xóa!'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                code: 200,
                success: true,
                message: 'Xóa thành công!'
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyUser = async (ids) => {
    try {

        const result = await User.deleteMany({ _id: { $in: ids } });

        return {
            code: 200,
            success: true,
            message: 'Delete user success',
            result: result
        };

    } catch (e) {
        throw new Error('Error deleting users: ' + e.message);
    }
};
const getAllUser = (limit, page) => {

    return new Promise(async (resolve, reject) => {

        try {

            const totalUser = await User.count();
            let allUser = [];

            if (!limit) {
                allUser = await User.find()
                    .select('-image -password');


            } else {

                const skip = (page - 1) * limit;

                allUser = await User.find()
                    .limit(limit)
                    .skip(skip)


            }

            resolve({
                code: 200,
                success: true,
                message: 'Lấy danh sách User thành công!',
                data: allUser,
                total: totalUser,
                pageCurrent: Number(page),
                totalPage: limit ? Math.ceil(totalUser / limit) : 1,
            });

        } catch (e) {
            reject(e);
        }
    });
};
const getAllUserSearch = ({ limit, page, type, key }) => {
    console.log("🚀 ~ file: UserService.js:237 ~ getAllUserSearch ~ key:", key)
    console.log("🚀 ~ file: UserService.js:237 ~ getAllUserSearch ~ type:", type)

    return new Promise(async (resolve, reject) => {
        try {
          
            let allUser = [];
            let allUserLength = [];
            if (!limit || !page) {
                if (!type || !key) {
                    allUserLength = await User.find()
                    allUser = await User.find()
    
    
                } else {
                    let query = {};
                    // Sử dụng biểu thức chính quy để tạo điều kiện tìm kiếm gần đúng
                    query[`${type}`] = { $regex: key, $options: 'i' };
                    allUser = await User.find(query).select('-_id -password -isAdmin -verified -createdAt -updatedAt');
                    allUserLength = await User.find(query)
                }
            }else{
                const skip = (page - 1) * limit;
                if (!type || !key) {
                    allUserLength = await User.find()
                    allUser = await User.find().skip(skip).limit(limit);
    
    
                } else {
                    let query = {};
                    // Sử dụng biểu thức chính quy để tạo điều kiện tìm kiếm gần đúng
                    query[`${type}`] = { $regex: key, $options: 'i' };
                    allUser = await User.find(query).skip(skip).limit(limit);
                    allUserLength = await User.find(query)
                }
            }
           


          
            resolve({
                code: 200,
                success: true,
                message: 'Lấy danh sách User thành công!',
                data: allUser,
                total: allUserLength.length,
                pageCurrent: Number(page),
                totalPage: limit ? Math.ceil(allUserLength.length / limit) : 1,
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {

            const user = await User.findOne({
                _id: id
            }).select('-password');

            if (user === null) {

                resolve({
                    code: 404,
                    success: false,
                    message: 'Không tìm thấy người dùng!'
                })
            }

            resolve({
                code: 200,
                success: true,
                message: 'Lấy thông tin người dùng thành công!',
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}
const updatePasswordService = (userId, data) => {

    return new Promise(async (resolve, reject) => {

        try {

            const user = await User.findOne({ _id: userId });

            if (!user) {

                resolve({
                    code: 404,
                    success: false,
                    message: 'Người dùng không tồn tại'
                })
            }

            const isCurrentPassword = await bcrypt.compare(data.newPassword, user.password);

            if (isCurrentPassword) {

                resolve({
                    code: 404,
                    success: false,
                    message: 'Mật khẩu mới không được giống mật khẩu hiện tại!'
                })

            } else {
                const saltRounds = 10

                let hashedNewPassword = await bcrypt.hash(data.newPassword, saltRounds)

                const updatePassword = User.updateOne({ _id: userId }, { password: hashedNewPassword }).then().catch((error) => {
                    console.log('Có lỗi khi update mật khẩu mới!', error)
                    resolve({
                        code: 500,
                        success: false,
                        message: 'Có lỗi khi update mật khẩu mới!'
                    })
                })
                if (updatePassword) {

                    resolve({
                        code: 200,
                        success: true,
                        message: 'Đổi mật khẩu thành công!'
                    })

                } else {

                    resolve({
                        code: 500,
                        success: false,
                        message: 'Có lỗi khi update mật khẩu mới!'
                    })

                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
const exportExcel = () => {
    return new Promise(async (resolve, reject) => {

        try {

            const totalUser = await User.count();

            let allUser = [];

            allUser = await User.find();

            resolve({
                code: 200,
                success: true,
                message: 'Lấy danh sách User thành công!',
                data: allUser,
                total: totalUser,
            });

        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    updatePasswordService,
    getAllUserSearch,
    exportExcel
}