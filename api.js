var api = new function () {
    var client = new WindowsAzure.MobileServiceClient('https://meeting123.azure-mobile.net/', 'gKyCtDJScHMidfRKbchyvKVIWsMZkC79'),
            users = client.getTable('Users');
    this.auth = function (email, password, success, error) {
        var query = users.where({email_id: email, password: password});
        query.read().then(
                function (todoItems) {
                    if (todoItems.length > 0) {
                        success();
                        console.log('auth sucsess');
                    } else {
                        error();
                        console.log('auth fail');
                    }
                },
                function () {
                    alert('Not able to connect to server');
                });
    },
    this.signup = function (data,success) {
        var result = users.insert({first_name: data.fname, last_name: data.lname, email_id: data.email, password: data.password});
        localStorage.setItem('email',data.email);
        localStorage.setItem('password',data.password);
        success();
    },
    this.login = function (data,success,error){
        if(api.is_login()){
            console.log('already logedin');
            success();
            return false;
        }
        api.auth(data.email,data.password,
        function (){
            localStorage.setItem('email',data.email);
            localStorage.setItem('password',data.password);
            success();
        },
        function (){
            error()
        });
    },
    this.is_login = function (){
        return localStorage.getItem('email')!== null ? (localStorage.getItem('password')!== null ? true : false):false;
    },
    this.create_meeting = function  (data,success,error) {
        var client = new WindowsAzure.MobileServiceClient('https://meeting123.azure-mobile.net/', 'gKyCtDJScHMidfRKbchyvKVIWsMZkC79'),
                meeting = client.getTable('meeting_details');
        meeting.insert(data).then(success,error);
    },
    this.meeting_list = function (success, error) {
        var client = new WindowsAzure.MobileServiceClient('https://meeting123.azure-mobile.net/', 'gKyCtDJScHMidfRKbchyvKVIWsMZkC79'),
                meeting = client.getTable('meeting_details');
        var query = meeting.where({ complete: false });
        query.read().then(
                function (todoItems) {
                    if (todoItems.length > 0) {
                        success(todoItems);
                        console.log('list sucsess');
                    } else {
                        error();
                        console.log('list fail');
                    }
                },
                function () {
                    alert('Not able to connect to server');
                });
    }
}
