

const vm = new Vue({
    el: '#loginSection',
    data: {
        user: "",
        pass: ""
    },
    methods:{
        login: function(user, pass){
            console.log(user + ' ' + pass);
            window.location.href = '/admin_menu';
        }

    }
})