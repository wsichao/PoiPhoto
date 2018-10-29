<template>
    <div>
        <el-table :data="tableData" style="width: 100%" @row-click="onRowClick">
            <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label" :width="col.width||180" :formatter="col.formatter" :key="index">
            </el-table-column>
        </el-table>
        <el-pagination :page-size="pageSize" :current-page="pageNo" layout="prev, pager, next" :total="tableData.length" @current-change="changePage" v-show="tableData.length>0">
        </el-pagination>
    </div>
</template>

<script>

import Element,{ Loading } from 'element-ui';
let gridObj, vueObj = {};
export default {
    name: 'grid',
    data() {
        return {
            cols:[],
            pageNo: 1,
            pageSize: 16,//每页最多16行
            tableData: [],
            loading: true
        }
    },
    props: [],
    mounted: function () {
        vueObj[this.$options._parentVnode.data.ref] = this;
    },
    methods: {
        initContent: initContent,
        refreshWidth: refreshWidth,
        onRowClick: function(){},
        changePage: function(){}
    }
}

/**
 * 设置表格单元格宽度
 */
function refreshWidth(){
    var colConfig = vueObj[this.$options._parentVnode.data.ref].cols;
    var rowArr = document.getElementsByClassName('el-table__row');
    for(var i=0;i<rowArr.length; i++){
        colConfig.forEach(function(o, index){
            rowArr[i].getElementsByClassName('cell')[index].style.width = (o.width - 5) + 'px';
        })
    }
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
    document.getElementById(vueObj[content.ref].$el.id).getElementsByClassName('el-table__body')[0].style.maxHeight = (content.height - 90) +'px'
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
<style lang="less">
    .el-table td, .el-table th{
        padding: 5px 0;
    }
    .el-table {
        background-color: rgba(0,0,0,0.0);//表格背景透明
        .el-table__empty-block{
            background-color:rgba(0,0,0,0.0);//起始背景框透明
            span{
                font-size: 20px;
                color:#ccc;//起始暂无数据颜色
            }
        }
        th{
            background-color: #0d3964;//导航栏背景色
            color: #fff;//导航栏文字颜色
            // border-bottom: 1px solid rgba(70,130,180,0.5);
            // border-right:1px solid white;
        }
        tr:nth-child(odd){
            background-color:rgba(0,94,186,0.5); //首行背景色
            color: #ccc;//首行文字颜色
            cursor: pointer;
            td{
                // border-right:1px solid #999;
                // border-bottom: 1px solid #999;
            }
        }
        tr:nth-child(even){
            background-color: rgba(	30,144,255,0.6); //次行背景色
            color: #fff;//次行文字颜色
            cursor: pointer;
            td{
                // border-right:1px solid #999;
                // border-bottom: 1px solid #999;
            }
        }
        tr:hover{
            color: #000;//悬浮文字颜色
            background-color: 	rgba(128,128,128,0.2);//悬浮框背景色
        }
    }
    .el-table__body{
        width: 100px;
        max-height: 600px;
    }
    .el-table .cell{
        box-sizing: border-box;
        white-space: nowrap;
        word-break: break-all;
        line-height: 23px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .el-pagination{
        padding: 0.1% 45%;
    }
    .el-pager li, .el-pagination .btn-next, .el-pagination .btn-prev, .el-pagination .btn-next, .el-pagination .btn-prev, .el-pagination button:disabled{
        background:rgba(70,130,180,0.1);//底部导航背景色
    }
    
</style>
