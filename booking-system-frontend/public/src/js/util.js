$(document).ready(() => {
(function(ns) {

var Util = ns.Util = {
    url_prefix: 'http://localhost:8080',

    ajax_PUT: (url, putData, cb_done, cb_fail) => {
        $.ajax({
            headers: {
                'x-access-token': (localStorage.getItem('x-access-token') || '')
            },
            type: 'PUT',
            url: Util.url_prefix + url,
            crossdomain: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(putData),
            dataType: 'json'
        })
        .done((data, textStatus, jqXHR) => {
            cb_done(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            cb_fail(textStatus);
        });
    },

    ajax_POST: (url, postData, cb_done, cb_fail) => {
        $.ajax({
            headers: {
                'x-access-token': (localStorage.getItem('x-access-token') || '')
            },
            type: 'POST',
            url: Util.url_prefix + url,
            crossdomain: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(postData),
            dataType: 'json'
        })
        .done((data, textStatus, jqXHR) => {
            cb_done(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            cb_fail(textStatus);
        });
    },

    ajax_GET: (url, cb_done, cb_fail) => {
        $.ajax({
            headers: {
                'x-access-token': (localStorage.getItem('x-access-token') || '')
            },
            type: 'GET',
            url: Util.url_prefix + url,
            crossdomain: true,
            dataType: 'json'
        })
        .done((data, textStatus, jqXHR) => {
            cb_done(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            cb_fail(textStatus);
        });
    },

    ajax_DELETE: (url, cb_done, cb_fail) => {
        $.ajax({
            headers: {
                'x-access-token': (localStorage.getItem('x-access-token') || '')
            },
            type: 'DELETE',
            url: Util.url_prefix + url,
            crossdomain: true,
            dataType: 'json'
        })
        .done((data, textStatus, jqXHR) => {
            cb_done(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            cb_fail(textStatus);
        });
    },

    config: () => {
        const token = localStorage.getItem('x-access-token') || null;
        if(token) {
            Util.ajax_POST('/users/authenticate', {}, (data) => {
                if(data.requestSucceed) {
                    $('.menuContainer').css('display', 'block');
                    $('.bookingFormContainer').css('display', 'block');
                    $('.menuContainer .userInfo .username').text(data.username);
                } else {
                    $('.loginFormContainer').css('display', 'block');
                }
            }, (err) => {
                $('.loginFormContainer').css('display', 'block');
            });
        } else {
            $('.loginFormContainer').css('display', 'block');
        }
    },
};

})(window.bookingSystem);
});
