<template>
  <div style="background: #f6f4f5;width:100%;height:100%">
    <div class="container">
      <div class="left" style="background: url(static/leftbg.png);background-size: 100% 100%;z-index:999;"> //图片
      <!-- <div class="left" style="background-image: linear-gradient(180deg, #5f6ef7 40%,#9d47f3 150%);z-index:999;"> -->
        <div class="left-title">
          <img src="static/logo2.png" style="max-height:60%;max-width:70%;">
        </div>
        <div class="left-bot" >
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="rgba(0,0,0,0.03)" text-color="#fff" style="border-right-width: 0">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu" style="color:#02effe;width:40px"></i>
                <span>列 表 信 息 类<span style="color:red">*</span></span>
              </template>
              <el-menu-item-group style="font-size:12px;color:#fff;padding-left:15%">
                <el-select v-model="type" v-on:change="changeType"  style="width:80%;height:10%" placeholder="请选择类型"><el-option label="异常" value="1">异常</el-option><el-option label="请求" value="2">请求</el-option></el-select>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-edit" style="color:#02effe;width:40px"></i>
                <span>用 户 ID 查 找</span>
              </template>
              <el-menu-item-group style="padding-left:15%">
                <el-input type="input" placeholder="请输入用户ID" v-model="userid" style="width:80%;height:10%" />
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-time" style="color:#02effe;width:40px"></i>
                <span>查 询 时 间 段<span style="color:red">*</span></span>
              </template>
              <el-menu-item-group style="font-size:14px;color:#fff;padding-left:5%">
                开始:&nbsp;<el-input type="datetime-local" v-model="startTime" style="width:70%;height:10%"/><br><br>
                结束:&nbsp;<el-input type="datetime-local" v-model="endTime" style="width:70%;height:10%"/>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <div class="leftbutton">
          <el-button type="primary" icon="el-icon-search"  v-on:click="query" @click="onSearch" style="background-color:#02effe;border:0px;font-size:14px;font-weight:bold;">查询</el-button>
          </div>  
        </div>  
      </div>
      <div class="toptitle" style="z-index:950;">
          <img src="static/title-query.png" style="height:75%;width:10%;padding:0.5% 0 0 50%">
      </div>
      <div class="right">
        <div class="rightitle" >
          <span style="font-size:16px;color:#333;font-Weight: bold"><img src="static/statistical.png" style="width:2%;height:1%">&nbsp;统计信息[statistical information]</span>
        </div>
        <div class="radar">
            <div class="cpu">
              <div class="cpu-text">
                <span style="font-size:12px;color:#fcfcfc">内存使用率 </span><span class="resultSpan">{{CPUUse}}</span><span style="font-size:14px;color:#fcfcfc">百分比(%)</span>
              </div>
              <div class="cpu-radar" id="leftChartop"></div>
            </div>
            <div class="lTime">
              <div class="lTime-text">
                  <span style="font-size:12px;color:#fcfcfc">页面渲染耗时 </span><span class="resultSpan">{{loadPageTime}}</span><span style="font-size:12px;color:#fcfcfc">毫秒(ms)</span>
              </div>
              <div class="lTime-radar" id="leftChartbot"></div>
            </div>
            <div class="iTime">
              <div class="iTime-text">
              <span style="font-size:12px;color:#fcfcfc">接口平均耗时 </span><span class="resultSpan">{{interfaceTime}}</span><span style="font-size:12px;color:#fcfcfc">毫秒(ms)</span>
              </div>
              <div class="iTime-radar" id="rightChartop"></div>
            </div>
            <div class="iError">
              <div class="iError-text">
                <span style="font-size:12px;color:#fcfcfc">接口错误数 </span><span class="resultSpan">{{InterfaceError}}</span><span style="font-size:12px;color:#fcfcfc">个数(个)</span>
              </div>
                <div class="iError-text" id="rightChartbot"></div>
            </div>
        </div>
        <div class="rightitle" >
          <span style="font-size:16px;color:#333;font-Weight: bold"><img src="static/list.png" style="width:2%;height:1%">&nbsp;列表信息[List information]</span>
        </div>
        <div class="rightbot">
          <div class="leftarea" style="background: #fff;width:49%;height:100%;box-shadow: 6px 6px 4px rgba(204,204,204,0.8);">
            <div style="padding-top:1%">
              <span style="font-size:14px;color:background-image: linear-gradient(0deg, #fff 0%,#000 100%);;font-Weight: bold;padding-left:40%">错误信息列表</span><br>
              <div class="tableSpan" id="tableEle" style="padding: 2% 3% 0% 3%;">
                <grid ref="Grid"></grid>
              </div>
              <div class="dragLine" v-on:drag="dragDetail" >
                <div class="arrow" v-on:drag="dragDetail"></div>
              </div>
            </div>
          </div>
          <div style="background: #fff;width:49%;height:100%;box-shadow: 6px 6px 4px rgba(204,204,204,0.8);">
            <div class="tableDetail" id="detailEle" style="padding-top:1%">
              <span style="font-size:14px;color:#000;font-Weight: bold">具体错误信息</span><br>
              <div class="textArea" >{{errorDetail}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import grid from './grid.vue';
  import echarts from 'echarts';
  import { detailList } from '../dataService/api';
  var self, currentPage = 1, myChartlefttop,myChartleftbot,myChartrighttop,myChartrightbot;

  export default {
    name: 'Query',
    data () {
      return {
        userid:'',
        type: '请先选择类型',
        date: '',
        time: '',
        startTime: initDate(86400000),
        endTime: initDate(),
        CPUUse: '无数据',
        colWidth: 180,
        loadPageTime: '无数据',
        interfaceTime: '无数据',
        InterfaceError: '无数据',
        errorDetail: '',
      }
    },
    props: [],
    mounted:function(){
      self = this;
      lastY = document.getElementsByClassName('dragLine')[0].offsetTop; //鼠标的位置
      initGrid();
      leftChartop(0);
      leftChartbot(0);
      rightChartop(0);
      rightChartbot(0);
    },
    components: {
      grid
    },
    methods: {
      query: query,
      changeType: changeType,
      dragDetail: dragDetail,
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      onSearch() {//加载动画
        const loading = this.$loading({
          lock: true,
          text: '拼命获取数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          target: document.querySelector('.div1')
        });
        setTimeout(() => {
          loading.close();
        }, 3000);
      },
    }
  }

  function initGrid(){
    self.$refs.Grid.tableData = [];
    setTableColunm();
    self.$refs.Grid.onRowClick = function(rowData){
      if(self.type == 1){
        self.errorDetail = rowData.errorStack;
      }else{
        self.errorDetail = rowData.track;
      }
    }
    self.$refs.Grid.changePage = function(pageNo){
      currentPage = pageNo;
      query(pageNo);
    }
    self.$refs.Grid.initContent({
      id: 'detailTable',
      ref: 'Grid',
      height: document.getElementsByClassName('tableSpan')[0].offsetHeight
    });
  }

  function changeType(){
    setTableColunm();
    self.$refs.Grid.tableData = [];
  }

  var lastY;
  function dragDetail(e){
    var tableObj = document.getElementsByClassName('tableSpan')[0];
    var detailObj = document.getElementsByClassName('tableDetail')[0];
    var rightHeight = document.getElementsByClassName('middleArea')[0].offsetHeight;
    if(tableObj.offsetHeight < 300){
      tableObj.style.height = '300px';
      detailObj.style.height = rightHeight-300 + 'px';
      lastY = document.getElementsByClassName('dragLine')[0].offsetTop;
      return;
    }
    if(detailObj.offsetHeight < 100){
      detailObj.style.height = '100px';
      tableObj.style.height = rightHeight-100 + 'px';
      lastY = document.getElementsByClassName('dragLine')[0].offsetTop;
      return;
    }
    if(e.clientY == 0){
      return;
    }
    var moveY = e.clientY - lastY;
    lastY = e.clientY;
    tableObj.style.height = tableObj.offsetHeight + moveY + 'px';
    detailObj.style.height = detailObj.offsetHeight - moveY + 'px';
  }

  function setTableColunm(){
    var outerWidth = document.getElementsByClassName('tableSpan')[0].offsetWidth-5;
    if(self.type == 1){
      self.$refs.Grid.cols = [{
        label: '列号',
        prop: 'col',
        width: outerWidth/36
      },{
        label: '登录用户',
        prop: 'userName',
        width: outerWidth/36
      },{
        label: '错误概述',
        prop: 'errorMsg',
        width: outerWidth/9
      },{
        label: '错误详细',
        prop: 'errorStack',
        width: outerWidth*3/18
      },{
        label: '行号',
        prop: 'line',
        width: outerWidth/36
      },{
        label: '日期',
        prop: 'msg',
        width: outerWidth/9
      },{
        label: '服务时间',
        prop: 'serviceTime',
        width: outerWidth/9
      },{
        label: '接口url',
        prop: 'url',
        width: outerWidth/9
      },{
        label: '用户token',
        prop: 'userToken',
        width: outerWidth/9
      },{
        label: 'web时间',
        prop: 'webTime',
        width: outerWidth/9
      }]
    }else{
      self.$refs.Grid.cols = [{
        label: '接口状态',
        prop: 'flag',
        width: outerWidth/36,
        formatter:function(rowData){
          return rowData.flag === 0? '成功': '失败';
        }
      },{
        label: '参数',
        prop: 'param',
        width: outerWidth/9
      },{
        label: '登录用户',
        prop: 'userName',
        width: outerWidth/25
      },{
        label: '服务时间',
        prop: 'serviceTime',
        width: outerWidth/9
      },{
        label: '栈信息',
        prop: 'track',
        width: outerWidth*2/9
      },{
        label: '接口url',
        prop: 'url',
        width: outerWidth/9
      },{
        label: '接口耗间',
        prop: 'useTime',
        width: outerWidth/25
      },{
        label: '用户token',
        prop: 'userToken',
        width: outerWidth/9
      },{
        label: 'web时间',
        prop: 'webTime',
        width: outerWidth/9
      }]
    }
  }

  /**
   * 初始化时间
   */
  function initDate(time){
    time = time || 0;
    var currentDate = new Date(new Date().getTime() - time);
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()>8? (currentDate.getMonth() + 1) :'0' + (currentDate.getMonth() + 1);
    var day = currentDate.getDate()>9? currentDate.getDate() : '0' + currentDate.getDate();
    var hour = currentDate.getHours()>9? currentDate.getHours() :'0' + currentDate.getHours();
    var minutues = currentDate.getMinutes()>9? currentDate.getMinutes() : '0' + currentDate.getMinutes();
    return year + '-' + month + '-' + day + 'T' + hour + ':' + minutues;
  }
  /**
   * 根据条件查询
   */
  function query(pageNo){
    initDetail();
    function dealDate(time, char){
      var tempStr = time;
      char.forEach(function(ele){
        tempStr = tempStr.split(ele).join('');
      })
      return tempStr + '00';
    }

    var param = {
      begin: dealDate(self.startTime,['-','T',':']),
      end: dealDate(self.endTime,['-','T',':']),
      userId: self.userid,
      pageSize: self.$refs.Grid.pageSize,
      pageNo: currentPage,
      type: self.type
    }
    detailList({parameter: JSON.stringify(param)}).then(function(res){
      if(!res.errcode){
        self.CPUUse = (res.data.overview.useRate*100).toFixed(2);//小数点后取两位
        self.loadPageTime = res.data.overview.loadTimeout;
        self.interfaceTime = res.data.overview.interfaceTime;
        self.InterfaceError = res.data.overview.interfaceErrors;
        self.$refs.Grid.tableData = res.data.list;
        leftChartop(parseInt(res.data.overview.useRate*100).toFixed(2));
        leftChartbot(parseInt(res.data.overview.loadTimeout));
        rightChartop(parseInt(res.data.overview.interfaceTime));
        rightChartbot(parseInt(res.data.overview.interfaceErrors));
        setTimeout(function(){
          self.$refs.Grid.refreshWidth();
        },100)
      }
    })
  }

  function initDetail(){
    self.$refs.Grid.tableData = [];
    self.CPUUse = '无数据';
    self.loadPageTime = '无数据';
    self.interfaceTime = '无数据';
    self.InterfaceError = '无数据';
  }

  function leftChartop(data){//左上
    let option = {
        tooltip : {
            formatter: "{a} {b} :<br/> {c}%"//tip内容
        },
        toolbox: {
            // feature: {
            //     restore: {},//重置
            //     saveAsImage: {} //下载
            // }
        },
        series: [
            {
                name: '内存使用率',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '70%',
                pointer: { //指针样式
                        show: true,
                        //指针长度
                        length:'80%',
                        shadowColor : '#fff', //默认透明
                        width:3,
                    },
                axisLine: {            // 仪表盘坐标轴
                  lineStyle: {       // lineStyle控制线条样式
                    // color: [[0.1, '#02fee9'],[0.3, '#02c6fe'],[0.5, '#0290fe'],[0.8, '#0267fe'],[1, '#0249fe']],
                    color: [[0.25, '#fcc3b7'],[0.5, '#fc8d76'],[0.75, '#fb765b'],[1, '#fc5330']],
                    width: 2,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontSize: 8,
                        color: '#fff',//数字颜色
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 5,         // length控制线长
                    lineStyle: {       // lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    formatter:'{value}%',
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
                        fontSize: 14,
                        fontWeight: 'bolder',
                        color: '#02fee9'
                    }
                },
                data: [{value: data}]
            }
        ]
    };
    if(!myChartlefttop){
      myChartlefttop = echarts.init(document.getElementById('leftChartop'));
    }
    myChartlefttop.setOption(option, true);
  }
  
  function leftChartbot(data){//左下
      let option = {
          tooltip : {
              formatter: "{a} {b} :<br/> {c}毫秒"
          },
          toolbox: {
              // feature: {
              //     restore: {},
              //     saveAsImage: {}
              // }
          },
            series: [
              {
                name: '页面渲染耗时',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '70%',
                pointer: { //指针样式
                        show: true,
                        //指针长度
                        length:'80%',
                        shadowColor : '#fff', //默认透明
                        width:3,
                    },
                axisLine: {            // 仪表盘坐标轴
                  lineStyle: {       // lineStyle控制线条样式
                    // color: [[0.1, '#02fee9'],[0.3, '#02c6fe'],[0.5, '#0290fe'],[0.8, '#0267fe'],[1, '#0249fe']],
                    color: [[0.09, '#fff'],[0.82, '#dcddde'],[1, '#ccc']],
                    width: 2,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontSize: 8,
                        color: '#fff',//数字颜色
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 5,         // length控制线长
                    lineStyle: {       // lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#03f8f6',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    formatter:'{value}',
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
                        fontSize: 14,
                        fontWeight: 'bolder',
                        color: '#02fee9'
                    }
                },
                data: [{value: data}]
              }
            ]
      };
      if(!myChartleftbot){
        myChartleftbot = echarts.init(document.getElementById('leftChartbot'));//初始化图表
      }
      myChartleftbot.setOption(option, true);
    }



  function rightChartop(data){//右上
    let option = {
        tooltip : {
            formatter: "{a} {b} :<br/> {c}毫秒"
        },
        toolbox: {
            // feature: {
            //     restore: {},
            //     saveAsImage: {}
            // }
        },
        series: [
            {
                name: '接口平均耗时',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '70%',
                pointer: { //指针样式
                        show: true,
                        //指针长度
                        length:'80%',
                        shadowColor : '#fff', //默认透明
                        width:3,
                    },
                axisLine: {            // 仪表盘坐标轴
                  lineStyle: {       // lineStyle控制线条样式
                    // color: [[0.1, '#02fee9'],[0.3, '#02c6fe'],[0.5, '#0290fe'],[0.8, '#0267fe'],[1, '#0249fe']],
                    color: [[0.09, '#fff'],[0.82, '#dcddde'],[1, '#ccc']],
                    width: 2,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontSize: 8,
                        color: '#fff',//数字颜色
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 5,         // length控制线长
                    lineStyle: {       // lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#03f8f6',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    formatter:'{value}',
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
                        fontSize: 14,
                        fontWeight: 'bolder',
                        color: '#02fee9'
                    }
                },
                data: [{value: data}]
            }
        ]
    };
    if(!myChartrighttop){
      myChartrighttop = echarts.init(document.getElementById('rightChartop'));//初始化图表
    }
    myChartrighttop.setOption(option, true);
  }


  function rightChartbot(data){//右下
    let option = {
        tooltip : {
            formatter: "{a} {b} :<br/> {c}个"
        },
        toolbox: {
            // feature: {
            //     restore: {},
            //     saveAsImage: {}
            // }
        },
        series: [
            {
                name: '接口错误数',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '70%',
                pointer: { //指针样式
                        show: true,
                        //指针长度
                        length:'80%',
                        shadowColor : '#fff', //默认透明
                        width:3,
                    },
                axisLine: {            // 仪表盘坐标轴
                  lineStyle: {       // lineStyle控制线条样式
                    // color: [[0.1, '#02fee9'],[0.3, '#02c6fe'],[0.5, '#0290fe'],[0.8, '#0267fe'],[1, '#0249fe']],
                    color: [[0.25, '#fcc3b7'],[0.5, '#fc8d76'],[0.75, '#fb765b'],[1, '#fc5330']],
                    width: 2,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontSize: 8,
                        color: '#fff',//数字颜色
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 5,         // length控制线长
                    lineStyle: {       // lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#03f8f6',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    formatter:'{value}%',
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
                        fontSize: 14,
                        fontWeight: 'bolder',
                        color: '#02fee9'
                    }
                },
                data: [{value: data}]
            }
        ]
    };
    if(!myChartrightbot){
      myChartrightbot = echarts.init(document.getElementById('rightChartbot'));//初始化图表
    }
    myChartrightbot.setOption(option, true);
  }


</script>

<style scoped lang="less">
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: space-around;
    flex-flow: row;
    .left{
      width: 20%;
      height: 100%;
      display: flex;
      flex-flow: column;
      .left-bot {
        height: 70%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        justify-content: space-between;
      }
      .left-title {
        height: 20%;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: center;
      }
      span{
        line-height: 20%;//顶部背景高度
        font-size: 14px;
        font-Weight: bold;
      }
      .leftbutton {
        display: flex;
        justify-content: center;
      }
    }

    
    .toptitle {
      background: #fff;
      box-shadow: 0px 5px 4px rgba(0,0,0,0.1),;
      position: absolute;
      width: 100%;
      height: 7%;
    }
    .right{
      width:80%;
      height: 85%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      padding: 5% 2% 1% 2%;
      .rightitle {
        height: 15%;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
      }
      .timeimg {
        height: 20%;
        width: 100%;
        display: flex;
        flex-flow: row;
        justify-content: flex-end;
        align-items: center;
      }
        .datetime {
          font-size: 14px;
          color: #333;
        }
      .radar {
        width: 100%;
        height: 25%;
        display: flex;
        justify-content: center;
        justify-content: space-around;
        align-items: center;
        .cpu {
          background: rgb(95, 110, 247);
          box-shadow: 6px 6px 4px rgba(204,204,204,0.8);
          display: flex;
          flex-flow: row;
          justify-content: space-around;
          align-items: flex-start;
          width:23%;
          height:90%;
          border-radius: 8px;
          .cpu-text {
            width: 50%;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: center;
          }
          .cpu-radar {
            width: 50%;
            height: 100%;
          }
        }
        .lTime {
          background: rgb(157, 71, 243);
          box-shadow: 6px 6px 4px rgba(204,204,204,0.8);
          display: flex;
          flex-flow: row;
          justify-content: space-around;
          align-items: flex-start;
          width:23%;
          height:90%;
          border-radius: 8px;
          .lTime-text {
            width: 50%;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: center;
          }
          .lTime-radar {
            width: 50%;
            height: 100%;
          }
        }
        .iTime {
          background: rgb(255, 114, 86);
          box-shadow: 6px 6px 4px rgba(204,204,204,0.8);
          display: flex;
          flex-flow: row;
          justify-content: space-around;
          align-items: flex-start;
          width:23%;
          height:90%;
          border-radius: 8px;
          .iTime-text {
            width: 50%;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: center;
          }
          .iTime-radar {
            width: 50%;
            height: 100%;
          }
        }
        .iError {
          background: rgb(52, 153, 248);
          box-shadow: 6px 6px 4px rgba(204,204,204,0.8);
          display: flex;
          flex-flow: row;
          justify-content: space-around;
          align-items: flex-start;
          width:23%;
          height:90%;
          border-radius: 8px;
          .iError-text {
            width: 50%;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: center;
          }
          .iError-radar {
            width: 50%;
            height: 100%;
          }
        }
          .resultSpan{
            color: #fff;//左方数据颜色蓝色
            // margin-left: 5px;
            font-Weight: bold;
            font-size: 14px; 
          }
      }
      .rightbot {
        width: 100%;
        height: 70%;
        display: flex;
        flex-flow: row;
        justify-content: space-around;
        align-items: flex-end;
        .leftArea {
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: flex-start;
          .tableSpan {
            height: 100%;
            overflow:hidden;
          }
          .dragLine {
            width: 50%;
            height: 100%;
            position: relative;
            cursor: n-resize;
            z-index: 100;
            // margin-top: -5px;
            .arrow {
              width: 0;
              height: 0;
              color: #03f8f6;
              // border-bottom: 10px solid #57d2de;
              // border-left: 14px solid transparent;
              // border-right: 14px solid transparent;
              position: absolute;
              left: 0;
              right: 0;
              // top: -14px;
              cursor: n-resize;
              margin: auto;
            }
          }
        }
        .tableDetail {
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .textArea {//具体错误信息
          color:#333;
          font-size: 12px;
          font-weight:bold;
          width: 90%;
          border:none;
          overflow:hidden
        }      
      }
    }
  }
</style>

