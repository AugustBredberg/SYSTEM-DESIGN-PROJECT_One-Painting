const vm = new Vue({
    el: '#login',
    data: {
        uname: ""
        pword: ""
    },
    methods: {
        submitLogin(uname, pword){
            console.log(uname + ' and ' + pword);
        }
    }
}