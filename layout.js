// ./stores/login.js

let _user = {};

LoginStore = Reflux.createStore({
    init() {
        this.listenTo(LoginAction.Login, 'onLogin');
    },

    fetchUser() {
        let curUser = sessionStorage.getItem('user');

        if (curUser) {
            _user = JSON.parse(curUser);
            this.trigger(_user);
        } else {
            this.trigger(null);  
        }
    },
    
    onLogin(userData) {
        fetch.post('/login', userData)
        .then((err, res) => {
            if (res.status != 401){
                _user = res.body;
                sessionStorage.setItem('user', JSON.stringify(_user));
                this.trigger(_user);
            } else {
                this.trigger(null);  
            }
        });
    }
});

LoginStore.getUser = function() {
    return sessionStorage.getItem('user');
}

Layout = React.createClass({
    mixins: [
        Reflux.listenTo(LoginStore, 'onLogin')
    ],

    getInitialState() {
        return { user: null };
    },

    onLogin(userData) {
        this.setState({curUser: userData})
    },

    componentDidMount() {
        LoginStore.fetchUser();
    },

    render() {
        return (
            <div>
                <Menu user={this.state.user} />
                {React.cloneElement(this.props.children), this.state}
                <Footer />
            </div>
        );
    }
});

const LoginComponent = React.createClass({
    handleSubmit(event) {
        if (this.validateForm(event.target.elements))
            LoginAction.Login(event.target.elements);
    },

    render() {
        return (
            <form action='post' path='./login'>
                <submit onSubmit={this.handleSubmit}>login</submit>
            </form>
        );
    }
});