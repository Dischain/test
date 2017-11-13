    /*Убрать color: #0366d6; из <a>-тега и переместить в votation-data__name*/
    /************************************************************************************************/
    .votations-filter { /*./components/_votations-filter.css*/
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px #e1e4e8 solid;
    }
    
    .votations-filter__sb-wrapper {
      padding-right: 24px;
      width: 99%;
      display: table-cell;
      white-space: nowrap;
    }
    .votations-filter__controls-wrapper {
      display: table-cell;
      width: 1%;
      position: relative;
      white-space: nowrap;
    }
   
    .search-box { /*./components/_search-box.css*/
      width: 100%;
      min-height: 34px;
      box-sizing: border-box;
      border-radius: 2px;
      font-size: 16px;
      padding-left: 25px;
      border: 1px solid #6CC0E5;
      background-color: #fff;
      background-image: url('search-icon-sm.png');
      background-repeat: no-repeat;
      background-position: 5px 5px;
    }
    .select-list { /*./compoenents/_select-list.css*/
      border: 1px solid #6CC0E5;
      background: transparent;
      border-radius: 3px;
      width: auto;
      padding: 5px 10px 5px 5px;
      font-size: 16px;
      height: 34px;
    }
    .votations-btn {
      padding: 7px;
      margin-left: 16px;
      color: #6CC0E5;
      border: 1px solid #6CC0E5;
      border-radius: 3px;
      text-decoration: none;
      user-select: none;
      display: inline-block;
    }
    .votations-btn:hover {
      color: white;
      background-color: #6CC0E5;
    }
    .btn {
      padding: 7px;
      margin-left: 16px;
      color: #6CC0E5 !important;
      border: 1px solid #6CC0E5;
      border-radius: 3px;
      text-decoration: none;
      user-select: none;
      display: inline-block;
    }

    .btn:hover {
      color: white;
      background-color: #6CC0E5;
      cursor: pointer;
    }
    /************************************************************************************************/
  </style>
</head>
<body>
  <div class="container clearfix">   
    <div class="content float-left">
      <div class="position-relative">
        <!--Votations Filter Start-->
        <div class="votations-filter">
          <form class="display-table">
            <div class="votations-filter__sb-wrapper">
              <input class="search-box" type="search" placeholder="Search votations..." autocomplete="off"></input>
            </div>
            <div class="votations-filter__controls-wrapper text-right">
              <select class="select-list">
                <option value="All">All</option>
                <option value="Owner">Owner</option>
                <option value="Participated">Participated</option>
              </select>
              <div class="btn">
                <a >New</a>
              </div>
            </div>            
          </form>
        </div>
        <!--Votations Filter End-->        
      </div>
    </div>
  </div>
</body>
