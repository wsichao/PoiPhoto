<template>
  <div class="container">
    <div class="stable" >
      <pie-chart class="arrange-v" ref="userOnline"></pie-chart>
      <bar-chart class="arrange-v" ref="interfaceTime"></bar-chart>
      <bar-chart class="arrange-v" ref="loadPageTime"></bar-chart>
    </div>
    <div class="change">
      <map-chart ref="map"></map-chart>
      <div class="mapDetail" v-show="showMapDetail">
        {{mapDetail}}
        <div class="close" v-on:click="showMapDetail=false"></div>
      </div>
      <div class="systemTitle" style="background: url(static/title.png);background-size: 100% 100%;"></div>
      <div class="jumpToDetail" style="background-image: url(static/jump.png);" title="跳转至详情页面" v-on:click="jumpToDetail"></div>
    </div>
    <div class="stable">
      <pie-chart class="arrange-v" ref="browser"></pie-chart>
      <bar-chart class="arrange-v" ref="interfaceError"></bar-chart>
      <div class="arrange-v" >
        <ul>
          <li><span>近一月接口错误总数：<span class="resultSpan">{{errorTotal}}</span></span></li>
          <li><span>近一月接口平均耗时： <span class="resultSpan">{{averageTime}}</span></span></li>
          <li style="position:relative">
            <span>近一月异常人员数量：<span class="resultSpan" v-on:mouseover="showUserId=true" v-on:mouseleave="showUserId=false" style="text-decoration: underline;cursor: pointer;">{{errorUser}}</span></span>
            <div v-show="showUserId" class="errorTip"><span>错误用户ID：{{errorUserID}}</span></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import pieChart from './pieChart.vue';
  import barChart from './barChart.vue';
  import mapChart from './mapChart.vue';
  import { mapShow, userOnline, interfaceTime, loadPageTime, browser, interfaceError, staticList, detailList, queryErrorByLocation } from '../dataService/api';
  import { appUtil } from '../config';
  import { Utils } from '../common/js/utils.js';
  var self;
  export default {
    name: 'Main',
    data () {
      return {
        showUserId:false,
        errorTotal:0,
        averageTime:'无数据',
        errorUser:'无数据',
        errorUserID: '无数据',
        mapDetail: '',
        showMapDetail:false
      }
    },
    mounted:function(){
      
      this.$nextTick(()=>{
        self = this;

        initUserOnline();
        getLoadPageTime();
        getInterfaceTime();
        getBrowser();
        getInterfaceError();
        getStaticList();
        getMapShow();
      })
    },
    components: {
      pieChart,
      barChart,
      mapChart
    },
    methods: {
      jumpToDetail: jumpToDetail
    }
  }

  function initUserOnline(){
    userOnline().then(function(res){
      self.$refs.userOnline.init({
        content: {
          id: 'userOnlinePie',
          height:'30%',
          width: '85%',
          ref: 'userOnline'
        },
        option: {
          title: '用户在线、离线数统计',
          data: res.data
        }
      });
    })
  }

  function getInterfaceTime(){
    interfaceTime().then(function(res){

      var param = {
        content:{
          id: 'interfaceTimePie',
          height: '30%',
          width: '85%',
          ref: 'interfaceTime'
        },
        option: {
          title: '接口请求耗时TOP10省份',
          xAxis: [],
          data: []
        }
      }
      if(!res.errcode){
        res.data.forEach(function(ele){
          param.option.xAxis.push(ele.name);
          param.option.data.push(ele.value);
        })
      }

      self.$refs.interfaceTime.init(param);
    })
  }

  function getLoadPageTime(){
    loadPageTime().then(function(res){

      var param = {
        content:{
          id: 'loadPageTimePie',
          height: '30%',
          width: '85%',
          ref: 'loadPageTime'
        },
        option: {
          title: '页面渲染耗时TOP10省份',
          xAxis: [],
          data: []
        }
      }
      if(!res.errcode){
        res.data.forEach(function(ele){
          param.option.xAxis.push(ele.name);
          param.option.data.push(ele.value);
        })
      }

      self.$refs.loadPageTime.init(param);
    })
  }

  function getBrowser(){
    browser().then(function(res){
      res.data.forEach(function(ele){
        ele.name = ele.name.substring(ele.name.indexOf('/') + 1,ele.name.length)
      });
      self.$refs.browser.init({
        content: {
          id: 'browserPie',
          height:'30%',
          width: '85%',
          ref: 'browser'
        },
        option: {
          title: 'Chrome各版本使用占比',
          data: res.data,
          radius: ['0', '60%'],
          center: ['50%', '60%'],
          name: '',
          type:'pie',
          }
        });
      })
    }

  function getInterfaceError(){
    interfaceError().then(function(res){
      var param = {
        content:{
          id: 'interfaceErrorPie',
          height: '30%',
          width: '85%',
          ref: 'interfaceError'
        },
        option: {
          title: '接口错误统计TOP10省份',
          xAxis: [],
          data: []
        }
      }
      if(!res.errcode){
        res.data.forEach(function(ele){
          param.option.xAxis.push(ele.name);
          param.option.data.push(ele.value);
        })
      }

      self.$refs.interfaceError.init(param);
    })
  }

  function getStaticList(){
    staticList().then(function(res){
      if(!res.errcode){
        self.errorTotal = res.data.interfaceError || 0 + ' 个';
        self.averageTime = res.data.loadTime || 0 + ' 毫秒';
        self.errorUser = res.data.errUserCount || 0 + ' 个';
        self.errorUserID = res.data.erruserName || '无错误用户';
      }
    })
  }

  function getMapShow(){
    self.$refs.map.init({
      content:{
        height: '100%',
        width: '100%',
        ref: 'map',
        id:'mainMap'
      },
      option:{}
    })
    mapShow().then(function(res){
      if(!res.errcode){
        var mapData = [];
        res.data.forEach(function(ele){
          mapData.push({
            name:'',
            value: ele.users,
            coord: ele.geometry.split(',')
          })
        })
        self.$refs.map.setData(mapData)
      }
    })

    self.$refs.map.mapClick = function(data){
      var param = {
        location: data.data.coord.join(',')
      }
      queryErrorByLocation({parameter:JSON.stringify(param)}).then(function(res){
        if(!res.errcode){
          self.showMapDetail= true;
          if(res.data.length != 0){
            var tempName = [];
            res.data.forEach(function(ele){
              tempName.push(ele.userName);
            })
            self.mapDetail = '接口报错用户有： ' + tempName.join(', ');
          }else{
            self.mapDetail = '无报错信息';   
          }
        }
      })
    }
  }

  function jumpToDetail(){
    window.open('index.html#/query');
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .container {
    height: 100%;
    width: 100%;
  }
  .container{
    height: 100%;
    display:flex; /*设为伸缩容器*/
    // flex-flow:row; /*伸缩项目单行排列*
    // align-items: center; /* 上下居中 */
    .stable {
      height: 82%;
      width: 35%; /*固定宽度*/////////////////
      padding-top: 5%;
      .arrange-v{
        height:28%;//右下角容器高度（单独）
        width:85%;
        margin: 10% auto;//容器间距
        padding-top: 2%;
        color: #0eb3cf;
        background:rgba(40, 50, 50, 0.66);
        box-shadow: 1px 1px 10px #d2f6fc;
      }
      ul {
        list-style: none;
        text-align: left;
        li{
          margin: 5% 0px 5% -5%;
          color: #feb477;
          font-size: 13px;
          line-height: 100%;
          .resultSpan{
            color: #55decd;
            margin-left: 2%;
            font-size: 120%; 
          }
        }
        .errorTip{
          position: absolute;
          left: 55%;
          top:250%;
          padding: 2% 3%;
          background-color: #5b7b8a;
          border-radius: 2%;
          box-shadow: rgb(255, 255, 255) 0px 0px 7px;
        }
      }
    }
    .change {
      flex:1; /*这里设置为占比1，填充满剩余空间*/
      height: 100%;
      min-width: 40%;
      position: relative;
      .mapDetail{
        width: 50%;//usererror
        min-height: 7%;
        position: absolute;
        top: 17%;
        background-color: #999;
        left: 10%;
        -webkit-box-shadow: 0 0 6px #fff;
        box-shadow: 0 0 6px #fff;
        color: #fff;
        padding: 1% 0 0 1%;
        font-size: 14px;
      }
      .systemTitle{
        position: absolute;
        width:250%;
        height: 13.5%;
        top: 0.2%;
        left: -75%;
        margin: auto;
        
      }
      .jumpToDetail{
        position: absolute;
        width: 20px;
        height: 20px;
        background-size: 130%;
        top: 0.8%;
        left: 170%;
        // right: 52px;
        cursor: pointer;
      }
    }

    .close {
        position: absolute;
        right: -14px;
        top: -11px;
        width: 20px;
        height: 20px;
        background: silver;
        border-radius: 25px;
        -webkit-box-shadow: 2px 2px 5px 0px black;
        box-shadow: 2px 2px 5px 0px black;
        cursor: pointer;
    }

    .close:hover {
        background: #ddd;
    }
    .close:before {
        position: absolute;
        content: '';
        width: 17px;
        height: 2px;
        background: white;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        top: 9px;
        left: 2px;
    }
    .close:after{
        content: '';
        position: absolute;
        width: 17px;
        height: 2px;
        background: white;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        top: 9px;
        left: 2px;
    }
  }
</style>

