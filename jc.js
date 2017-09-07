'use strict';

const // Home = require('./pages/home.jsx')
    , Login = require('./pages/login.jsx')
    , Register = require('./pages/register.jsx')
    , Issue = require('./pages/issue.jsx')
    , IssueEdit = require('./pages/issue_edit.jsx')
    , Issues = require('./pages/issues.jsx')
    , User = require('./pages/user.jsx')
    , NotFound = require('./pages/not_found.jsx')
    , Layout = require('./layout.js');

const reactRouter = require('react-router')
    , Router = reactRouter.Router
    , Route = reactRouter.Router
    , IndexRoute = reactRouter.IndexRoute
    , browserHistory = reactRouter.browserHistory;

const Routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Layout}>
            <Route path='register' component={Register}/>
            <Route path='login' component={Login}/>
            <Route path='issues' component={Issues}>
                <Route path='issues/:issueId' component={Issue}>
                    <Route path='issues/:issueId/edit' component={IssueEdit}/>
                </Route>
            </Route>
            <Route path='users/:userId' component={User}/>
        </Route>
    </Router>
);

'use strict';

const React = require('react');

const AuthAction = require('./actions/auth.js');

const Layout = React.createClass({
    componentDidMount() {
        AuthAction.fetchUser();
    }

    render() {
        return(
            <div>
                {
                    React.cloneElement(this.props.children, this.state)
                }
            </div>
        );
    }
});

module.exports = Layout;

/*          Description
**********************************************************/
import ProductActions from "./actions/products"
// const ProductActions = {
//   FetchProducts: Reflux.createAction("FetchProducts")
// };
import ProductStore from "./stores/products"
// import ProductActions from '../actions/products';

// const ProductStore = Reflux.createStore({

//   init() {
//     this.listenTo(
//       ProductActions.FetchProducts,
//       this.onFetchProducts
//     );
//   },

//   onFetchProducts(){
//     Request
//     .get('/products.json')
//     .end((err, res)=>{
//       if(err)
//         alert(err)
//       this.trigger(
//         JSON.parse(res.text)
//       );
//     });
//   }

// });

const Layout = React.createClass({
  mixins: [ Reflux.listenTo(ProductStore, 'onFetchProducts') ],

  onFetchProducts(data) { this.setState({ products: data }) },

  componentDidMount() {
    ProductActions.FetchProducts();
  },

  render() {
      return(
        { React.cloneElement(this.props.children, this.state) }
      );
  }
}

LoginAction = {
    Login: Reflux.createAction('Login');
}

LoginStore = Reflux.createStore({
    init() {
        this.listenTo(LoginAction.Login, 'onLogin')
    },

    onLogin(userData) {
        fetch.post('/login', userData)
        .then((err, res) => {
            if (res.status != 401){
                this.trigger(res.body);
            }else {
                // handle unauthorized   
            }
        });
    }
});

Layout = React.createClass({
    mixins: [
        Reflux.listenTo(LoginStore, 'onLogin')
    ],

    onLogin(userData) {
        this.setState({curUser: userData})
    }
})
