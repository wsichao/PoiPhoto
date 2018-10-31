<template>
  <div class="container" style="z-index:999">
    <div class="stable" >
      <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
          用户在线人数
      </div>
      <pie-chart class="arrange-v" ref="userOnline"  style="background-size: 100% 100%;">
      </pie-chart>
      <!-- background: url(static/box.png); -->
      <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
          接口请求耗时TOP10省份
      </div>
      <bar-chart class="arrange-v" ref="interfaceTime" style="background-size: 100% 100%;" >
      </bar-chart>
      <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
          页面渲染耗时TOP10省份
      </div>
      <bar-chart class="arrange-v" ref="loadPageTime"  style="background-size: 100% 100%;">
      </bar-chart>
      <div class="timeimg" ><img src="static/radar.png" style="width:24%;height:80%">
        <div class="timefont">
          <div class="datetime" >Date:{{date}}</div>
          <div class="datetime" >Time:{{time}}</div>
        </div>
      </div>
    </div>
    <div class="change" style="z-index:1">
      <map-chart ref="map"></map-chart>
      <div class="mapDetail" v-show="showMapDetail">
        {{mapDetail}}
        <div class="close" v-on:click="showMapDetail=false"></div>
      </div>
      <div class="systemTitle">
        <img src="static/title.png" style="width:100%;height:auto">
      </div>
      <div class="jumpToDetail" style="background-image: url(static/jump1.png);background-size: 100% 100%" title="跳转至详情页面" v-on:click="jumpToDetail"></div>
    </div>
    <div class="stable">
        <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
        Chrome各版本使用占比
        </div>
      <pie-chart class="arrange-v" ref="browser"style="background-size: 100% 100%;">
      </pie-chart>
      <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
        接口错误统计TOP10省份
        </div>
      <bar-chart class="arrange-v" ref="interfaceError"style="background-size: 100% 100%;"></bar-chart>
        <div class="right-a" style="background: url(static/box.png);background-size: 100% 100%">
          近一月信息
        </div>
      <div class="arrange-v" style="background-size: 100% 100%;">
        <ul>
          <li><span>近一月接口错误总数：<span class="resultSpan">{{errorTotal}}</span></span><br></li>
          <li><span>近一月接口平均耗时：<span class="resultSpan">{{averageTime}}</span></span><br></li>
          <li style="position:relative">
            <span>近一月异常人员数量：<span class="resultSpan" v-on:mouseover="showUserId=true" v-on:mouseleave="showUserId=false" style="text-decoration: underline;cursor: pointer;">{{errorUser}}</span></span>
            <div v-show="showUserId" class="errorTip"><span>错误用户ID：{{errorUserID}}</span></div>
          </li>
        </ul>
      </div>
      <div class="timeimg-right">
        <div class="timefont-right">
          <div class="datetime" style="font-size:16px;"> W e b M o n i t o r</div>
        </div>
        <img src="static/radar-right.png" style="width:24%;height:80%">
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
  function lpad(str, len, char) {
  let s = str.toString();
  let c = char || ' ';
  c = c.toString();
  while (s.length < len) {
    s = c + s;
  }
  return s;
}
  export default {
    name: 'Main',
    props: ['flag'],
    data () {
      return {
        date: '',
        time: '',
        interval: null,
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
      this.refreshDateTime();
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
      jumpToDetail: jumpToDetail,
      getDateTime() {
      const d = new Date();
      this.date = `${d.getFullYear()}-${lpad((d.getMonth() + 1), 2, '0')}-${lpad(d.getDate(), 2, '0')}`;
      this.time = `${lpad(d.getHours(), 2, '0')}:${lpad(d.getMinutes(), 2, '0')}:${lpad(d.getSeconds(), 2, '0')}`;
    },
      refreshDateTime() {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }

        this.interval = setInterval(() => {
          this.getDateTime();
        }, 1000);
      },
    }
  }

  function initUserOnline(){
    userOnline().then(function(res){
      self.$refs.userOnline.init({
        content: {
          id: 'userOnlinePie',
          height:'40%',
          width: '75%',
          ref: 'userOnline'
        },
        option: {
          // title: '用户在线、离线数统计',
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
         height:'40%',
          width: '75%',
          ref: 'interfaceTime'
        },
        option: {
          // title: '接口请求耗时TOP10省份',
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
          height:'40%',
          width: '75%',
          ref: 'loadPageTime'
        },
        option: {
          // title: '页面渲染耗时TOP10省份',
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
          height:'40%',
          width: '75%',
          ref: 'browser'
        },
        option: {
          // title: 'Chrome各版本使用占比',
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
          height:'40%',
          width: '75%',
          ref: 'interfaceError'
        },
        option: {
          // title: '接口错误统计TOP10省份',
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
    display:flex; /*设为伸缩容器*/
    // align-content: flex-start;
    // flex-flow:row; /*伸缩项目单行排列*/
    // align-items: center; /* 上下居中 */
    .stable {
      height:48%;
      width: 38%; /*固定宽度*/////////////////
      text-align: center;
      padding-top: 6%;
      padding-left: 4%;
      .timeimg {
        height: 20%;
        width: 100%;
        display: flex;
        padding-top: 13%;
      }
      .timeimg-right {
        height: 20%;
        width: 100%;
        display: flex;
        padding-top: 21%;
        // align-items: flex-start;
        justify-content: center;
      }
      .timefont {
        display: flex;
        justify-content: center;
        flex-flow:column; /*伸缩项目单行排列*/
        align-items: center
      }
      .timefont-right {
        display: flex;
        justify-content: center;
        flex-flow:column; /*伸缩项目单行排列*/
        align-items: center
      }
        .datetime {
          font-size: 16px;
          color: #47a2ff;
          text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
        }
      .arrange-v{
        height: 30%;
        width: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .right-a{
        height: 15%;
        width: 85%;
        font-size: 14px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      ul {
        list-style: none;
        text-align: left;
        padding-left: 15%;
        padding-top: 10%;
        li{
          height: 50%;
          width: 100%;
          color: #fff;
          font-size: 14px;
          line-height: 300%;
          .resultSpan{
            color: #55decd;
            font-size: 12px; 
          }
        }
        .errorTip{
          width: 100%;
          height: 100%;
          position: absolute;
          padding: 3% 3%;
          border-radius: 10px;
          background-color: rgba(30,144,255,0.3);
          // box-shadow: rgb(255, 255, 255) 0px 0px 7px;//tip边框外发光
        }
      }
    }
    .change {
      // flex:1; /*这里设置为占比1，填充满剩余空间*/
      height: 100%;
      min-width: 40%;
      position: relative;
      .mapDetail{
        width: 91%;//usererror
        min-height: 10%;
        position: absolute;
        top: 76%;
        background-color: rgba(30,144,255,0.3);
        border-radius: 5;//边框圆角
        left: 4%;
        color: #03ccf0;
        padding: 1% 0 0 1%;
        font-size: 12px;
      }
      .systemTitle{
        position: absolute;
        width:250%;
        height: 16%;
        top: 0.2%;
        left: -75%;
        margin: auto;
      }
      .jumpToDetail{
        position: absolute;
        width: 9%;
        height: 7%;
        top: 20%;
        left: 100%;
        -webkit-transition: -webkit-transform 0.9s ease-out;
        -moz-transition: -moz-transform 0.9s ease-out;
        -o-transition: -o-transform 0.9s ease-out;
        -ms-transition: -ms-transform 0.9s ease-out;
        // right: 52px;
        cursor: pointer;
      }
      .jumpToDetail:hover {//旋转效果
        // transform: scale(0.5);//缩放比例
        -webkit-transform: rotateZ(360deg);
        -moz-transform: rotateZ(360deg);
        -o-transform: rotateZ(360deg);
        -ms-transform: rotateZ(360deg);
        transform: rotateZ(360deg);
      }
    }
    .close {
        position: absolute;
        right: -14px;
        top: -11px;
        width: 20px;
        height: 20px;
        background: #03ccf0;
        border-radius: 25px;
        -webkit-box-shadow: 2px 2px 5px 0px black;
        box-shadow: 2px 2px 5px 0px black;
        cursor: pointer;
    }

    .close:hover {
        background: #03ccf0;
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

