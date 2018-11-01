<template>
    <div>
        <div class="nodata" v-show="noData">
            <h3>{{noDataTitle}}</h3>
            <span>无数据</span>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
let chartObj,vueObj = {};

export default {
    data() {
        return {
            noData: false,
            noDataTitle: ''
        }
    },
    props: [],
    mounted: function () {
        vueObj[this.$options._parentVnode.data.ref] = this;
    },
    methods: {
        init: init,
        setOption: setOption,
        setData: setData
    }
}

function init(param){
    initContent(param.content);
    var option = JSON.parse(JSON.stringify(param.option));
    option.ref = param.content.ref;
    initChart(option);
}

/**
 * 初始化表格框样式
 */
function initContent(content){
    content = content || {};
    vueObj[content.ref].$el.id = content.id || createUUID();

    var style = {
        height:  '10%',//饼状图的大小
        width:  '100%',
        position: 'relative'
    }
    for(var o in style){
        vueObj[content.ref].$el.style[o] = style[o];
    }
}

/**
 * 初始化表格配置
 */
function initChart(option){
    if(option.data.length>0){
        vueObj[option.ref].noData = false;
        var extendOption = {
            backgroundColor: 'rgba(51,51,51,0)',
            title: {
                text: '' || option.title,
                x: '30%',
                // y:'-1%',
                textStyle: {
                    color: '#FFF',
                    fontWeight: 'normal',
                    fontSize: 16
                }
            },
        tooltip: {},
        xAxis: {
            show: false
            },
        yAxis: {
            show: false
        },
        series:[{
            radius:['80%', '100%'],
            center: ['50%', '50%'],
            name: '',
            type:'pie',
            sort: 'ascending', 
            color: ['#03f7f6','#256efb'],
            itemStyle: {
                normal: { 
                    shadowBlur: 200,
                    // shadowColor: 'rgba(255, 255, 255, 0.5)',
                    label : {
                        show : false   //隐藏标示文字
                    },
                    labelLine : {
                        show : false   //隐藏标示线
                    },
                    emphasis:{
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 15,
                        shadowColor: '#fed7b7'
                             }
                        },
                        borderWidth: 1,
                        borderColor: '#35f0fc'
                       },
            data: option.data || [],
            detail : {
                    formatter:'{value}%',
                    // shadowColor : '#ccc', //默认透明
                    // shadowBlur: 5,
                    offsetCenter: ['50%', '50%'],       // 数字位置[x,y]
                    textStyle: {  // 仪表盘下方文字样式
                        fontWeight: 'bolder',
                        color: '#02fee9'
                    }
                },
            },
        ]
        
    };

        chartObj = echarts.init(document.getElementById(vueObj[option.ref].$el.id), 'dark');
        chartObj.setOption(extendOption);
    }else{
        vueObj[option.ref].noData = true;
        vueObj[option.ref].noDataTitle = option.title;
    }
}

/**
 * 设置图标配置信息
 */
function setOption(option){
    if(option.data.length > 0){
        var extendOption = {
        title: { 
            text: '' || option.title,
            // x: '10%',
            },
        tooltip: {},
        xAxis: {
            show: false
        },
        yAxis: {
            show: false
        },
        series: [{
            name: '作业员在线统计',
            type: 'pie',
            data: option.data || []
        }]};
        chartObj.setOption(extendOption);
    }else{
        self.$el.id.text = '无数据'
    }
}

/**
 * 设置图表数据
 * @param {Array} data 图表数据
 */
function setData(data){
    var option = chartObj.getOption();
    option.series[0].data = data;
    chartObj.setOption(option);
}

/**
 * 随机生成ID
 * @return {String} ID值
 */
function createUUID(){
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return ('uuid_' + S4() + S4() + '_' + S4() + '_' + S4());
}

</script>
<style scoped lang="less">
</style>
