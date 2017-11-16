<head>
  <style>
    body, form, ul {
      margin: 0px;
    }
    ul { padding: 0px; }
    li { text-decoration: none; }
    a {
      /*color: #0366d6;*/
      text-decoration: none;
      background-color: transparent;
    }
    .fixed-left {
      position: fixed;
      top: 24px;      
    }
    .clearfix:after {
      display: block;
      clear: both;
      content: "";
    }
    .float-left {
      float: left !important;
    }
    .float-right {
      float: right !important;
    }
    .position-relative {
      position: relative !important;
    }
    .text-right {
      text-align: right !important;
    }
    .display-table {
      display: table !important;
    }
    .display-inline {
      display: inline !important;
    }
    .display-block {
      display: block !important;
    }
    .text-gray {
      color: #586069 !important;
    }
    .container {
      max-width: 1012px;
      margin-top: 24px;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
    }
    .content {
      padding-left: 8px;
      width: 100%;
      box-sizing: border-box;
    }    
    
    /* ./_user-card.css */
    .user-card-xsm {
      padding-top: 8px;
      padding-bottom: 8px;
      width: 100%;
      border-bottom: 1px #e1e4e8 solid;   
    }
    .user-card-xsm__avatar {}
    .user-card-xsm__name {}
    /* ./_buttons.css */
    .btn-rm {}

    /* ./_usr-selector.css */
    .usr-selector {      
      
    }
    .usr-selector__selector { 
      border: 1px #e1e4e8 solid;
      border-radius: 3px;
      margin: 10px 10px 5px 10px;
      max-height: 250px;
    }
    .usr-selector__item:hover {
      background-color: #e1e4e8;
    }
    .usr-selector__selected {}

    /* ./_search-box.css */
    .search-box-sm {
      width: 100%;
      min-height: 34px;
      box-sizing: border-box;
      border-radius: 2px;
      font-size: 16px;
      padding-left: 25px;
      border: 1px #e1e4e8 solid;
      background-color: #fff;
      background-image: url('search-icon-sm.png');
      background-repeat: no-repeat;
      background-position: 5px 5px;
      font-size: 14px;
    }

  </style>
</head>
<body>
  <div class="container">
  <div class="content">
    <div class="usr-selector clearfix">
      <div class="usr-selector__selector float-left">
        <form>
          <input class="search-box-sm" type="search" placeholder="Search users..." autocomplete="off"></input>          
        </form>
        <ul >
          <li class= 'user-card-xsm usr-selector__item clearfix'>
            <img class = 'user-card-xsm__avatar float-left' 
              src = "./ava.png" width='45' height='45'></img>                  
            <div class='user-card-xsm__name float-left'>
              <a href="#">Dischain</a>
            </div>
          </li>
          <li class= 'user-card-xsm usr-selector__item clearfix'>
            <img class = 'user-card-xsm__avatar float-left' 
              src = "./ava.png" width='45' height='45'></img>                  
            <div class='user-card-xsm__name float-left'>
              <a href="#">Dischain</a>
            </div>
          </li>
          <li class= 'user-card-xsm usr-selector__item clearfix'>
            <img class = 'user-card-xsm__avatar float-left' 
              src = "./ava.png" width='45' height='45'></img>                  
            <div class='user-card-xsm__name float-left'>
              <a href="#">Dischain</a>
            </div>
          </li>
          <li class= 'user-card-xsm usr-selector__item clearfix'>
            <img class = 'user-card-xsm__avatar float-left' 
              src = "./ava.png" width='45' height='45'></img>                  
            <div class='user-card-xsm__name float-left'>
              <a href="#">Dischain</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="usr-selector__selected float-left">
        <div class="user-card-xsm clearfix">
          <img class = 'user-card-xsm__avatar float-left' 
            src = "./ava.png" width='45' height='45'></img>                  
          <div class='user-card-xsm__name float-left'>
            <a href="#">Dischain</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</body>
