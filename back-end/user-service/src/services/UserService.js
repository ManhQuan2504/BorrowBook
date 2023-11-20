const User = require("../models/UserModel")
const UserVerification = require("../models/UserVerification")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
// const EmailService = require("../services/EmailService")
const amqplib = require('amqplib');
const UserResetPassword = require("../models/UserResetPassword")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone ,address} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Email này đã tồn tại, vui lòng đăng ký bằng Email khác!',
                    data:[]
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
               data:{ createdUser}
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

                // if (!checkUser.verified) {
                //     resolve({
                //         code: 404,
                //         success: false,
                //         message: 'Người dùng chưa được xác minh vui lòng vào Email để xác nhận trước!'
                //     })
                // }
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
                   data:{ access_token,
                    refresh_token}
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

            const updatedUser = await User.findByIdAndUpdate(id,{...data} , { new: true },)
         
        
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


const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            }).select('-password');
            if (user === null) {
                resolve({
                   code:404,
                   success:false,
                    message: 'Không tìm thấy người dùng!'
                })
            }
            
            resolve({
                code:200,
                success:true,
                message: 'Lấy thông tin người dùng thành công!',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}
const verifyEmailSignUpService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserVerification.find({
                userId: data.userId
            })
            if (!result) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Bản ghi tài khoản không tòn tại hoặc đã được xác minh!'
                })
            } else {
                if (result.length > 0) {
                    const { expiresAt } = result[0]
                    const hashedUniqueString = result[0].uniqueString
                    if (expiresAt < Date.now()) {
                        UserVerification.deleteOne({ userId: data.userId })
                            .then(() => {
                                resolve({
                                    code: 401,
                                    success: false,
                                    message: 'Đã hết hạn, yêu cầu đăng ký lại để nhận xác nhận mới từ Email!'

                                })
                            })
                            .catch(
                                (error) => {
                                    console.log('Đã xảy ra lỗi khi UserVerification.deleteOne', error)
                                    resolve({
                                        code: 500,
                                        success: false,
                                        message: 'Đã xảy ra lỗi khi UserVerification.deleteOne'

                                    })
                                })
                    } else {
                        bcrypt.compare(data.uniqueString, hashedUniqueString)
                            .then(() => {
                                User.updateOne({ _id: data.userId }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ userId: data.userId })
                                            .then(() => {
                                                resolve({
                                                    code: 200,
                                                    success: true,
                                                    message: 'Hoàn tất kiểm tra, bạn đã đăng ký thành công!'

                                                })
                                            })
                                            .catch(
                                                (error) => {
                                                    console.log('Đã xảy ra lỗi khi UserVerification.deleteOne', error)
                                                    resolve({
                                                        code: 500,
                                                        success: false,
                                                        message: 'Đã xảy ra lỗi khi UserVerification.deleteOne'

                                                    })
                                                })
                                    })
                                    .catch((error) => {
                                        console.log('Đã xảy ra lỗi khi User.updateOne', error)
                                        resolve({
                                            code: 500,
                                            success: false,
                                            message: 'Đã xảy ra lỗi khi User.updateOne!'

                                        })
                                    })
                            })
                            .catch((error) => {
                                console.log('Đã xảy ra lỗi khi giải mã dữ liệu uniqueString!', error)
                                resolve({
                                    code: 500,
                                    success: false,
                                    message: 'Đã xảy ra lỗi khi giải mã dữ liệu uniqueString!'

                                })
                            })
                    }
                } else {
                    resolve({
                        code: 401,
                        success: false,
                        message: 'Bản ghi tài khoản không tồn tại hoặc đã được xác minh!'
                    })
                }



            }

        } catch (e) {
            reject(e)

            // resolve({
            //     status: 'OK',
            //     message: 'SUCCESS',
            //     data: user
            // })
        }
    })
}
const resetPasswordService = (email) => {
    return new Promise(async (resolve, reject) => {
        try {

            const user = await User.findOne({
                email: email
            })
            if (user === null) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Email không tồn tại trong hệ thống, vui lòng đăng ký!'
                })
            }
            else {
                // let responseSendEmailResetPassword = await EmailService.sendEmailResetPassword(user._id, user.email)

                // resolve({
                //     code: responseSendEmailResetPassword.code,
                //     success: responseSendEmailResetPassword.success,
                //     message: responseSendEmailResetPassword.message
                // })
            }

        } catch (e) {
            reject(e)
        }
    })
}
const verifyResetPasswordService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const result = await UserResetPassword.find({
                userId: data.userId

            })
            if (!result) {
                resolve({
                    code: 404,
                    success: false,
                    message: 'Bản ghi tài khoản không tồn tại hoặc đã được xác minh!'
                })
            } else {
                if (result.length > 0) {
                    const { expiresAt } = result[0]
                    const hashedResetString = result[0].resetString
                    if (expiresAt < Date.now()) {
                        UserResetPassword.deleteOne({ userId: data.userId })
                            .then(() => {
                                resolve({
                                    code: 401,
                                    success: false,
                                    message: 'Đã hết hạn, bạn hãy reset lại mật khẩu và nhận link mới từ Email!'

                                })
                            })
                            .catch(
                                (error) => {
                                    console.log('Đã xảy ra lỗi khi UserResetPassword.deleteOne', error)
                                    resolve({
                                        code: 500,
                                        success: false,
                                        message: 'Đã xảy ra lỗi khi UserResetPassword.deleteOne'

                                    })
                                })
                    } else {
                        bcrypt.compare(data.resetString, hashedResetString)
                            .then(() => {
                                UserResetPassword.deleteOne({ userId: data.userId })
                                    .then(() => {
                                        resolve({
                                            code: 200,
                                            success: true,
                                            message: 'Bạn có thể hiện form cập nhật mật khẩu mới!',
                                            data: { userId: data.userId }
                                        })
                                    })
                                    .catch(
                                        (error) => {
                                            console.log('Đã xảy ra lỗi khi UserVerification.deleteOne', error)
                                            resolve({
                                                code: 500,
                                                success: false,
                                                message: 'Đã xảy ra lỗi khi UserVerification.deleteOne'
                                            })
                                        })


                            })
                            .catch((error) => {
                                console.log('Đã xảy ra lỗi khi giải mã dữ liệu resetString!', error)
                                resolve({
                                    code: 500,
                                    success: false,
                                    message: 'Đã xảy ra lỗi khi giải mã dữ liệu resetString!'

                                })
                            })
                    }
                } else {
                    resolve({
                        code: 404,
                        success: false,
                        message: 'Bản ghi tài khoản không tồn tại hoặc đã được xác minh!'

                    })
                }


            }

        } catch (e) {
            reject(e)


        }
    })
}
const updatePasswordService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({_id : data.userId});
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
            }else{
                const saltRounds = 10
                let hashedNewPassword = await  bcrypt.hash(data.newPassword, saltRounds)
               
    
                const updatePassword =  User.updateOne({ _id: data.userId }, { password: hashedNewPassword }).then().catch((error)=>{
                   console.log('Có lỗi khi update mật khẩu mới!',error)
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
                }else{
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

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    verifyEmailSignUpService,
    resetPasswordService,
    verifyResetPasswordService,
    updatePasswordService
}