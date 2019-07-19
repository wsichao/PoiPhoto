/**
 * @description 前端页面定义的接口调用
 * @file api.js
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';

// 统一增加token
var getReq = function (url, param) {
    if (!param) {
      poi_pid = {};
    }
    return axios.get(`${url}`, {params: param})
    .then(res => res.data)
    .catch(res => ({errcode: null}));
};

// 第一个接口获取fccpid
export const poiFccpid = param => { return getReq('http://fs-road.navinfo.com/dev-tracks/tracks/d/queryPhotoByPid?', param.poi_pid)};
