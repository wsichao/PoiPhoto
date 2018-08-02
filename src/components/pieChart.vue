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
        height: content.height || '100%',
        width: content.width || '100%'
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
        var piePatternSrc1 = 'data:image/jpeg;base64,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';
        var piePatternImg1= new Image();
        piePatternImg1.src = piePatternSrc1;
        var extendOption = {
            backgroundColor: 'rgba(51,51,51,0)',
            title: {
                text: '' || option.title,
                x: 'center',
                textStyle: {
                    color: '#02fdf6',
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
            radius:option.radius || ['40%', '60%'],
            center: ['50%', '60%'],
            name: '',
            type:'pie',
            sort: 'ascending', 
            width: '40%', 
            color: function(params) {
                // build a color map as your need.
                var colorList = [
                    {image: piePatternImg1},'#fe4200','#f79c5f','#E87C25','#27727B',
                    '#f9b238','#63cab1','#ff8e09','#fbe26b','#fc28e1',
                    '#ffd776','#C6E579','#f9b238','#e0fb00','#ff8e09','#fe6702',{image: piePatternImg1}
                    ];
                return colorList[params.dataIndex]
                },
            itemStyle: {
                // normal: {
                //     emphasis:{
                //         shadowOffsetX: 0,
                //         shadowOffsetY: 0,
                //         shadowBlur: 15,
                //         shadowColor: '#fed7b7'
                //              }
                //         },
                        borderWidth: 1,
                        borderColor: '#35f0fc'
                       },
            // color:['#32A8FF',' #02C800'],
            // itemStyle: {
            //      normal: {
            //         opacity: 1,
            //         color: {
            //         image: piePatternImg1,
            //         },
            //         borderWidth: 1.5,
            //         borderColor: '#35f0fc'
            //     }
                
            // },
            data: option.data || [],
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
        title: { text: '' || option.title},
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
