<template>
  <div style="background: url(static/querybackground.png);background-size: 100% 100%;  width:100%;height:100%">
    <div class="container">
      <div class="systemTitle" style="background: url(static/title.png);background-size: 100% 100%;"></div>
      <div class="queryArea">
        <span><el-input type="input" placeholder="请输入用户ID" v-model="userid" /></span>
        <span>类型：<el-select v-model="type" v-on:change="changeType"><el-option value="1">异常</el-option><el-option value="2">请求</el-option></el-select></span>
        <span>搜索时间：开始&nbsp;&nbsp; <el-input type="datetime-local" v-model="startTime" style="width:35%"/>&nbsp;&nbsp;~ 结束&nbsp;&nbsp;<el-input type="datetime-local" v-model="endTime" style="width:35%"/></span>
        <!-- <span>搜索时间：&nbsp;&nbsp; <el-date-picker type="date" placeholder="开始时间" v-model="startTime"></el-date-picker>&nbsp;&nbsp;~&nbsp;&nbsp;<el-date-picker type="date" placeholder="结束时间" v-model="endTime"></el-date-picker></span> -->
        <el-button type="primary" icon="el-icon-search"  v-on:click="query" @click="onSearch">查询</el-button>
      </div>
      <div class="mainArea">
        <div class="leftSpan" style="background: url(static/leftborder.png);background-size: 100% 100%;">
          <div class="nodata" v-show="noData"></div>
          <ul>
            <div id="leftChartop" style="height:200px;padding-top:10%"></div>
            <div class="li"><span>内存使用率 </span><span class="resultSpan">{{CPUUse}}</span></div>
            <div id="leftChartbot" style="height:200px"></div>
            <div class="li-down"><span>页面渲染耗时 </span><span class="resultSpan">{{loadPageTime}}</span></div>
          </ul>
        </div>
        <div class="middleArea" style="background: url(static/middleborder.png);background-size: 100% 100%;">
          <div class="tableSpan" id="tableEle">
            <grid ref="Grid"></grid>
          </div>
          <div class="dragLine" v-on:drag="dragDetail" >
            <div class="arrow" v-on:drag="dragDetail"></div>
          </div>
        </div>
        <div class="rightSpan" style="background: url(static/rightborder.png);background-size: 100% 100%;">
          <ul>
            <div id="rightChartop" style="height:200px;padding-top:10%"></div>
            <div class="li"><span>接口平均耗时 </span><span class="resultSpan">{{interfaceTime}}</span></div>
            <div id="rightChartbot" style="height:200px"></div>
            <div class="li-down"><span> 接口错误数 </span><span class="resultSpan">{{InterfaceError}}</span></div>
          </ul>
        </div>
      </div>
      <div class="tableDetail" id="detailEle" >
        <textarea style="background: url(static/textarea.png);background-size: 100% 100%;color: white;font-size: 18px">{{errorDetail}}</textarea>
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
        type: 1,
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
        }, 2000);
      }
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
        width: outerWidth/18
      },{
        label: '登录用户',
        prop: 'userName',
        width: outerWidth/18
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
        width: outerWidth/18
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
        width: outerWidth/18,
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
        width: outerWidth/9
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
        width: outerWidth/18
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
        self.CPUUse = (res.data.overview.useRate*100).toFixed(2) + '%';//小数点后取两位
        self.loadPageTime = res.data.overview.loadTimeout + ' 毫秒';
        self.interfaceTime = res.data.overview.interfaceTime + ' 毫秒';
        self.InterfaceError = res.data.overview.interfaceErrors + ' 个';
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
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '内存使用率',
                type: 'gauge',
                center: ["40%","50%"],
                radius: '90%',
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
                    color: [[0.09, '#02feae'],[0.82, '#1e90ff'],[1, '#ff4500']],
                    width: 3,
                    shadowColor : '#02fee9', //默认透明
                    shadowBlur: 20
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: 'auto',//数字颜色
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :10,        // length控制线长
                    lineStyle: {       // lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 15,         // length控制线长
                    lineStyle: {       // lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#fff',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    formatter:'{value}%',
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
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
              feature: {
                  restore: {},
                  saveAsImage: {}
              }
          },
          series: [
              {
                  name: '页面渲染耗时',
                  type: 'gauge',
                  min: 0,
                  max: 100,
                  center: ["40%","50%"],
                  radius: '90%',
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
                    color: [[0.09, '#02feae'],[0.82, '#1e90ff'],[1, '#ff4500']],
                    width: 3,
                    shadowColor : '#02fee9', //默认透明
                    shadowBlur: 20
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: 'auto',//数字颜色
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#fff',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  //文字样式
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
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '接口平均耗时',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '90%',
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
                    color: [[0.09, '#02feae'],[0.82, '#1e90ff'],[1, '#ff4500']],
                    width: 3,
                    shadowColor : '#02fee9', //默认透明
                    shadowBlur: 20
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: 'auto',//数字颜色
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#fff',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  //文字样式
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
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '接口错误数',
                type: 'gauge',
                center: ["50%","50%"],
                radius: '90%',
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
                    color: [[0.09, '#02feae'],[0.82, '#1e90ff'],[1, '#ff4500']],
                    width: 3,
                    shadowColor : '#02fee9', //默认透明
                    shadowBlur: 20
                  }
                },
                axisLabel: {            // 数字刻度样式
                    textStyle: {       // lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: 'auto',//数字颜色
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length : 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:2,
                        color: '#fff',
                        shadowColor : '#02fee9', //默认透明
                        shadowBlur: 5
                    }
                },
                detail : {
                    shadowColor : '#ccc', //默认透明
                    shadowBlur: 5,
                    offsetCenter: [0, '80%'],       // 数字位置[x,y]
                    textStyle: {  //文字样式
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
    color: #FFF;//文字颜色白色
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    // position: relative;
    // box-sizing: border-box;
    .systemTitle {
      position: absolute;
        width:100%;
        height: 15.5%;
        top: 0.2%;
        margin: auto;
    }
    .queryArea{//顶部操作栏
      width: 100%;
      height: 10%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      padding-top:150px;
      span{
        margin: 0 0.2%;//间距
        line-height: 20%;//顶部背景高度
        padding: 12px;
        font-size: 15px;
        border-radius: 5px;
        background-color: rgba(70,130,180,0.5);//顶部灰色小方块
      }
      .queryButton{
        padding: 16px 16px;
        background-color: #03f8f6;//查询按钮颜色
        cursor: pointer;
      }
    }
    .mainArea{
      width:100%;
      height: 68.5%;
      display: flex;
      flex-flow: row;
      justify-content: space-around;
      align-content: flex-start;
      .leftSpan {//左侧边信息栏
        width: 20%;
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        // border: 1px solid #03f8f6;
        ul {
          list-style: decimal;//列表样式
          width: 100%;
          height: 100%;
          .li {
            width: 50%;
            height: 15%;
            font-size: 20px;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            // line-height: 38px;
            padding: 0% 15%;
            .resultSpan{
              color: #03f8f6;//左方数据颜色蓝色
              // margin-left: 5px;
              font-size: 20px; 
            }
          }
          .li-down {
            width: 50%;
            font-size: 20px;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            // line-height: 38px;
            padding: 0% 15%;
            .resultSpan{
              color: #03f8f6;//左方数据颜色蓝色
              // margin-left: 5px;
              font-size: 20px; 
            }
          }
        }
      }
      .middleArea {
        width: 50%;//中部元素占宽，与两侧元素间隙10%
        height: 100%;
        // border: 1px solid #03f8f6;
        .tableSpan {
          width: 99%;
          height: 99.5%;
          padding: 0.3% 0 0 0.5%;
          // border: 1px solid #03f8f6;
        }
        .dragLine {
          width: 100%;
          height: 10px;
          color: #03f8f6;
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


      
      .rightSpan {//右侧边信息栏
        width: 20%;
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        // border: 1px solid #03f8f6;
        ul {
          list-style: decimal;//列表样式
          width: 100%;
          height: 100%;
          .li {
            width: 50%;
            height: 15%;
            font-size: 20px;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            // line-height: 38px;
            padding: 0% 25%;
            .resultSpan{
              color: #03f8f6;//左方数据颜色蓝色
              // margin-left: 5px;
              font-size: 20px; 
            }
          }
          .li-down {
            width: 50%;
            font-size: 20px;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            // line-height: 38px;
            padding: 0% 25%;
            .resultSpan{
              color: #03f8f6;//左方数据颜色蓝色
              // margin-left: 5px;
              font-size: 20px; 
            }
          }
        }
      }
    }
    .tableDetail {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: center;
      padding-bottom: 0.5%;
      // border: 5px solid #03f8f6;
        textarea {
          width: 49.7%;
          height: 100%;
          // background-color: rgba(217, 221, 221);
          // margin: 0px;
          // resize: none;
          // box-sizing: border-box;
          // border: none;
        }
      // }
    }
  }
</style>

