$(document).ready(() => {
((ns) => {

var Events = ns.Events = {
    bookingFormData: {
        usage: '',
        type: ''
    },
    loginFormData: {},
    registerFormData: {},

    orderList: [],
    updateObject: {},
    updateIndex: null,

    validateBookingForm: () => {
        const formObjectArray = $('#bookingForm').serializeArray();
        let formObject = {}, success   = true;
        for(let i = 0; i < formObjectArray.length; i++) {
            formObject[formObjectArray[i].name] = formObjectArray[i].value;
            if($.trim(formObjectArray[i].value) === '') {
                success = false;
                $('.form-control[name="' + formObjectArray[i].name + '"]').parent().removeClass('has-success');
                $('.form-control[name="' + formObjectArray[i].name + '"]').parent().addClass('has-error');
                $('.form-control[name="' + formObjectArray[i].name + '"]').siblings('.form-control-feedback.glyphicon-ok').css('display', 'none');
                $('.form-control[name="' + formObjectArray[i].name + '"]').siblings('.form-control-feedback.glyphicon-remove').css('display', 'block');
            }
        }

        if (Events.bookingFormData.usage === '') {
            success = false;
            $('.usageBtn').css({
                'border-color': 'rgb(178,78,75)',
                'color': 'rgb(178,78,75)'
            });
        }

        if (Events.bookingFormData.type === '') {
            success = false;
            $('.typeBtn').css({
                'border-color': 'rgb(178,78,75)',
                'color': 'rgb(178,78,75)'
            });
        }

        Events.bookingFormData.principal = formObject.principal;
        Events.bookingFormData.department = formObject.department;
        Events.bookingFormData.title = formObject.title;
        Events.bookingFormData.content = formObject.content;
        Events.bookingFormData.deadline_design = formObject.deadline_design + ' ' + formObject.time_design;
        Events.bookingFormData.deadline_it = formObject.deadline_it + ' ' + formObject.time_it;

        return success;
    },

    validateLoginForm: () => {
        if(Events.loginFormData.username !== '' && Events.loginFormData.password !== '') return true;
        return false;
    },

    validateRegisterForm: () => {
        if(Events.registerFormData.username !== '' && (Events.registerFormData.password === Events.registerFormData.passwordRepeat)) return true;
        return false;
    },

    mountEventListeners: () => {
        // Trigger bootstrap-datepicker
        $('.form-horizontal .input-group.date').datepicker({});

        // Show form-control feedbacks
        $('.has-feedback .form-control').blur((e) => {
            if($(e.target).val() !== '') {
                $(e.target).parent().removeClass('has-error');
                $(e.target).parent().addClass('has-success');
                $(e.target).siblings('.form-control-feedback.glyphicon-remove').css('display', 'none');
                $(e.target).siblings('.form-control-feedback.glyphicon-ok').css('display', 'block');
            } else {
                $(e.target).parent().removeClass('has-success');
                $(e.target).parent().addClass('has-error');
                $(e.target).siblings('.form-control-feedback.glyphicon-ok').css('display', 'none');
                $(e.target).siblings('.form-control-feedback.glyphicon-remove').css('display', 'block');
            }
        });

        // Dropdown selection
        $('.bookingFormContainer .formDropDown ul li').on('click', (e) => {
            e.preventDefault();
            const selectedText = $(e.target).text();
            $(e.target).parent().siblings('button').text(selectedText).append('<span class="caret"></span>');
            $(e.target).parent().siblings('button').css({
                'border-color': 'rgb(68,129,70)',
                'color': 'rgb(68,129,70)'
            });
            Events.bookingFormData[$(e.target).parent().siblings('button').val()] = selectedText;
        });

        // Submit booking form
        $('#formSubmitBtn').on('click', (e) => {
            e.preventDefault();
            if(Events.validateBookingForm()) {
                ns.Util.ajax_POST('/orders/h5', Events.bookingFormData, (data) => {
                    if(data.requestSucceed) {
                        Events.showAlertModal('创建成功', '订单创建成功！你可以点击左上角菜单里的管理订单来管理！');
                    } else {
                        Events.showAlertModal('创建失败', data.message);
                    }
                }, (err) => {
                    Events.showAlertModal('创建失败', '抱歉！服务器出了一些问题！');
                });
            }
        });

        // Login in
        $('.loginFormContainer .loginBtn').click((e) => {
            const userDataArray = $('#loginForm').serializeArray();
            for(let i = 0; i < userDataArray.length; i++) {
                Events.loginFormData[userDataArray[i].name] = userDataArray[i].value;
            }

            if(Events.validateLoginForm()) {
                ns.Util.ajax_POST('/users/login', Events.loginFormData, (data) => {
                    if(data.requestSucceed) {
                        Events.hideLoginPage();
                        Events.showBookingPage();
                        localStorage.setItem('x-access-token', data.token);
                        $('.menuContainer .userInfo .username').text(data.username);
                    }
                }, (err) => {
                    Events.showAlertModal('信息错误！', '用户名或密码错误，请重新输入！');
                });
            }
        });

        // Switch to register form in the login form
        $('.loginFormContainer .registerText').click((e) => {
            Events.hideLoginPage();
            Events.showRegisterPage();
        });

        // Register
        $('.registerFormContainer .registerBtn').click((e) => {
            const userDataArray = $('#registerForm').serializeArray();
            for(let i = 0; i < userDataArray.length; i++) {
                Events.registerFormData[userDataArray[i].name] = userDataArray[i].value;
            }
            if(Events.validateRegisterForm()) {
                ns.Util.ajax_POST('/users/register', {
                    username: Events.registerFormData.username,
                    password: Events.registerFormData.password
                }, (data) => {
                    Events.showAlertModal('注册成功', '账号注册成功，请登录！');
                    Events.hideRegisterPage();
                    Events.showLoginPage();
                }, (err) => {
                    Events.showAlertModal('注册失败', '服务器错误啦！请稍后重试！');
                });
            } else {
                Events.showAlertModal('信息有误', '您输入的信息错误，请检查后重新输入！');
            }
        });

        // Switch to login form in the register form
        $('.registerFormContainer .loginText').click((e) => {
            Events.showLoginPage();
            Events.hideRegisterPage();
        });

        $('#logoutBtn').click((e) => {
            ns.Util.ajax_POST('/users/logout', {}, (data) => {
                if(data.requestSucceed) {
                    localStorage.removeItem('x-access-token');
                    Events.hideBookingPage();
                    Events.hideHistoryPage();
                    Events.showLoginPage();
                }
            }, (err) => {
                Events.showAlertModal('注销失败', '抱歉！服务器出了一点问题！');
            });
        });

        $('#menu_create').on('click', (e) => {
            Events.hideHistoryPage();
            Events.showBookingPage();
            $('.menu button').text('创建新订单').append('<span class="caret"></span>');
        });

        $('#menu_history').on('click', (e) => {
            Events.hideBookingPage();
            Events.showHistoryPage();
            $('.menu button').text('管理订单').append('<span class="caret"></span>');
        });

        $('#updateBtn').click((e) => {
            $('#updateModal').modal('hide');
            Events.updateObject.title = $('#updateModal .form-control[name="title"]').val();
            Events.updateObject.content = $('#updateModal .form-control[name="content"]').val();
            Events.updateObject.deadline_it = $('#updateModal .form-control[name="deadline_it"]').val();
            Events.updateObject.deadline_design = $('#updateModal .form-control[name="deadline_design"]').val();

            ns.Util.ajax_PUT('/orders/h5/' + Events.orderList[Events.updateIndex]._id, Events.updateObject, (data) => {
                if(data.requestSucceed) {
                    window.setTimeout(() => {
                        Events.showAlertModal('修改成功', '订单修改成功！');
                        Events.hideHistoryPage();
                        Events.showHistoryPage();
                    }, 500);
                } else {
                    Events.showAlertModal('修改失败', data.message);
                }
            }, (err) => {
                Events.showAlertModal('修改失败', '抱歉！服务器出了一点问题！');
            });
        });

        $('#deleteBtn').click((e) => {
            $('#updateModal').modal('hide');

            ns.Util.ajax_DELETE('/orders/h5/' + Events.orderList[Events.updateIndex]._id, (data) => {
                if(data.requestSucceed) {
                    window.setTimeout(() => {
                        Events.showAlertModal('删除成功', '订单删除成功！');
                        Events.hideHistoryPage();
                        Events.showHistoryPage();
                    }, 500);
                }else {
                    Events.showAlertModal('删除失败', data.message);
                }
            }, (err) => {
                    Events.showAlertModal('删除失败', '抱歉！服务器出了一点问题！');
            });
        });
    },

    showAlertModal: (title, body) => {
        $('#alertModal .modal-title').text(title);
        $('#alertModal .modal-body').text(body);
        $('#alertModal').modal('show');
    },

    showAllOrders: () => {
        ns.Util.ajax_GET('/orders/h5', (data) => {
            Events.orderList = data.orders;

            for(let i = 0; i < data.orders.length; i++) {
                const orderName = $('<span>' + data.orders[i].title + '</span>');
                const modifyBtn = $('<button type="button" class="btn btn-default modifyOrderBtn" data-index="' + i.toString() + '">修改订单</button>');
                const orderItem = $('<li class="list-group-item"></li>');
                orderName.appendTo(orderItem);
                modifyBtn.appendTo(orderItem);
                orderItem.appendTo($('.historyContainer .list-group'));
            }
            $('.modifyOrderBtn').on('click', (e) => {
                Events.showUpdateModal(e.target.dataset.index);
            });
        }, (err) => {
            Events.showAlertModal('发生错误', '抱歉！服务器出了一点问题！');
        });
    },

    showUpdateModal: (index) => {
        Events.updateIndex = index;
        $('#updateModal .form-control[name="principal"]').val(Events.orderList[index].principal);
        $('#updateModal .form-control[name="department"]').val(Events.orderList[index].department);
        $('#updateModal .form-control[name="title"]').val(Events.orderList[index].title);
        $('#updateModal .form-control[name="content"]').val(Events.orderList[index].content);
        $('#updateModal .form-control[name="deadline_it"]').val(Events.orderList[index].deadline_it);
        $('#updateModal .form-control[name="deadline_design"]').val(Events.orderList[index].deadline_design);
        $('#updateModal .formDropDown button[value="usage"]').text(Events.orderList[index].usage).append('<span class="caret"></span>');
        $('#updateModal .formDropDown button[value="type"]').text(Events.orderList[index].type).append('<span class="caret"></span>');

        $('#updateModal .formDropDown ul li').on('click', (e) => {
            e.preventDefault();
            const selectedText = $(e.target).text();
            $(e.target).parent().siblings('button').text(selectedText).append('<span class="caret"></span>');
            Events.updateObject[$(e.target).parent().siblings('button').val()] = selectedText;
        });
        $('#updateModal').modal('show');
    },

    showLoginPage: () => {
        $('.loginFormContainer').css('display', 'block');
        $('.loginFormContainer .form-control').val('');
    },
    hideLoginPage: () => {
        $('.loginFormContainer').css('display', 'none');
    },
    showRegisterPage: () => {
        $('.registerFormContainer').css('display', 'block');
        $('.registerFormContainer .form-control').val('');
    },
    hideRegisterPage: () => {
        $('.registerFormContainer').css('display', 'none');
    },
    showBookingPage: () => {
        $('.menuContainer').css('display', 'block');
        $('.bookingFormContainer').css('display', 'block');
        $('.bookingFormContainer .form-control').val('');
    },
    hideBookingPage: () => {
        $('.menuContainer').css('display', 'none');
        $('.bookingFormContainer').css('display', 'none');
    },
    showHistoryPage: () => {
        $('.menuContainer').css('display', 'block');
        $('.historyContainer').css('display', 'block');
        $('.historyContainer .list-group').empty();
        Events.showAllOrders();
    },
    hideHistoryPage: () => {
        $('.menuContainer').css('display', 'none');
        $('.historyContainer').css('display', 'none');
    }
};

})(window.bookingSystem);
});
